##### Autor : Orivan Lemes dos Santos Junior

# Testes E2E com Playwright e BDD

Este projeto demonstra a implementação de testes end-to-end (E2E) utilizando `@playwright/test` em conjunto com `playwright-bdd` para a escrita de cenários no formato Behavior-Driven Development (BDD). A arquitetura adota o padrão **Page Object Model (POM)** para uma melhor organização e manutenibilidade do código de teste.

## Sumário

- Arquitetura do Projeto
- Pré-requisitos
- Instalação e Configuração
- Executando os Testes
- Visualizando Relatórios

## Arquitetura do Projeto

1. **Diretório de Features**:
   - Contém arquivos `.feature` escritos em sintaxe Gherkin.
   - Contém as definições de passos (step definitions) para os cenários Gherkin.
   - Localizado em `{Scripts,Support}/**/**/*.js`.

3. **Modelo Page Object (POM)**:
   - Cada página da aplicação é representada por uma classe JavaScript.
   - As classes encapsulam os seletores dos elementos da página e os métodos para interagir com eles.
   - Localizado no diretório `Page/**/**/*.js`.

4. **Configuração do Playwright**:
   - O arquivo `playwright.config.js` é o coração da configuração do Playwright.
   - Integra `playwright-bdd` para o mapeamento entre arquivos `.feature` e os arquivos de steps.
   - Pode incluir configurações globais como `baseURL`, `ignoreHTTPSErrors`, timeouts, e a configuração de reporters (ex: `html`, `allure-playwright`).

## Pré-requisitos

Antes de começar, certifique-se de ter o Node.js (que inclui o npm) instalado em sua máquina.

## Instalação e Configuração

Siga os passos abaixo para configurar o ambiente de teste:

1.  **Clone o Repositório**:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd <NOME_DO_DIRETORIO_DO_PROJETO>
    ```

2.  **Instale as Dependências**:
    ```bash
    npm install
    ```
    Isso instalará o Playwright, `playwright-bdd`, e outras dependências listadas no `package.json`.

3.  **Instale os Navegadores do Playwright**:
    Durante a primeira instalação do `@playwright/test` (ou executando `npm install`), os navegadores podem ser baixados automaticamente. Caso contrário, ou para garantir, execute:
    ```bash
    npx playwright install
    ```

4.  **Configuração de Variáveis de Ambiente (Opcional)**:
    Se o projeto utilizar variáveis de ambiente (ex: para URLs, credenciais de teste), é uma boa prática usar um arquivo `.env`.
    - Instale o `dotenv`:
      ```bash
      npm install dotenv
      ```
    - Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias:
      ```
      # .env
      BASE_URL=http://localhost:3000
      TEST_USER_USERNAME=seu_usuario
      TEST_USER_PASSWORD=sua_senha
      ID_TOKEN=seu_token_de_autenticacao
      BASE_API_URL=sua_url_base_da_api
      ```
    - Adicione `.env` ao seu arquivo `.gitignore` para evitar que informações sensíveis sejam versionadas:
      ```gitignore
      # .gitignore
      .env
      node_modules/
      test-results/
      playwright-report/
      allure-results/
      allure-report/
      ```

5.  **Configuração do VS Code para BDD (Opcional)**:
    Para melhor integração com arquivos `.feature` no VS Code, instale a extensão "Cucumber (Gherkin) Full Support" e adicione as seguintes configurações ao seu `settings.json` do VS Code (`Ctrl+Shift+P` > "Preferences: Open User Settings (JSON)"):
    ```json
    "cucumber.features": [
        "playwright/e2e/Scenarios/**/*.feature",
        // ou o caminho correto para suas features, ex: "e2e/Scenarios/**/*.feature"
        // ou "Scenarios/**/*.feature" se estiver na raiz do e2e
    ],
    "cucumber.glue": [
        "playwright/e2e/**/*.js",
        // ou o caminho correto para seus steps, ex: "e2e/{Scripts,Support}/**/*.js"
        // ou "{Scripts,Support}/**/*.js" se estiver na raiz do e2e
    ]
    ```
    *Nota: Ajuste os caminhos acima conforme a estrutura exata do seu projeto em relação à raiz do workspace do VS Code.*

## Executando os Testes

Os seguintes comandos podem ser utilizados para executar os testes Playwright:

*   **Executar todos os testes**:
    ```bash
    npx playwright test
    ```

*   **Executar um arquivo de teste específico**:
    ```bash
    npx playwright test <caminho/para/o/arquivo.spec.js>
    npx playwright test <caminho/para/a/feature.feature>
    ```

*   **Executar testes em um projeto específico (definido em `playwright.config.js`)**:
    ```bash
    npx playwright test --project=<nome-do-projeto>
    ```
    Exemplo: `npx playwright test --project=chromium`

*   **Executar testes com a UI do Playwright (Modo Interativo)**:
    ```bash
    npx playwright test --ui
    ```

*   **Executar testes e gerar traces**:
    Os traces são úteis para debugar falhas. A configuração de trace pode estar no `playwright.config.js` (ex: `trace: 'on-first-retry'`). Para forçar a gravação:
    ```bash
    npx playwright test --trace on
    ```
    Para visualizar um trace específico:
    ```bash
    npx playwright show-trace path/to/your/trace.zip
    # Exemplo: npx playwright show-trace test-results/Scenarios-Login-login.feat-some-hash-Chromium/trace.zip
    ```

*   **Filtrar testes por tag (Gherkin/BDD)**:
    Primeiro, gere os arquivos de teste a partir das features (se ainda não estiver configurado para fazer isso automaticamente ou se houver novas features/tags):
    ```bash
    npx bddgen
    ```
    Depois, execute os testes filtrando pela tag:
    ```bash
    npx playwright test --grep @suaTag
    ```
    Exemplo com a tag `@citrix`:
    ```bash
    npx bddgen && npx playwright test --grep @citrix
    ```

*   **Executar testes em paralelo (workers)**:
    Playwright executa testes em paralelo por padrão. Você pode controlar o número de workers:
    ```bash
    npx playwright test --workers=<numero-de-workers>
    ```
    Exemplo: `npx playwright test --workers=4`

*   **Gerar código com o Playwright Codegen**:
    Ferramenta para gravar interações do usuário e gerar código de teste.
    ```bash
    npx playwright codegen
    ```
    Ou para uma URL específica:
    ```bash
    npx playwright codegen <URL_DO_SITE>
    ```

*   **Executar testes com `bddgen` e UI Mode**:
    ```bash
    npx bddgen && npx playwright test --ui
    ```

## Visualizando Relatórios

### Relatório HTML do Playwright

Por padrão, o Playwright gera um relatório HTML. Após a execução dos testes, você pode abri-lo com:
```bash
npx playwright show-report
```
O relatório geralmente é salvo em `playwright-report/index.html`.

### Relatórios com Allure

Se o Allure estiver configurado como reporter (`reporter: [['allure-playwright']]` no `playwright.config.js`):

1.  **Execute os testes para gerar os resultados do Allure**:
    (O reporter já deve estar configurado para gerar os arquivos em `allure-results`)
    ```bash
    npx playwright test
    ```
    Ou, se precisar especificar o reporter na linha de comando (menos comum se já estiver no config):
    ```bash
    npx playwright test --reporter=allure-playwright
    ```

2.  **Gere o relatório Allure**:
    Limpa resultados anteriores e gera um novo relatório.
    ```bash
    npx allure generate allure-results --clean -o allure-report
    ```

3.  **Abra o relatório Allure no navegador**:
    ```bash
    npx allure open allure-report
    ```

4.  **Servir o relatório Allure (alternativa ao `open`)**:
    Inicia um servidor local para visualizar o relatório.
    ```bash
    npx allure serve allure-results
    ```

5.  **Verificar a versão do Allure (se instalado globalmente ou via npx)**:
    ```bash
    npx allure --version
    ```

---
*Este README foi aprimorado para fornecer uma visão mais clara e organizada do projeto de testes E2E.*