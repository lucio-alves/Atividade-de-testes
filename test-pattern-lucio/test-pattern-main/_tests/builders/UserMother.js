
import { User } from '../../src/domain/User.js';

export class UserMother {
  static umUsuarioPadrao() {
    
    return new User(
      'user-123',
      'Usuário Padrão',
      'padrao@email.com',
      'PADRAO' 
    );
  }

  static umUsuarioPremium() {
    return new User(
      'user-premium-456',
      'Usuário Premium',
      'premium@email.com',
      'PREMIUM'
    );
  }
}