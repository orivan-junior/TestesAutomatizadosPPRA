# language: pt
Funcionalidade: SISTRAN » Projeto - ppra-srv-salvar-solicitacao-aposentadoria

  @ppra @teste2
  Cenário: CT001 - Endpoint [api-contrller] - salva/solicitacao-aposentadoria
    Dado que eu esteja autenticado para Salvar solicitacao Aposentadoria
    E que eu utilize o payload do arquivo Salvar solicitacao Aposentadoria "PPRA/ppra-srv-salvar-solicitacao-aposentadoria/ct01_salvar-solicitacao-aposentadoria.json"
    Quando eu envio uma requisição POST para Salvar solicitacao Aposentadoria
    Então o sistema deve retornar o código de status 200
    E a resposta para Salvar solicitacao Aposentadoria deve ser válida

  @ppra @teste2
  Cenário: CT002 -  Verifica o estado de saude da aplicação
    Quando eu envio uma requisição GET para o endpoint Salvar solicitacao Aposentadoria "/ci/healthcheck"
    Então o sistema deve retornar o código de status 200