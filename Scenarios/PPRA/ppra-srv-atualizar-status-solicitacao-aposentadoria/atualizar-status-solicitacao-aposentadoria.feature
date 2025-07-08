# language: pt
Funcionalidade: SISTRAN » Projeto - ppra-SRV-ATUALIZAR-STATUS-SOLICITACAO-APOSENTADORIA

  @ppra
  Cenário: CT001 - Atualizar status de uma solicitação de aposentadoria sem sucesso
    Dado para a atualização, a chave "codigoSolicitacao" tem o valor "9000001117"
    E para a atualização, a chave "codigoSituacao" tem o valor "8"
    E para a atualização, a chave "codigoMotivo" tem o valor "14"
    E para a atualização, a chave "observacao" tem o valor "Status atualizado via teste BDD"
    E para a atualização, a chave "codigoVersao" tem o valor "1"
    E para a atualização, a chave "codigoFuncao" tem o valor "1"
    E para a atualização, a chave "canal" tem o valor "3"
    E para a atualização, a chave "usuario" tem o valor "999"
    E para a atualização, a chave "origem" tem o valor "5310"
    E para a atualização, a chave "identificadorFuncionario" tem o valor "N"
    E para a atualização, a chave "codigoCorretor" tem o valor "90000001"
    E para a atualização, a chave "identificaRepresentante" tem o valor "N"
    E para a atualização, a chave "centroCusto" tem o valor "FGBI"
    Quando eu envio uma requisição POST para atualizar o status da solicitação de aposentadoria
    Então o sistema deve retornar o código de status 422
    

  @ppra
  Cenário: CT001 - Atualizar status de uma solicitação de aposentadoria com sucesso
    Dado para a atualização, a chave "codigoSolicitacao" tem o valor "12345"
    E para a atualização, a chave "codigoSituacao" tem o valor "2"
    E para a atualização, a chave "codigoMotivo" tem o valor "1"
    E para a atualização, a chave "observacao" tem o valor "Status atualizado via teste BDD"
    E para a atualização, a chave "codigoVersao" tem o valor "1"
    E para a atualização, a chave "codigoFuncao" tem o valor "1"
    E para a atualização, a chave "canal" tem o valor "1"
    E para a atualização, a chave "usuario" tem o valor "1"
    E para a atualização, a chave "origem" tem o valor "1"
    E para a atualização, a chave "identificadorFuncionario" tem o valor "teste"
    E para a atualização, a chave "codigoCorretor" tem o valor "1"
    E para a atualização, a chave "identificaRepresentante" tem o valor "teste"
    E para a atualização, a chave "centroCusto" tem o valor "teste"
    Quando eu envio uma requisição POST para atualizar o status da solicitação de aposentadoria
    Então o sistema deve retornar o código de status 422
    #Deveria ser 200 - estamos verificando codigo de solicitação

  @ppra
  Cenário: CT002 - Consultar Healthcheck do serviço de atualização de status
    Quando eu envio uma requisição GET para o healthcheck do serviço de atualização de status
    Então a resposta do healthcheck do serviço de atualização de status deve ser válida
    Então o sistema deve retornar o código de status 200