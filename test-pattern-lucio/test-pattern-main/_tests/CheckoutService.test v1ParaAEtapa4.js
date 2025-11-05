
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';
import { UserMother } from './builders/UserMother.js';
import { CheckoutService } from '../src/services/CheckoutService.js';
import { Item } from '../src/domain/Item.js'; 


describe('CheckoutService', () => {
  
  let gatewayStub;
  let repositoryDummy;
  let emailServiceDummy;

  let checkoutService;

  beforeEach(() => {
    
    gatewayStub = {
      cobrar: jest.fn().mockResolvedValue({ success: false }),
    };

    
    repositoryDummy = {
      salvar: jest.fn(),
    };
    emailServiceDummy = {
      enviarEmail: jest.fn(),
    };

    
    checkoutService = new CheckoutService(
      gatewayStub,
      repositoryDummy,
      emailServiceDummy
    );
  });

  
  describe('quando o pagamento falha', () => {
    
    test('deve retornar null', async () => {
      
      
      const carrinho = new CarrinhoBuilder().build();

     
      const pedido = await checkoutService.processarPedido(carrinho);

      
      expect(pedido).toBeNull();
    });
  });
});