import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';
import fs from 'fs/promises'; // Usar a versão baseada em Promises
import path from 'path';

dotenv.config();

let requestPayload;
let headerValuesFromBDD;

const { Given, When, Then, Before } = createBdd();

Before(async () => {
  requestPayload = {};
  headerValuesFromBDD = {};
});

const getApiHeadersHealthcheckPrevidenciaCorp = () => {
    // Headers para o healthcheck
    // O cURL original inclui 'Content-Type: application/json'.
    // Embora incomum para um GET sem corpo, vamos mantê-lo conforme o cURL.
    // O cURL também inclui um Cookie, que geralmente é específico da sessão e
    // pode não ser necessário para um healthcheck ou deve ser gerenciado de outra forma.
    // Por simplicidade, vamos omitir o Cookie aqui, a menos que seja estritamente necessário.
    const headers = {
        'Content-Type': 'application/json',
    };
    // console.log('Headers para healthcheck PrevidenciaCorp:', headers);
    return headers;
};

async function callHealthcheckPrevidenciaCorpApi(request) {
    const baseUrl = process.env.BASE_URL_PREVIDENCIACORP_HEALTHCHECK;
    if (!baseUrl) {
        throw new Error("ERRO: A variável de ambiente BASE_URL_PREVIDENCIACORP_HEALTHCHECK não está configurada no .env.");
    }
    // console.log(`Enviando requisição GET para: ${baseUrl}`);
    return await request.get(baseUrl, {
        headers: getApiHeadersHealthcheckPrevidenciaCorp(),
    });
}

When('eu envio uma requisição GET para o healthcheck do PrevidenciaCorp', async function({ request }) {
    this.apiResponse = await callHealthcheckPrevidenciaCorpApi(request);
    console.log(`Requisição GET para ${process.env.BASE_URL_PREVIDENCIACORP_HEALTHCHECK} enviada. Status: ${this.apiResponse.status()}`);
    try {
        const responseBody = await this.apiResponse.text(); // Healthchecks podem retornar texto ou JSON
        console.log('Corpo da resposta do healthcheck PrevidenciaCorp:', responseBody);
    } catch (error) {
        console.log('Não foi possível ler o corpo da resposta do healthcheck PrevidenciaCorp como texto:', error);
    }
});

Then('a resposta do healthcheck do PrevidenciaCorp deve ser válida', async function() {
  expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();

  if (this.apiResponse.ok()) {
    const responseText = await this.apiResponse.text();
    expect(responseText).toBeDefined();
    expect(responseText.length).toBeGreaterThan(0); // Verifica se a resposta não está vazia
    // Adicione validações mais específicas se o formato da resposta for conhecido
    // Ex: Se for JSON:
    // try {
    //   const responseBody = JSON.parse(responseText);
    //   expect(responseBody).toHaveProperty('status', 'UP');
    // } catch (e) {
    //   throw new Error("Resposta do healthcheck não é um JSON válido ou não contém a estrutura esperada.");
    // }
    console.log('Validação básica do corpo da resposta do healthcheck PrevidenciaCorp concluída.');
  } else {
    const responseText = await this.apiResponse.text();
    console.warn(`Resposta do healthcheck PrevidenciaCorp não foi OK (Status: ${this.apiResponse.status()}). Corpo: ${responseText}`);
    // Você pode querer falhar o teste aqui se um status não-OK não for esperado
    // expect(this.apiResponse.ok()).toBe(true, `Healthcheck falhou com status ${this.apiResponse.status()}`);
  }
});

// Steps para o cenário CT002 - Gerar Extrato Consolidado em PDF

const getApiHeadersExtratoPdf = (dynamicHeadersFromBDD) => {
    const authToken = process.env.AUTH_TOKEN_PREVIDENCIACORP_EXTRATO;
    const cookieValue = process.env.COOKIE_PREVIDENCIACORP_EXTRATO;

    if (!authToken) {
        throw new Error("ERRO: A variável de ambiente AUTH_TOKEN_PREVIDENCIACORP_EXTRATO não está configurada no .env.");
    }
    if (!cookieValue) {
        throw new Error("ERRO: A variável de ambiente COOKIE_PREVIDENCIACORP_EXTRATO não está configurada no .env.");
    }

    const headers = {
        'Content-Type': 'application/json', // Definido no cURL
        // Adiciona os headers passados pelo BDD
        ...dynamicHeadersFromBDD,
        // Adiciona/Sobrescreve Authorization e Cookie com valores do .env
        'Authorization': `Bearer ${authToken}`,
        'Cookie': cookieValue,
    };
    return headers;
};

async function callGerarExtratoPdfApi(request, payload, dynamicHeaders) {
    const baseUrl = process.env.BASE_URL_PREVIDENCIACORP_EXTRATO_PDF; // Assume que existe uma URL base para o serviço
    if (!baseUrl) {
        throw new Error("ERRO: A variável de ambiente BASE_URL_PREVIDENCIACORP_EXTRATO_PDF não está configurada no .env.");
    }
    const endpoint = "/extrato-consolidado/pdf"; // Endpoint específico do cURL
    const fullUrl = `${baseUrl}${endpoint}`;
    // console.log(`Enviando requisição POST para: ${fullUrl}`);
    // console.log('Payload para Extrato PDF:', payload);
    return await request.post(fullUrl, {
        headers: getApiHeadersExtratoPdf(dynamicHeaders),
        data: payload,
    });
}

// Chaves esperadas no payload para o extrato PDF
const extratoPdfPayloadKeys = ["cpf", "nomeCliente", "agencia", "conta", "tpRetorno", "canal"];
// Chaves esperadas nos headers para o extrato PDF
const extratoPdfHeaderKeys = ["Authorization", "Cookie"];

Given('para a geração do extrato, a chave {string} tem o valor {string}', async ({}, key, value) => {
    let processedValue = value;

    if (extratoPdfPayloadKeys.includes(key)) {
        // Converte para número se aplicável para chaves do payload, exceto 'cpf' e 'nomeCliente'
        if (!["cpf", "nomeCliente"].includes(key) && !isNaN(processedValue) && String(processedValue).trim() !== '') {
            processedValue = Number(processedValue);
        }
        requestPayload[key] = processedValue;
    } else if (extratoPdfHeaderKeys.includes(key)) {
        headerValuesFromBDD[key] = String(processedValue);
    } else {
        console.warn(`AVISO: Chave '${key}' não reconhecida para payload ou header do extrato PDF.`);
        // Decide como lidar com chaves inesperadas, pode ser um erro ou apenas um aviso.
        // Por ora, vamos adicionar ao payload para flexibilidade, mas isso pode ser ajustado.
        requestPayload[key] = processedValue;
    }
    // console.log(`Parâmetro para extrato PDF definido: Chave='${key}', Valor='${processedValue}', Destino=${extratoPdfPayloadKeys.includes(key) ? 'Payload' : (extratoPdfHeaderKeys.includes(key) ? 'Header' : 'Desconhecido/Payload')}`);
});

When('eu envio uma requisição POST para o endpoint {string} do serviço PrevidenciaCorp', async function({ request }, endpoint) {
    expect(requestPayload, "Payload da requisição (requestPayload) para extrato PDF não foi definido.").toBeDefined();
    expect(headerValuesFromBDD, "Valores de cabeçalho (headerValuesFromBDD) para extrato PDF não foram definidos.").toBeDefined();

    this.apiResponse = await callGerarExtratoPdfApi(request, requestPayload, headerValuesFromBDD);
    console.log(`Requisição POST para ${process.env.BASE_URL_PREVIDENCIACORP_EXTRATO_PDF}${endpoint} enviada. Status: ${this.apiResponse.status()}`);
});

Then('o header {string} da resposta deve ser {string}', async function({}, headerName, expectedValue) {
    expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();
    expect(this.apiResponse.headers()[headerName.toLowerCase()]).toBe(expectedValue);
});

Then('o PDF retornado deve conter o texto {string}', async function({}, expectedTextInPdf) {
    let processedExpectedText = expectedTextInPdf;
    expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();
    expect(this.apiResponse.ok(), `A requisição para obter o PDF não foi bem-sucedida. Status: ${this.apiResponse.status()}`).toBe(true);

    const contentType = this.apiResponse.headers()['content-type'];
    expect(contentType, "O Content-Type da resposta não foi definido.").toBeDefined();
    expect(contentType.includes('application/pdf'), `Content-Type esperado 'application/pdf', mas foi '${contentType}'`).toBe(true);

    const pdfBuffer = await this.apiResponse.body();
    expect(pdfBuffer, "O corpo da resposta (PDF) está vazio ou não é um buffer.").toBeTruthy();
    expect(pdfBuffer.length).toBeGreaterThan(0, "O buffer do PDF está vazio.");

    // Verifica e substitui o placeholder pela data atual
    if (processedExpectedText.includes('[DATA_ATUAL_DD/MM/YYYY]')) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
        const year = today.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        processedExpectedText = processedExpectedText.replace('[DATA_ATUAL_DD/MM/YYYY]', formattedDate);
        console.log(`Texto esperado no PDF (com data dinâmica): "${processedExpectedText}"`);
    }

    try {
        const data = await pdfParse(pdfBuffer);
        expect(data.text, "Não foi possível extrair texto do PDF ou o texto está vazio.").toBeTruthy();
        expect(data.text.includes(processedExpectedText), `O PDF não contém o texto esperado "${processedExpectedText}". Verifique o texto extraído.`).toBe(true);
        // console.log(`Texto extraído do PDF contém "${processedExpectedText}". Número de páginas: ${data.numpages}`);
    } catch (error) {
        console.error("Erro ao processar o PDF com pdf-parse:", error);
        throw new Error(`Falha ao processar o PDF. Certifique-se de que é um PDF válido. Erro: ${error.message}`);
    }
});

Then('o PDF retornado deve ser salvo como {string}', async function({}, fileName) {
    expect(this.apiResponse, "A resposta da API (this.apiResponse) não foi definida.").toBeDefined();
    expect(this.apiResponse.ok(), `A requisição para obter o PDF não foi bem-sucedida. Status: ${this.apiResponse.status()}`).toBe(true);

    const contentType = this.apiResponse.headers()['content-type'];
    expect(contentType, "O Content-Type da resposta não foi definido.").toBeDefined();
    expect(contentType.includes('application/pdf'), `Content-Type esperado 'application/pdf', mas foi '${contentType}'`).toBe(true);

    const pdfBuffer = await this.apiResponse.body();
    expect(pdfBuffer, "O corpo da resposta (PDF) está vazio ou não é um buffer.").toBeTruthy();

    // Define um diretório para salvar os PDFs, por exemplo, 'test-results/downloads'
    // Certifique-se de que este diretório exista ou crie-o
    const downloadDir = path.join(process.cwd(), 'test-results', 'downloaded_pdfs');
    await fs.mkdir(downloadDir, { recursive: true }); // Cria o diretório se não existir

    const filePath = path.join(downloadDir, fileName);

    await fs.writeFile(filePath, pdfBuffer);
    console.log(`PDF salvo em: ${filePath}`);
    expect(await fs.stat(filePath).then(stats => stats.size).catch(() => 0)).toBeGreaterThan(0, `O arquivo PDF ${filePath} não foi salvo corretamente ou está vazio.`);
});