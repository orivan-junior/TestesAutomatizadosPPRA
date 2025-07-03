# language: pt
Funcionalidade: SISTRAN » Projeto - PPRA-SRV-LISTAR-SOLICITACAO-APOSENTADORIA

  @@ppra @teste
  Cenário: CT01 - Listar solicitação de aposentadoria com sucesso
    Dado que eu esteja autenticado em listar a solicitação de aposentadoria
    E que eu utilize o payload do arquivo em listar a solicitação de aposentadoria "PPRA/ppra-srv-listar-solicitacao-aposentadoria/ct01_listar_solicitacao_sucesso.json"
    Quando eu envio uma requisição POST para listar a solicitação de aposentadoria
    Então o sistema deve retornar o código de status 200
    E a resposta da listagem de solicitação de aposentadoria deve ser válida

  @ppra @teste
  Cenário: CT002 -  Verifica o estado de saude da aplicação
    Quando eu envio uma requisição GET para o endpoint Listar solicitacao Aposentadoria "/ci/healthcheck"
    Então o sistema deve retornar o código de status 200
