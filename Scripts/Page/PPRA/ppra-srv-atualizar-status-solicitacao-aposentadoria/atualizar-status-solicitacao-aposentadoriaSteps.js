import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import dotenv from 'dotenv';

dotenv.config();

let requestPayload;
let headerValuesFromBDD;

const { Given, When, Then, Before } = createBdd();

Before(async () => {
  requestPayload = {};
  headerValuesFromBDD = {};
});

const getApiHeadersAtualizarStatus = (dynamicHeadersFromBDD) => {
    const caKey = process.env.CA_KEY_ATUALIZAR_STATUS; // Use uma variável de ambiente específica ou a genérica
    if (!caKey) {
        throw new Error("ERRO: CA_KEY_ATUALIZAR_STATUS (ou CA_KEY correspondente) não está configurado no .env.");
    }

    const headers = {
        'accept': 'application/json',
        'CA_KEY': caKey,
        'Content-Type': 'application/json',
    };

    const requiredHeaderKeys = [
        'codigoVersao', 'codigoFuncao', 'canal', 'usuario', 'origem',
        'identificadorFuncionario', 'codigoCorretor', 'identificaRepresentante', 'centroCusto'
    ];

    for (const key of requiredHeaderKeys) {
        const value = dynamicHeadersFromBDD[key];
        if (value === undefined) {
            // Considerar lançar um erro se um header obrigatório não for fornecido
            console.warn(`AVISO: O valor para o header dinâmico '${key}' não foi fornecido via BDD e será undefined.`);
        }
        // Mantém o comportamento original de converter undefined para a string "undefined"
        headers[key] = String(value);
    }
    return headers;
};

async function callAtualizarStatusApi(request, payload, dynamicHeaders) {
    if (!process.env.BASE_URL_SOLICITA_APOSENTADORIA) {
        throw new Error("ERRO: A variável de ambiente BASE_URL_SOLICITA_APOSENTADORIA não está configurada no .env.");
    }
    return await request.post(process.env.BASE_URL_SOLICITA_APOSENTADORIA, {
        headers: getApiHeadersAtualizarStatus(dynamicHeaders),
        data: payload,
    });
}

// Definição de quais chaves pertencem ao payload da requisição
const payloadKeys = ["codigoSolicitacao", "codigoSituacao", "codigoMotivo", "observacao"];

Given('para a atualização, a chave {string} tem o valor {string}', async ({},key, value) => {
    let processedValue = value;

    if (payloadKeys.includes(key)) {
        // Converte para número se aplicável para chaves do payload, exceto 'observacao'
        if (key !== 'observacao' && !isNaN(processedValue) && String(processedValue).trim() !== '') {
            processedValue = Number(processedValue);
        }
        requestPayload[key] = processedValue;
    } else {
        // Outras chaves são para headers e devem ser strings
        headerValuesFromBDD[key] = String(processedValue);
    }
    console.log(`Parâmetro definido: Chave='${key}', Valor='${processedValue}', Destino=${payloadKeys.includes(key) ? 'Payload' : 'Header'}`);
});

When('eu envio uma requisição POST para atualizar o status da solicitação de aposentadoria', async function({ request }) {
    expect(requestPayload, "Payload da requisição (requestPayload) não foi definido. O passo 'Given' executou corretamente?").toBeDefined();
    expect(Object.keys(requestPayload).length > 0, "Payload da requisição (requestPayload) está vazio.").toBe(true);
    expect(headerValuesFromBDD, "Valores de cabeçalho (headerValuesFromBDD) não foram definidos. O passo 'Given' executou corretamente?").toBeDefined();

    console.log('Payload final da requisição:', requestPayload);
    console.log('Valores finais de cabeçalho do BDD:', headerValuesFromBDD);

    this.apiResponse = await callAtualizarStatusApi(request, requestPayload, headerValuesFromBDD);
    console.log(`Requisição POST para ${process.env.BASE_URL_SOLICITA_APOSENTADORIA} enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.json();
        console.log('Corpo da resposta:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta não é JSON ou está vazio:', await this.apiResponse.text());
    }
});

// A definição deste step foi movida para propostas-corretorSteps.js para ser global
// Then('o sistema deve retornar o código de status {int}', async ({}, expectedStatus) => {
//     expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();
//     expect(this.apiResponse.status(), `Esperado status ${expectedStatus}, mas foi ${this.apiResponse.status()}`).toBe(expectedStatus);
// });

// --- Healthcheck Steps ---

const getApiHeadersHealthcheckAtualizarStatus = () => {
    const caKey = process.env.CA_KEY_ATUALIZAR_STATUS; // Reutiliza a variável de ambiente do serviço principal
    if (!caKey) {
        throw new Error("ERRO: A variável de ambiente CA_KEY_ATUALIZAR_STATUS não está configurada no .env e é necessária para o healthcheck.");
    }
    // Baseado no cURL: -H 'accept: */*'
    return {
        'accept': '*/*',
        'CA_KEY': caKey,
    };
};

async function callHealthcheckAtualizarStatusApi(request) {
    // Assume-se que o healthcheck está no mesmo host/base path do serviço principal,
    // ou que BASE_URL_SOLICITA_APOSENTADORIA_HEALTHCHECK está definida para o endpoint completo do healthcheck sem /ci/healthcheck
    const baseUrl = process.env.BASE_URL_SOLICITA_APOSENTADORIA_HEALTHCHECK || process.env.BASE_URL_SOLICITA_APOSENTADORIA;
    if (!baseUrl) {
        throw new Error("ERRO: Nenhuma variável de ambiente para a URL base do healthcheck (BASE_URL_SOLICITA_APOSENTADORIA_HEALTHCHECK ou BASE_URL_SOLICITA_APOSENTADORIA) está configurada no .env.");
    }
    const healthCheckEndpoint = "/ci/healthcheck"; // Endpoint do cURL
    const fullUrl = `${baseUrl}${healthCheckEndpoint}`;

    return await request.get(fullUrl, {
        headers: getApiHeadersHealthcheckAtualizarStatus(),
    });
}

When('eu envio uma requisição GET para o healthcheck do serviço de atualização de status', async function({ request }) {
    this.apiResponse = await callHealthcheckAtualizarStatusApi(request);
    console.log(`Requisição GET para healthcheck (${this.apiResponse.url()}) enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.text();
        console.log('Corpo da resposta do healthcheck:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta do healthcheck não é texto ou está vazio.');
    }
});

Then('a resposta do healthcheck do serviço de atualização de status deve ser válida', async function() {
    expect(this.apiResponse, "A resposta da API (this.apiResponse) para o healthcheck não foi definida.").toBeDefined();
    expect(this.apiResponse.ok(), `Healthcheck falhou com status ${this.apiResponse.status()}. Corpo: ${await this.apiResponse.text()}`).toBe(true);

    const responseText = await this.apiResponse.text();
    expect(responseText, "O corpo da resposta do healthcheck não deveria ser indefinido").toBeDefined();
    // Adicione aqui verificações mais específicas do conteúdo da resposta do healthcheck, se necessário.
    // Por exemplo, se espera um JSON com {"status": "UP"} ou um texto específico.
    // Por enquanto, apenas verificamos que não está vazio.
    expect(responseText.length).toBeGreaterThan(0, "O corpo da resposta do healthcheck está vazio.");
    console.log('Validação básica da resposta do healthcheck do serviço de atualização de status concluída.');
});