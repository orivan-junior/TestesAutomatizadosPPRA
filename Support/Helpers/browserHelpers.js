const path = require('path');
const { chromium } = require('@playwright/test');

/**
 * Destaca um elemento na página adicionando uma borda chamativa ao redor dele.
 * Aceita tanto um seletor (string) quanto um Locator do Playwright.
 * @param {Page} page - A instância da página do Playwright.
 * @param {string|Locator} target - O seletor do elemento ou um Locator Playwright.
 * @param {boolean} [focus=true] - Se deve dar foco ao elemento.
 */
export async function highlightElement(page, target, focus = true) {
  let elementHandle;

  if (typeof target === 'string') {
    // Se for string, usa o seletor CSS
    elementHandle = await page.$(target);
  } else if (typeof target === 'object' && typeof target.elementHandle === 'function') {
    // Se for Locator, pega o ElementHandle
    elementHandle = await target.elementHandle();
  } else {
    throw new Error('Parâmetro inválido para highlightElement');
  }

  if (!elementHandle) {
    console.warn('Elemento não encontrado para highlight');
    return;
  }

  // Adiciona a animação de piscar ao documento (só precisa adicionar uma vez por página)
  await page.addStyleTag({
    content: `
      @keyframes highlight-blink {
        0% { border-color: yellow; box-shadow: 0 0 15px 5px yellow; }
        50% { border-color: orange; box-shadow: 0 0 20px 10px orange; }
        100% { border-color: yellow; box-shadow: 0 0 15px 5px yellow; }
      }
    `,
  });

  // Destaca o elemento
  await elementHandle.evaluate((el) => {
    el.style.border = '6px solid yellow';
    el.style.boxShadow = '0 0 15px 5px yellow';
    el.style.transition = 'all 0.3s ease-in-out';
    el.style.animation = 'highlight-blink 1s forwards'; // Muda para 'forwards' para manter o estilo final
  });

  console.log('Elemento destacado');

  // Foca no elemento se o parâmetro focus for verdadeiro
  if (focus) {
    await elementHandle.evaluate((el) => el.focus());
    console.log('Elemento focado');
  }

  // Aguarda a animação terminar (1 segundo) e depois remove o destaque
  await page.waitForTimeout(200);

  // Remove o destaque
  await elementHandle.evaluate((el) => {
    el.style.border = ''; // Remove a borda
    el.style.boxShadow = ''; // Remove a sombra
    el.style.animation = ''; // Remove a animação
  });

  // Desfoca o elemento
  await elementHandle.evaluate((el) => el.blur());
  console.log('Elemento desfocado');
}

