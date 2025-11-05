
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';
import { UserMother } from './builders/UserMother.js';
import { CheckoutService } from '../src/services/CheckoutService.js';
import { Item } from '../src/domain/Item.js';
import { Pedido } from '../src/domain/Pedido.js'; 



describe('CheckoutService', () => {
  
  let gateway;
  let repository;
  let emailService;

  let checkoutService;

  beforeEach(() => {
    gateway = {
      cobrar: jest.fn(),
    };
    repository = {
      salvar: jest.fn(),
    };
    emailService = {
      enviarEmail: jest.fn(),
    };

    checkoutService = new CheckoutService(
      gateway,
      repository,
      emailService
    );
  });

  describe('quando o pagamento falha', () => {
    
    test('deve retornar null', async () => {
      gateway.cobrar.mockResolvedValue({ success: false });
      const carrinho = new CarrinhoBuilder().build();
      const pedido = await checkoutService.processarPedido(carrinho);
      expect(pedido).toBeNull();
    });
  });

  describe('quando um cliente Premium finaliza a compra', () => {
    
    test('deve aplicar o desconto e enviar o e-mail', async () => {
      
      const user = UserMother.umUsuarioPremium();
      const itens = [
        new Item('Produto Caro', 200) 
      ];
      const carrinho = new CarrinhoBuilder().comUser(user).comItens(itens).build();
      
      gateway.cobrar.mockResolvedValue({ success: true });
      const pedidoSalvo = new Pedido(carrinho, 180, 'PROCESSADO');
      repository.salvar.mockResolvedValue(pedidoSalvo);
      
    
      const pedido = await checkoutService.processarPedido(carrinho);

      
      
      expect(gateway.cobrar).toHaveBeenCalledTimes(1);
      expect(gateway.cobrar).toHaveBeenCalledWith(180, undefined);
      
      expect(emailService.enviarEmail).toHaveBeenCalledTimes(1);
      
      expect(emailService.enviarEmail).toHaveBeenCalledWith(
        'premium@email.com', 
        'Seu Pedido foi Aprovado!',
        expect.anything() 
      );
    });
  });
});