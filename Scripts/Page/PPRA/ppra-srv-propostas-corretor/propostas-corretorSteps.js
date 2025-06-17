import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import dotenv from 'dotenv';

dotenv.config();

let headerValuesFromBDD;
let queryParamsFromBDD;

const { Given, When, Then, Before } = createBdd();

Before(async () => {
  headerValuesFromBDD = {};
  queryParamsFromBDD = {};
});

const getApiHeadersPropostasCorretor = (dynamicHeadersFromBDD) => {
    const caKey = process.env.CA_KEY_PROPOSTAS_CORRETOR;
    if (!caKey) {
        throw new Error("ERRO: A variável de ambiente CA_KEY_PROPOSTAS_CORRETOR não está configurada no .env.");
    }

    const headers = {
        'accept': '*/*', // Conforme cURL
        'CA_KEY': caKey,
        // Adiciona outros headers dinâmicos passados pelo BDD
        ...dynamicHeadersFromBDD,
    };
    return headers;
};

async function callConsultarPropostasApi(request, endpointPath, queryParams, dynamicHeaders) {
    const baseUrl = process.env.BASE_URL_PROPOSTAS_CORRETOR;
    if (!baseUrl) {
        throw new Error("ERRO: A variável de ambiente BASE_URL_PROPOSTAS_CORRETOR não está configurada no .env.");
    }
    const endpoint = endpointPath; // "/pendentes" ou "/em-implantacao"
    let fullUrl = `${baseUrl}${endpoint}`;

    const queryStringParams = new URLSearchParams();
    if (queryParams.cnpjCorretor) {
        queryStringParams.append('cnpjCorretor', queryParams.cnpjCorretor);
    }
    // Adicionar outros query params se necessário no futuro

    if (queryStringParams.toString()) {
        fullUrl += `?${queryStringParams.toString()}`;
    }

    return await request.get(fullUrl, {
        headers: getApiHeadersPropostasCorretor(dynamicHeaders),
    });
}

Given('para a consulta de propostas, o header {string} tem o valor {string}', async ({}, key, value) => {
    headerValuesFromBDD[key] = String(value);
    console.log(`Parâmetro de header definido para consulta de propostas: Chave='${key}', Valor='${value}'`);
});

When('eu consulto propostas pendentes para o corretor com CNPJ {string}', async function({ request }, cnpjCorretor) {
    queryParamsFromBDD.cnpjCorretor = cnpjCorretor;

    expect(headerValuesFromBDD, "Valores de cabeçalho (headerValuesFromBDD) não foram definidos. O passo 'Given' para headers executou corretamente?").toBeDefined();

    console.log('Query params finais da requisição para consulta de propostas:', queryParamsFromBDD);
    console.log('Valores finais de cabeçalho do BDD para consulta de propostas:', headerValuesFromBDD);

    this.apiResponse = await callConsultarPropostasApi(request, "/pendentes", queryParamsFromBDD, headerValuesFromBDD);
    console.log(`Requisição GET para ${this.apiResponse.url()} enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.json();
        console.log('Corpo da resposta da consulta de propostas:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta da consulta de propostas não é JSON ou está vazio:', await this.apiResponse.text());
    }
});

When('eu consulto propostas em implantação para o corretor com CNPJ {string}', async function({ request }, cnpjCorretor) {
    queryParamsFromBDD.cnpjCorretor = cnpjCorretor;

    expect(headerValuesFromBDD, "Valores de cabeçalho (headerValuesFromBDD) não foram definidos. O passo 'Given' para headers executou corretamente?").toBeDefined();

    console.log('Query params finais da requisição para consulta de propostas em implantação:', queryParamsFromBDD);
    console.log('Valores finais de cabeçalho do BDD para consulta de propostas em implantação:', headerValuesFromBDD);

    this.apiResponse = await callConsultarPropostasApi(request, "/em-implantacao", queryParamsFromBDD, headerValuesFromBDD);
    console.log(`Requisição GET para ${this.apiResponse.url()} enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.json();
        console.log('Corpo da resposta da consulta de propostas em implantação:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta da consulta de propostas em implantação não é JSON ou está vazio:', await this.apiResponse.text());
    }
});

When('eu consulto a carteira de propostas para o corretor com CNPJ {string}', async function({ request }, cnpjCorretor) {
    queryParamsFromBDD.cnpjCorretor = cnpjCorretor;

    expect(headerValuesFromBDD, "Valores de cabeçalho (headerValuesFromBDD) não foram definidos. O passo 'Given' para headers executou corretamente?").toBeDefined();

    console.log('Query params finais da requisição para consulta da carteira de propostas:', queryParamsFromBDD);
    console.log('Valores finais de cabeçalho do BDD para consulta da carteira de propostas:', headerValuesFromBDD);

    this.apiResponse = await callConsultarPropostasApi(request, "/carteira", queryParamsFromBDD, headerValuesFromBDD);
    console.log(`Requisição GET para ${this.apiResponse.url()} enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.json();
        console.log('Corpo da resposta da consulta da carteira de propostas:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta da consulta da carteira de propostas não é JSON ou está vazio:', await this.apiResponse.text());
    }
});

When('eu consulto os cards de propostas para o corretor com CNPJ {string}', async function({ request }, cnpjCorretor) {
    queryParamsFromBDD.cnpjCorretor = cnpjCorretor;

    expect(headerValuesFromBDD, "Valores de cabeçalho (headerValuesFromBDD) não foram definidos. O passo 'Given' para headers executou corretamente?").toBeDefined();

    console.log('Query params finais da requisição para consulta dos cards de propostas:', queryParamsFromBDD);
    console.log('Valores finais de cabeçalho do BDD para consulta dos cards de propostas:', headerValuesFromBDD);

    this.apiResponse = await callConsultarPropostasApi(request, "/cards", queryParamsFromBDD, headerValuesFromBDD);
    console.log(`Requisição GET para ${this.apiResponse.url()} enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.json();
        console.log('Corpo da resposta da consulta dos cards de propostas:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta da consulta dos cards de propostas não é JSON ou está vazio:', await this.apiResponse.text());
    }
});

Then('o sistema deve retornar o código de status {int}', async function({}, expectedStatus) {
    expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();
    expect(this.apiResponse.status(), `Esperado status ${expectedStatus}, mas foi ${this.apiResponse.status()}`).toBe(expectedStatus);
});

Then('a resposta da consulta de propostas pendentes deve ser válida', async function() {
  expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();

  if (this.apiResponse.ok()) {
    const responseBody = await this.apiResponse.json();
    expect(typeof responseBody).toBe('object'); // Geralmente é um array de propostas ou um objeto
    expect(responseBody).not.toBeNull();
    // Adicione validações mais específicas aqui, por exemplo:
    // if (Array.isArray(responseBody)) {
    //   console.log(`Consulta retornou ${responseBody.length} propostas.`);
    // }
    console.log('Validação básica do corpo da resposta JSON da consulta de propostas pendentes concluída.');
  } else {
    const responseText = await this.apiResponse.text();
    console.warn(`Resposta da consulta de propostas pendentes não foi OK (Status: ${this.apiResponse.status()}). Corpo: ${responseText}`);
    // Você pode querer falhar o teste aqui se um status não-OK não for esperado
  }
});

Then('a resposta da consulta de propostas em implantação deve ser válida', async function() {
    expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();

    if (this.apiResponse.ok()) {
      const responseBody = await this.apiResponse.json();
      expect(typeof responseBody).toBe('object'); // Geralmente é um array de propostas ou um objeto
      expect(responseBody).not.toBeNull();
      // Adicione validações mais específicas aqui
      console.log('Validação básica do corpo da resposta JSON da consulta de propostas em implantação concluída.');
    } else {
      const responseText = await this.apiResponse.text();
      console.warn(`Resposta da consulta de propostas em implantação não foi OK (Status: ${this.apiResponse.status()}). Corpo: ${responseText}`);
    }
  });

Then('a resposta da consulta da carteira de propostas deve ser válida', async function() {
    expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();

    if (this.apiResponse.ok()) {
      const responseBody = await this.apiResponse.json();
      expect(typeof responseBody).toBe('object'); // Geralmente é um array de propostas ou um objeto
      expect(responseBody).not.toBeNull();
      // Adicione validações mais específicas aqui
      console.log('Validação básica do corpo da resposta JSON da consulta da carteira de propostas concluída.');
    } else {
      const responseText = await this.apiResponse.text();
      console.warn(`Resposta da consulta da carteira de propostas não foi OK (Status: ${this.apiResponse.status()}). Corpo: ${responseText}`);
    }
});

Then('a resposta da consulta dos cards de propostas deve ser válida', async function() {
    expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();

    if (this.apiResponse.ok()) {
      const responseBody = await this.apiResponse.json();
      expect(typeof responseBody).toBe('object'); // Geralmente é um array de propostas ou um objeto
      expect(responseBody).not.toBeNull();
      // Adicione validações mais específicas aqui, por exemplo, verificar a estrutura dos cards
      console.log('Validação básica do corpo da resposta JSON da consulta dos cards de propostas concluída.');
    } else {
      const responseText = await this.apiResponse.text();
      console.warn(`Resposta da consulta dos cards de propostas não foi OK (Status: ${this.apiResponse.status()}). Corpo: ${responseText}`);
    }
});

// --- Healthcheck Steps ---

const getApiHeadersHealthcheckPropostasCorretor = () => {
    // Baseado no cURL: -H 'accept: */*'
    // O cURL não especifica CA_KEY para este healthcheck. Se a API exigir, precisará ser adicionado.
    return {
        'accept': '*/*',
    };
};

async function callHealthcheckPropostasCorretorApi(request) {
    const baseUrl = process.env.BASE_URL_PROPOSTAS_CORRETOR_HEALTHCHECK || process.env.BASE_URL_PROPOSTAS_CORRETOR;
    if (!baseUrl) {
        throw new Error("ERRO: Nenhuma variável de ambiente para a URL base do healthcheck (BASE_URL_PROPOSTAS_CORRETOR_HEALTHCHECK ou BASE_URL_PROPOSTAS_CORRETOR) está configurada no .env.");
    }
    const healthCheckEndpoint = "/ci/healthcheck"; // Endpoint do cURL
    const fullUrl = `${baseUrl}${healthCheckEndpoint}`;

    return await request.get(fullUrl, {
        headers: getApiHeadersHealthcheckPropostasCorretor(),
    });
}

When('eu envio uma requisição GET para o healthcheck do serviço de propostas do corretor', async function({ request }) {
    this.apiResponse = await callHealthcheckPropostasCorretorApi(request);
    console.log(`Requisição GET para healthcheck (${this.apiResponse.url()}) enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.text();
        console.log('Corpo da resposta do healthcheck de propostas do corretor:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta do healthcheck de propostas do corretor não é texto ou está vazio.');
    }
});

Then('a resposta do healthcheck do serviço de propostas do corretor deve ser válida', async function() {
    expect(this.apiResponse, "A resposta da API (this.apiResponse) para o healthcheck não foi definida.").toBeDefined();
    expect(this.apiResponse.ok(), `Healthcheck de propostas do corretor falhou com status ${this.apiResponse.status()}. Corpo: ${await this.apiResponse.text()}`).toBe(true);
    const responseText = await this.apiResponse.text();
    expect(responseText, "O corpo da resposta do healthcheck de propostas do corretor não deveria ser indefinido").toBeDefined();
    expect(responseText.length).toBeGreaterThan(0, "O corpo da resposta do healthcheck de propostas do corretor está vazio.");
    console.log('Validação básica da resposta do healthcheck do serviço de propostas do corretor concluída.');
});