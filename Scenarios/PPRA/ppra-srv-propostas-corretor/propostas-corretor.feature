# language: pt
Funcionalidade: SISTRAN » Projeto - PPRA-SRV-PROPOSTAS-CORRETOR

  @propostas_pendentes_cnpj @ppra
  Cenário: CT001 - Consultar Propostas Pendentes com sucesso usando CNPJ do Corretor
    # Parâmetros do cabeçalho
    Dado para a consulta de propostas, o header "canal" tem o valor "27"
    # Parâmetros da query string
    Quando eu consulto propostas pendentes para o corretor com CNPJ "14560304000118"
    # Então o sistema deve retornar o código de status 200
    Então o sistema deve retornar o código de status 400
    E a resposta da consulta de propostas pendentes deve ser válida

  @propostas_pendentes_cnpj @ppra
  Cenário: CT001 - Consultar Propostas Pendentes Sem sucesso usando CNPJ do Corretor
    # Parâmetros do cabeçalho
    Dado para a consulta de propostas, o header "canal" tem o valor "27"
    # Parâmetros da query string
    Quando eu consulto propostas pendentes para o corretor com CNPJ "07753626000118"
    # Então o sistema deve retornar o código de status 200
    Então o sistema deve retornar o código de status 422
    E a resposta da consulta de propostas pendentes deve ser válida

  @propostas_pendentes_cnpj @ppra
  Cenário: CT001 - Consultar Propostas Pendentes Sem sucesso usando CNPJ do Corretor Inválido
    # Parâmetros do cabeçalho
    Dado para a consulta de propostas, o header "canal" tem o valor "27"
    # Parâmetros da query string
    Quando eu consulto propostas pendentes para o corretor com CNPJ "1497994000166"
    # Então o sistema deve retornar o código de status 200
    Então o sistema deve retornar o código de status 400
    E a resposta da consulta de propostas pendentes deve ser válida

  @propostas_em_implantacao_cnpj @ppra
  Cenário: CT002 - Consultar Propostas Em Implantação com sucesso usando CNPJ do Corretor
    # Parâmetros do cabeçalho
    Dado para a consulta de propostas, o header "canal" tem o valor "27"
    # Parâmetros da query string
    Quando eu consulto propostas em implantação para o corretor com CNPJ "14560304000118"
    # Então o sistema deve retornar o código de status 200
    Então o sistema deve retornar o código de status 400
    E a resposta da consulta de propostas em implantação deve ser válida

  @propostas_em_implantacao_cnpj @ppra
  Cenário: CT002 - Consultar Propostas Em Implantação Sem sucesso usando CNPJ do Corretor
    # Parâmetros do cabeçalho
    Dado para a consulta de propostas, o header "canal" tem o valor "27"
    # Parâmetros da query string
    Quando eu consulto propostas em implantação para o corretor com CNPJ "07753626000118"
    Então o sistema deve retornar o código de status 422
    E a resposta da consulta de propostas em implantação deve ser válida

  @propostas_em_implantacao_cnpj @ppra
  Cenário: CT002 - Consultar Propostas Em Implantação Sem sucesso usando CNPJ do Corretor Inválido
    # Parâmetros do cabeçalho
    Dado para a consulta de propostas, o header "canal" tem o valor "27"
    # Parâmetros da query string
    Quando eu consulto propostas em implantação para o corretor com CNPJ "1497994000166"
    Então o sistema deve retornar o código de status 400
    E a resposta da consulta de propostas em implantação deve ser válida

  @propostas_carteira_cnpj @ppra
  Cenário: CT003 - Consultar Carteira de Propostas com sucesso usando CNPJ do Corretor
    # Parâmetros do cabeçalho
    Dado para a consulta de propostas, o header "canal" tem o valor "27"
    # Parâmetros da query string
    Quando eu consulto a carteira de propostas para o corretor com CNPJ "14560304000118"
    # Então o sistema deve retornar o código de status 200
    Então o sistema deve retornar o código de status 400
    E a resposta da consulta da carteira de propostas deve ser válida

  @propostas_carteira_cnpj @ppra
  Cenário: CT003 - Consultar Carteira de Propostas Sem sucesso usando CNPJ do Corretor
    # Parâmetros do cabeçalho
    Dado para a consulta de propostas, o header "canal" tem o valor "27"
    # Parâmetros da query string
    Quando eu consulto a carteira de propostas para o corretor com CNPJ "02505611000117"
    # Então o sistema deve retornar o código de status 200
    Então o sistema deve retornar o código de status 422
    E a resposta da consulta da carteira de propostas deve ser válida

  @propostas_carteira_cnpj @ppra
  Cenário: CT003 - Consultar Carteira de Propostas Sem sucesso usando CNPJ do Corretor Inválido
    # Parâmetros do cabeçalho
    Dado para a consulta de propostas, o header "canal" tem o valor "27"
    # Parâmetros da query string
    Quando eu consulto a carteira de propostas para o corretor com CNPJ "1497994000166"
    # Então o sistema deve retornar o código de status 200
    Então o sistema deve retornar o código de status 400
    E a resposta da consulta da carteira de propostas deve ser válida

  @propostas_cards_cnpj @ppra
  Cenário: CT004 - Consultar Cards de Propostas com sucesso usando CNPJ do Corretor
    # Parâmetros do cabeçalho
    Dado para a consulta de propostas, o header "canal" tem o valor "2"
    # Parâmetros da query string
    Quando eu consulto os cards de propostas para o corretor com CNPJ "14560304000118"
    Então o sistema deve retornar o código de status 200
    E a resposta da consulta dos cards de propostas deve ser válida

  @propostas_cards_cnpj @ppra
  Cenário: CT004 - Consultar Cards de Propostas Sem sucesso usando CNPJ do Corretor Inválido
    # Parâmetros do cabeçalho
    Dado para a consulta de propostas, o header "canal" tem o valor "2"
    # Parâmetros da query string
    Quando eu consulto os cards de propostas para o corretor com CNPJ "1497994000166"
    Então o sistema deve retornar o código de status 400
    E a resposta da consulta dos cards de propostas deve ser válida

  @healthcheck_propostas_corretor @ppra
  Cenário: CT005 - Consultar Healthcheck do serviço de propostas do corretor
    Quando eu envio uma requisição GET para o healthcheck do serviço de propostas do corretor
    Então a resposta do healthcheck do serviço de propostas do corretor deve ser válida
    Então o sistema deve retornar o código de status 200