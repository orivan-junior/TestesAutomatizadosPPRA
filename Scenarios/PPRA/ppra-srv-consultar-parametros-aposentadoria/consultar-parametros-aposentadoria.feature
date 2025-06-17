#language: pt
Funcionalidade: SISTRAN » Projeto - PPRA-SRV-CONSULTAR-PARAMETROS-APOSENTADORIA

  @consultarParametros @ppra @teste2
  Cenário: CT001 - Consultar parâmetros de aposentadoria sem sucesso
    # Parâmetros do corpo da requisição
    Dado que eu não esteja autenticado
    E para a consulta de parâmetros, a chave "identificaConsulta" tem o valor "0"
    E para a consulta de parâmetros, a chave "codigoDetalhe" tem o valor "0"
    E para a consulta de parâmetros, a chave "chave" tem o valor "string"
    # Parâmetros do cabeçalho
    E para a consulta de parâmetros, a chave "codigoVersao" tem o valor "1"
    E para a consulta de parâmetros, a chave "codigoFuncao" tem o valor "1"
    E para a consulta de parâmetros, a chave "canal" tem o valor "1"
    E para a consulta de parâmetros, a chave "usuario" tem o valor "1"
    E para a consulta de parâmetros, a chave "origem" tem o valor "1"
    E para a consulta de parâmetros, a chave "identificadorFuncionario" tem o valor "teste"
    E para a consulta de parâmetros, a chave "codigoCorretor" tem o valor "1"
    E para a consulta de parâmetros, a chave "identificaRepresentante" tem o valor "teste"
    E para a consulta de parâmetros, a chave "centroCusto" tem o valor "teste"
    Quando eu envio uma requisição POST para consultar os parâmetros de aposentadoria
    Então o sistema deve retornar o código de status 403
    E a resposta da consulta de parâmetros deve ser válida

  @consultarParametros @ppra @teste2
  Cenário: CT001 - Consultar parâmetros de aposentadoria com sucesso
    # Parâmetros do corpo da requisição
    Dado para a consulta de parâmetros, a chave "identificaConsulta" tem o valor "1"
    E para a consulta de parâmetros, a chave "codigoDetalhe" tem o valor "0"
    E para a consulta de parâmetros, a chave "chave" tem o valor "0"
    # Parâmetros do cabeçalho
    E para a consulta de parâmetros, a chave "codigoVersao" tem o valor "1"
    E para a consulta de parâmetros, a chave "codigoFuncao" tem o valor "1"
    E para a consulta de parâmetros, a chave "canal" tem o valor "3"
    E para a consulta de parâmetros, a chave "usuario" tem o valor "999"
    E para a consulta de parâmetros, a chave "origem" tem o valor "5310"
    E para a consulta de parâmetros, a chave "identificadorFuncionario" tem o valor "N"
    E para a consulta de parâmetros, a chave "codigoCorretor" tem o valor "90000001"
    E para a consulta de parâmetros, a chave "identificaRepresentante" tem o valor "N"
    E para a consulta de parâmetros, a chave "centroCusto" tem o valor "FGBI"
    Quando eu envio uma requisição POST para consultar os parâmetros de aposentadoria
    Então o sistema deve retornar o código de status 200
    E a resposta da consulta de parâmetros deve ser válida

  @healthcheck @ppra @teste2
  Cenário: CT002 - Consultar Healthcheck do serviço de consulta de parâmetros
    Quando eu envio uma requisição GET para o healthcheck do serviço de consulta de parâmetros
    Então a resposta do healthcheck do serviço de consulta de parâmetros deve ser válida
    Então o sistema deve retornar o código de status 200