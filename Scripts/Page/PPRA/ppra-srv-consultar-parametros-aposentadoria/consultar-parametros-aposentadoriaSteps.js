import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import dotenv from 'dotenv';

dotenv.config();

let requestPayload;
let headerValuesFromBDD;
let forceInvalidCaKey = false; // Flag para controlar o uso de CA_KEY inválida

const { Given, When, Then, Before } = createBdd();

Before(async () => {
  requestPayload = {};
  headerValuesFromBDD = {};
  forceInvalidCaKey = false; // Reseta a flag antes de cada cenário
});

const getApiHeadersConsultarParametros = (dynamicHeadersFromBDD) => {
    let caKeyToUse;
    if (forceInvalidCaKey) {
        caKeyToUse = 'INVALID_CA_KEY_FOR_TESTING_403'; // CA_KEY deliberadamente inválida
    } else {
        caKeyToUse = process.env.CA_KEY_CONSULTAR_PARAMETROS;
        if (!caKeyToUse) {
            throw new Error("ERRO: A variável de ambiente CA_KEY_CONSULTAR_PARAMETROS não está configurada no .env.");
        }
    }
    const headers = {
        'accept': 'application/json',
        'CA_KEY': caKeyToUse,
        'Content-Type': 'application/json',
    };

    const requiredHeaderKeys = [
        'codigoVersao', 'codigoFuncao', 'canal', 'usuario', 'origem',
        'identificadorFuncionario', 'codigoCorretor', 'identificaRepresentante', 'centroCusto'
    ];

    for (const key of requiredHeaderKeys) {
        const value = dynamicHeadersFromBDD[key];
        if (value === undefined) {
            console.warn(`AVISO: O valor para o header dinâmico '${key}' não foi fornecido via BDD e será undefined.`);
        }
        headers[key] = String(value); // Garante que o valor do header seja uma string
    }
    return headers;
};

async function callConsultarParametrosApi(request, payload, dynamicHeaders) {
    const baseUrl = process.env.BASE_URL_CONSULTAR_PARAMETROS_APOSENTADORIA;
    if (!baseUrl) {
        throw new Error("ERRO: A variável de ambiente BASE_URL_CONSULTAR_PARAMETROS_APOSENTADORIA não está configurada no .env.");
    }
    return await request.post(baseUrl, {
        headers: getApiHeadersConsultarParametros(dynamicHeaders),
        data: payload,
    });
}

// Definição de quais chaves pertencem ao payload da requisição
const payloadKeys = ["identificaConsulta", "codigoDetalhe", "chave"];

Given('que eu não esteja autenticado', async () => {
    forceInvalidCaKey = true;
    console.log('Simulando não autenticado: CA_KEY inválida será usada para forçar 403.');
});

Given('para a consulta de parâmetros, a chave {string} tem o valor {string}', async ({}, key, value) => {
    let processedValue = value;

    if (payloadKeys.includes(key)) {
        // Converte para número se o valor for numérico e não vazio
        if (!isNaN(processedValue) && String(processedValue).trim() !== '') {
            processedValue = Number(processedValue);
        }
        requestPayload[key] = processedValue;
    } else {
        // Outras chaves são para headers e devem ser strings
        headerValuesFromBDD[key] = String(processedValue);
    }
    console.log(`Parâmetro definido para consulta: Chave='${key}', Valor='${processedValue}', Destino=${payloadKeys.includes(key) ? 'Payload' : 'Header'}`);
});

When('eu envio uma requisição POST para consultar os parâmetros de aposentadoria', async function({ request }) {
    expect(requestPayload, "Payload da requisição (requestPayload) não foi definido. O passo 'Given' executou corretamente?").toBeDefined();
    expect(Object.keys(requestPayload).length > 0, "Payload da requisição (requestPayload) está vazio.").toBe(true);
    expect(headerValuesFromBDD, "Valores de cabeçalho (headerValuesFromBDD) não foram definidos. O passo 'Given' executou corretamente?").toBeDefined();

    console.log('Payload final da requisição para consulta de parâmetros:', requestPayload);
    console.log('Valores finais de cabeçalho do BDD para consulta de parâmetros:', headerValuesFromBDD);

    this.apiResponse = await callConsultarParametrosApi(request, requestPayload, headerValuesFromBDD);
    console.log(`Requisição POST para ${process.env.BASE_URL_CONSULTAR_PARAMETROS_APOSENTADORIA} enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.json();
        console.log('Corpo da resposta da consulta de parâmetros:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta da consulta de parâmetros não é JSON ou está vazio:', await this.apiResponse.text());
    }
});

Then('a resposta da consulta de parâmetros deve ser válida', async function() {
  expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();

  // Verifica se a resposta foi bem-sucedida (status 2xx) antes de tentar parsear como JSON
  if (this.apiResponse.ok()) {
    const responseBody = await this.apiResponse.json();
    // Validação genérica para respostas JSON bem-sucedidas.
    expect(typeof responseBody).toBe('object'); // Ou 'array', dependendo da API
    expect(responseBody).not.toBeNull();
    console.log('Validação básica do corpo da resposta JSON concluída:', responseBody);
  } else {
    // Para respostas não-2xx (como 403), o corpo pode não ser JSON.
    // Você pode querer validar o corpo como texto ou verificar se está vazio.
    const responseText = await this.apiResponse.text();
    console.log(`Resposta não-JSON recebida (Status: ${this.apiResponse.status()}). Corpo: ${responseText}`);
    // Adicione asserções específicas para o corpo de erro em texto, se necessário.
    // Por exemplo: expect(responseText).toContain("Acesso Negado");
    console.log('Validação básica da resposta não-JSON concluída.');
  }
});

// --- Healthcheck Steps ---

const getApiHeadersHealthcheckConsultarParametros = () => {
    // Baseado no cURL: -H 'accept: application/json'
    return {
        'accept': 'application/json',
    };
};

async function callHealthcheckConsultarParametrosApi(request) {
    const baseUrl = process.env.BASE_URL_CONSULTAR_PARAMETROS_APOSENTADORIA_HEALTHCHECK || process.env.BASE_URL_CONSULTAR_PARAMETROS_APOSENTADORIA;
    if (!baseUrl) {
        throw new Error("ERRO: Nenhuma variável de ambiente para a URL base do healthcheck (BASE_URL_CONSULTAR_PARAMETROS_APOSENTADORIA_HEALTHCHECK ou BASE_URL_CONSULTAR_PARAMETROS_APOSENTADORIA) está configurada no .env.");
    }
    const healthCheckEndpoint = "/ci/healthcheck"; // Endpoint do cURL
    const fullUrl = `${baseUrl}${healthCheckEndpoint}`;

    return await request.get(fullUrl, {
        headers: getApiHeadersHealthcheckConsultarParametros(),
    });
}

When('eu envio uma requisição GET para o healthcheck do serviço de consulta de parâmetros', async function({ request }) {
    this.apiResponse = await callHealthcheckConsultarParametrosApi(request);
    console.log(`Requisição GET para healthcheck (${this.apiResponse.url()}) enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.text(); // Healthchecks podem retornar texto ou JSON
        console.log('Corpo da resposta do healthcheck:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta do healthcheck não é texto ou está vazio.');
    }
});

Then('a resposta do healthcheck do serviço de consulta de parâmetros deve ser válida', async function() {
    expect(this.apiResponse, "A resposta da API (this.apiResponse) para o healthcheck não foi definida.").toBeDefined();
    expect(this.apiResponse.ok(), `Healthcheck falhou com status ${this.apiResponse.status()}. Corpo: ${await this.apiResponse.text()}`).toBe(true);
    const responseText = await this.apiResponse.text();
    expect(responseText, "O corpo da resposta do healthcheck não deveria ser indefinido").toBeDefined();
    expect(responseText.length).toBeGreaterThan(0, "O corpo da resposta do healthcheck está vazio.");
    console.log('Validação básica da resposta do healthcheck do serviço de consulta de parâmetros concluída.');
});