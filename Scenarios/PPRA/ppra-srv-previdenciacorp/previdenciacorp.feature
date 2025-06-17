# language: pt
Funcionalidade: SISTRAN » Projeto - PPRA-SRV-PREVIDENCIACORP

  @ppra
  Cenário: CT001 - Consultar Previdencia
    Dado eu envio uma requisição GET para o healthcheck do PrevidenciaCorp
    Então a resposta do healthcheck do PrevidenciaCorp deve ser válida
    Então o sistema deve retornar o código de status 200

  @ppra
  Cenário: CT002 - Gerar Extrato Consolidado em PDF com sucesso
    # Dados do payload da requisição
    Dado para a geração do extrato, a chave "cpf" tem o valor "07592084929"
    E para a geração do extrato, a chave "nomeCliente" tem o valor ""
    E para a geração do extrato, a chave "agencia" tem o valor "0"
    E para a geração do extrato, a chave "conta" tem o valor "0"
    E para a geração do extrato, a chave "tpRetorno" tem o valor "1"
    E para a geração do extrato, a chave "canal" tem o valor "8"
    # Headers da requisição
    Quando eu envio uma requisição POST para o endpoint "/extrato-consolidado/pdf" do serviço PrevidenciaCorp
    Então o sistema deve retornar o código de status 200
    E o header "Content-Type" da resposta deve ser "application/pdf"
    E o PDF retornado deve conter o texto "Documento obtido pelo aplicativo Bradesco Seguros em [DATA_ATUAL_DD/MM/YYYY]"
    E o PDF retornado deve ser salvo como "extrato_consolidado.pdf"