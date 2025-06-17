import * as allure from 'allure-js-commons';
import { ContentType } from 'allure-js-commons';

/**
 * Anexa um texto ao relatório Allure.
 * @param {string} nome - Nome do anexo.
 * @param {string} conteudo - Conteúdo do texto a ser anexado.
 */
export function anexarTexto(nome, conteudo) {
  allure.attachment(nome, conteudo, ContentType.TEXT);
}

/**
 * Anexa uma imagem (screenshot) ao relatório Allure.
 * @param {string} nome - Nome do anexo.
 * @param {object} page - Instância da página do Playwright.
 */
export async function anexarImagem(nome, page) {
  const screenshot = await page.screenshot();
  allure.attachment(nome, screenshot, ContentType.PNG);
}