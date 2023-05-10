import * as argon2 from 'argon2';

import { DomainService } from './domain-service.decorator';

@DomainService()
class HasherDomainService {
  public static async hash(plainText: string): Promise<string> {
    return argon2.hash(plainText);
  }

  public static async compare(plainText: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, plainText);
  }
}

export { HasherDomainService };
