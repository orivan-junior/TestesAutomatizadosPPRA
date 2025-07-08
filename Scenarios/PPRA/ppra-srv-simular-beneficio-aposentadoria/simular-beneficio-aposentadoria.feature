# language: pt
Funcionalidade: SISTRAN » Projeto - PPRA-SRV-SIMULAR-BENEFICIO-APOSENTADORIA

  @ppra @teste2
  Cenário: CT01 - Simular benefício de aposentadoria com sucesso
    Dado que eu esteja autenticado
    E que eu utilize o payload do arquivo "PPRA/ppra-srv-simular-beneficio-aposentadoria/ct01_simular_beneficio_sucesso.json"
    Quando eu envio uma requisição POST para simular o benefício de aposentadoria
    Então o sistema deve retornar o código de status 200
    E a resposta da simulação de benefício deve ser válida

  @ppra @teste2
  Cenário: CT02 - Verificar a saúde do serviço
    Quando eu envio uma requisição GET para o endpoint "/ci/healthcheck"
    Então o sistema deve retornar o código de status 200