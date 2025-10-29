const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpa e Refatorada', () => {
  let userService;

  // O setup é executado antes de cada teste
  beforeEach(() => {
    userService = new UserService();
    userService._clearDB(); // Limpa o "banco" para cada teste
  });

  /*
   * -----------------------------------------------------------------
   * REATORAÇÃO 1: "Eager Test" 
   * O teste original 'deve criar e buscar um usuário' fazia duas
   * coisas ao mesmo tempo. Ele foi quebrado em dois testes focados,
   * cada um seguindo o padrão Arrange, Act, Assert (AAA).
   * [cite: 82, 83]
   * -----------------------------------------------------------------
   */

  test('oteste deve CRIAR um usuário com sucesso', () => {

    const nome = dadosUsuarioPadrao.nome;
    const email = dadosUsuarioPadrao.email;
    const idade = dadosUsuarioPadrao.idade;

    const usuarioCriado = userService.createUser(nome, email, idade);

    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(nome);
    expect(usuarioCriado.status).toBe('ativo');
  });

  test('o teste deve BUSCAR um usuário por ID com sucesso', () => {

    const usuarioPreExistente = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    const usuarioBuscado = userService.getUserById(usuarioPreExistente.id);

    expect(usuarioBuscado.id).toBe(usuarioPreExistente.id);
    expect(usuarioBuscado.nome).toBe(dadosUsuarioPadrao.nome);
  });

  /*
   * -----------------------------------------------------------------
   * REATORAÇÃO 2: "Lógica Condicional"
   * O teste 'deve desativar usuários...' usava um loop 'for' e 'if'
   * para testar dois cenários (admin e comum) de uma vez.
   * Isso acionava o erro "jest/no-conditional-expect".
   *
   * A solução é quebrar em dois testes, um para cada cenário.
   * [cite: 85]
   * -----------------------------------------------------------------
   */

  test('o teste deve desativar um usuário comum com sucesso', () => {
    
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('NÃO deve desativar um usuário administrador', () => {
  
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

  
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo'); 
  });

  /*
   * -----------------------------------------------------------------
   * REATORAÇÃO 3: "Teste Frágil" (Fragile Test)
   * O teste 'deve gerar um relatório...' verificava uma string
   * formatada exata. Se um espaço mudasse, o teste quebraria.
   * A refatoração verifica apenas o *conteúdo* essencial,
   * tornando o teste mais robusto.
   * [cite: 86]
   * -----------------------------------------------------------------
   */

  test('o console deve gerar um relatório contendo os nomes dos usuários', () => {

    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

    const relatorio = userService.generateUserReport();

    // Em vez de checar a linha exata, checamos se o conteúdo esperado está presente no relatório.

    expect(relatorio).toEqual(expect.stringContaining('--- Relatório de Usuários ---'));
    expect(relatorio).toEqual(expect.stringContaining(usuario1.nome)); 
    expect(relatorio).toEqual(expect.stringContaining(usuario2.nome)); 
    expect(relatorio).toEqual(expect.stringContaining(usuario1.id));
  });

  /*
   * -----------------------------------------------------------------
   * REATORAÇÃO 4: Lógica Condicional (try/catch)
   * O teste 'deve falhar ao criar usuário menor de idade' usava
   * try/catch. Se a função parasse de lançar o erro, o teste
   * passaria "silenciosamente", escondendo o bug.
   *
   * -----------------------------------------------------------------
   */

  test('o console deve LANÇAR UM ERRO ao tentar criar usuário menor de idade', () => {
    const acaoDeCriar = () => {
      userService.createUser('Menor', 'menor@email.com', 17);
    };

    expect(acaoDeCriar).toThrow('O usuário deve ser maior de idade.');
  });

 /*
   * -----------------------------------------------------------------
   * REATORAÇÃO 5: "Teste Desabilitado" (Disabled Test)
   * O teste foi implementado usando a API pública (generateUserReport)
   * para verificar o estado de "não há usuários".
   *
   * -----------------------------------------------------------------
   */

  test('o teste deve gerar um relatório vazio quando não há usuários', () => {
    // Arrange (O beforeEach já limpou o DB)

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    // Verificamos se o relatório contém o cabeçalho,
    // mas não contém indicadores de que usuários foram listados.
    expect(relatorio).toEqual(expect.stringContaining('--- Relatório de Usuários ---'));
    expect(relatorio).not.toEqual(expect.stringContaining('ID:'));
    expect(relatorio).not.toEqual(expect.stringContaining('Nome:'));
  });
});