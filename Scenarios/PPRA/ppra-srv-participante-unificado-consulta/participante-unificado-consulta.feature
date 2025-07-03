# language: pt
Funcionalidade: SISTRAN » Projeto - ppra-srv-participante-unificado-consulta

  @ppra @teste2
  Cenário: CT001 - Consultar participante unificado com Sucesso
    Dado que eu esteja autenticado para Consultar participante unificado com Sucesso
    E que eu utilize o payload do arquivo Consultar participante unificado "PPRA/ppra-srv-participante-unificado-consulta/ct01_participante-unificado-consulta.json"
    Quando eu envio uma requisição POST para Consultar participante unificado
    Então o sistema deve retornar o código de status 200
    E a resposta para Consultar participante unificado deve ser válida

  @ppra @teste2
  Cenário: CT002 -  Verifica o estado de saude da aplicação
    Quando eu envio uma requisição GET para o endpoint Consultar participante unificado "/ci/healthcheck"
    Então o sistema deve retornar o código de status 200