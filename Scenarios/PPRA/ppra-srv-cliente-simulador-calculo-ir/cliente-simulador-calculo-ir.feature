# language: pt
Funcionalidade: SISTRAN » Projeto - ppra-srv-cliente-simulador-calculo-ir

  @calculoir
  Cenário: CT001 - Simulador sinistro com Sucesso
    Dado que eu esteja autenticado para simular o Sinistro
    Quando eu envio uma requisição GET para o endpoint para simular o cálculo ir "/simulador/sinistro"
    Então o sistema deve retornar o código de status 200
    E a resposta da simulação de Sinistro deve ser válida

  @calculoir
  Cenário: CT002 -  Verifica o estado de saude da aplicação
    Quando eu envio uma requisição GET para o endpoint para simular o cálculo ir "/ci/healthcheck"
    Então o sistema deve retornar o código de status 200