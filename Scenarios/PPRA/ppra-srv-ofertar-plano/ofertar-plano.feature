# language: pt
Funcionalidade: SISTRAN » Projeto - ppra-srv-ofertar-plano

  @teste
  Cenário: CT001 - Listar oferta com Sucesso
    Dado que eu esteja autenticado para ofertar plano
    E que eu utilize o payload do arquivo ofertar plano "PPRA/ppra-srv-ofertar-plano/ct01_lista_oferta_plano.json"
    Quando eu envio uma requisição POST para ofertar plano
    Então o sistema deve retornar o código de status 200
    E a resposta de uma oferta de plano deve ser válida

  @teste
  Cenário: CT002 -  Verifica o estado de saude da aplicação
    Quando eu envio uma requisição GET para o endpoint para ofertar plano "/ci/healthcheck"
    Então o sistema deve retornar o código de status 200