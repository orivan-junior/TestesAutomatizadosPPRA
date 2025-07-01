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

const getApiHeadersSimularSinistro = () => {
    if (!isAuthenticated) {
        throw new Error("ERRO: O cenário não foi autenticado. Use o passo 'Dado que eu esteja autenticado'.");
    }

    const caKey = process.env.CA_KEY_SIMULAR_Sinistro;
    if (!caKey) {
        throw new Error("ERRO: A variável de ambiente CA_KEY_SIMULAR_Sinsitro não está configurada no .env.");
    }

    return {
        'accept': 'application/json',
        'CA_KEY': String(caKey),
        'Content-Type': 'application/json',
        'codigoVersao': String(1),
        'codigoFuncao': String(1),
        'canal': String(3),
        'origem': String(5310),
        'usuario': String(0),
        'esFuncionario': "N",
        'codCorretor': String(0),
        'esRepresentante': "N",
        'centroCusto': "FGBI",
        'cpf': String(0),
        'serie': "055",
        'proposta': String(2168645),
        'matricula': String(0),
        'empresa': String(0),
        'beneficioComercial': '',
        'codigoFundo': String(0),
        'tipoResgate': String(1),
        'origemResgate': "P",
        'valorResgate': String(1),
        'percentualResgateParticipante': String(100),
        'percentualResgateEmpresa': String(100),
        'tipoSinistro': String(3),
        'origemSinistro': String(1),
        'valorSinistro': String(1),
        'percentualSinistroParticipante': String(1),
        'percentualSinistroEmpresa': String(1)
    };
};

async function callSimularSinistroApi(request, payload) {
    const baseUrl = process.env.BASE_URL_SIMULAR_Sinistro;
    if (!baseUrl) {
        throw new Error("ERRO: A variável de ambiente BASE_URL_SIMULAR_Sinsitro não está configurada no .env.");
    }
    const endpoint = "/simulador/sinistro";
    const fullUrl = `${baseUrl}${endpoint}`;
    
    // Lê o timeout do .env ou usa 180 segundos (3 minutos) como padr��o.
    // Isso ajuda a evitar erros de timeout do CLIENTE (Playwright), mas não resolve erros 504 do SERVIDOR.
    const requestTimeout = parseInt(process.env.API_REQUEST_TIMEOUT, 10) || 180000;

    return await request.get(fullUrl, {
        headers: getApiHeadersSimularSinistro(),
        data: payload,
        timeout: requestTimeout,
    });
}

async function callGetApi(request, endpoint) {
    const baseUrl = process.env.BASE_URL_SIMULAR_Sinistro;
    if (!baseUrl) {
        throw new Error("ERRO: A variável de ambiente BASE_URL_SIMULAR_Sinsitro não está configurada no .env.");
    }
    const fullUrl = `${baseUrl}${endpoint}`;

    return await request.get(fullUrl, {
        headers: {
            'accept': 'application/json', // Conforme o cURL do healthcheck
        },
    });
}


Given('que eu esteja autenticado para simular o Sinistro', async () => {
    isAuthenticated = true;
    console.log('Autenticação para o cenário ativada. A CA_KEY do .env será utilizada.');
});

/**
 * Passo genérico e adaptável para requisições GET.
 * Ele captura o endpoint do arquivo .feature e o utiliza para montar a URL completa da requisição.
 */
When('eu envio uma requisição GET para o endpoint para simular o cálculo ir {string}', async function({ request }, endpoint) {

    if(endpoint == "/ci/healthcheck"){
        this.apiResponse = await callGetApi(request, endpoint);
    } else {
        this.apiResponse = await callSimularSinistroApi(request, endpoint);
    }

    console.log(`Requisição GET para ${this.apiResponse.url()} enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.text();
        console.log('Corpo da resposta:', responseBody);
    } catch (error) {
        console.log('Corpo da resposta não é texto ou está vazio.');
    }
});

Then('a resposta da simulação de Sinistro deve ser válida', async function() {
  expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();
  expect(this.apiResponse.ok(), `A simulação falhou com status ${this.apiResponse.status()}. Corpo: ${await this.apiResponse.text()}`).toBe(true);

  const responseBody = await this.apiResponse.json();
  expect(responseBody, "O corpo da resposta não pode ser nulo.").not.toBeNull();
  expect(typeof responseBody).toBe('object');
  // Adicione aqui validações mais específicas da resposta, se necessário.
  // Ex: expect(responseBody).toHaveProperty('dadosRetorno');
  console.log('Validação básica da resposta da simulação de benefício concluída.');
});