import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

let requestPayload;
let isAuthenticated = false;

const { Given, When, Then, Before } = createBdd();

Before(async () => {
  requestPayload = null;
  isAuthenticated = false;
});

const getApiHeadersForListarSolicitacaoAposentadoria = () => {
    if (!isAuthenticated) {
        throw new Error("ERRO: O cenário não foi autenticado. Use o passo 'Dado que eu esteja autenticado'.");
    }

    const caKey = process.env.CA_KEY_LISTAR_SOLICITACAO_APOSENTADORIA;
    if (!caKey) {
        throw new Error("ERRO: A variável de ambiente CA_KEY_LISTAR_SOLICITACAO_APOSENTADORIA não está configurada no .env.");
    }

    return {
        'accept': 'application/json',
        'CA_KEY': caKey,
        'codigoVersao': '1',
        'codigoFuncao': '1',
        'canal': '11',
        'usuario': '1',
        'origem': '1',
        'identificadorFuncionario': 'N',
        'codigoCorretor': '9011900',
        'identificaRepresentante': 'N',
        'centroCusto': 'FGBI',
        'Content-Type': 'application/json',
    };
};

async function callListarSolicitacaoAposentadoriaApi(request, payload) {
    const baseUrl = process.env.BASE_URL_LISTAR_SOLICITACAO_APOSENTADORIA;
    if (!baseUrl) {
        throw new Error("ERRO: A variável de ambiente BASE_URL_LISTAR_SOLICITACAO_APOSENTADORIA não está configurada no .env.");
    }

    const endpoint = "/listar/solicitacao";
    const fullUrl = `${baseUrl}${endpoint}`;
    
    // Lê o timeout do .env ou usa 180 segundos (3 minutos) como padrão.
    const requestTimeout = parseInt(process.env.API_REQUEST_TIMEOUT, 10) || 180000;

    return await request.post(fullUrl, {
        headers: getApiHeadersForListarSolicitacaoAposentadoria(),
        data: payload,
        timeout: requestTimeout,
    });
}

async function callGetApi(request, endpoint) {
    const baseUrl = process.env.BASE_URL_LISTAR_SOLICITACAO_APOSENTADORIA;
    if (!baseUrl) {
        throw new Error("ERRO: A variável de ambiente BASE_URL_LISTAR_SOLICITACAO_APOSENTADORIA não está configurada no .env.");
    }
    const fullUrl = `${baseUrl}${endpoint}`;

    return await request.get(fullUrl, {
        headers: {
            'accept': 'application/json', // Conforme o cURL do healthcheck
        },
    });
}

Given('que eu esteja autenticado em listar a solicitação de aposentadoria', async () => {
    isAuthenticated = true;
    console.log('Autenticação para o cenário ativada. A CA_KEY do .env será utilizada.');
});

Given('que eu utilize o payload do arquivo em listar a solicitação de aposentadoria {string}', async ({}, filePath) => {
    const fullPath = path.resolve(process.cwd(), 'Data', filePath);
    try {
        const fileContent = await fs.readFile(fullPath, 'utf-8');
        requestPayload = JSON.parse(fileContent);
        console.log(`Payload carregado com sucesso do arquivo: ${fullPath}`);
    } catch (error) {
        throw new Error(`ERRO: Não foi possível ler ou parsear o arquivo de payload em ${fullPath}. Detalhes: ${error.message}`);
    }
});

When('eu envio uma requisição POST para listar a solicitação de aposentadoria', async function({ request }) {
    expect(requestPayload, "Payload da requisição (requestPayload) não foi definido. O passo 'Given' para carregar o arquivo JSON executou corretamente?").toBeDefined();

    console.log('Payload final da requisição:', JSON.stringify(requestPayload, null, 2));

    this.apiResponse = await callListarSolicitacaoAposentadoriaApi(request, requestPayload);
    console.log(`Requisição POST para ${this.apiResponse.url()} enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.json();
        console.log('Corpo da resposta:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta não é JSON ou está vazio:', await this.apiResponse.text());
    }
});

/**
 * Passo genérico e adaptável para requisições GET.
 * Ele captura o endpoint do arquivo .feature e o utiliza para montar a URL completa da requisição.
 */
When('eu envio uma requisição GET para o endpoint Listar solicitacao Aposentadoria {string}', async function({ request }, endpoint) {
    this.apiResponse = await callGetApi(request, endpoint);
    console.log(`Requisição GET para ${this.apiResponse.url()} enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.text();
        console.log('Corpo da resposta:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta não é texto ou está vazio.');
    }
});

Then('a resposta da listagem de solicitação de aposentadoria deve ser válida', async function() {
  expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();
  expect(this.apiResponse.ok(), `A listagem de solicitação de aposentadoria falhou com status ${this.apiResponse.status()}. Corpo: ${await this.apiResponse.text()}`).toBe(true);

  const responseBody = await this.apiResponse.json();
  expect(responseBody, "O corpo da resposta não pode ser nulo.").not.toBeNull();
  expect(typeof responseBody).toBe('object');
  // Adicione aqui validações mais específicas da resposta, se necessário.
  console.log('Validação básica da resposta da listagem de solicitação de aposentadoria concluída.');
});