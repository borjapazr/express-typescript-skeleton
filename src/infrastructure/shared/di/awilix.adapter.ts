import { AwilixContainer } from 'awilix';
import { ClassConstructor, IocAdapter } from 'routing-controllers';

class AwilixAdapter implements IocAdapter {
  private readonly diContainer: AwilixContainer;

  private classNameMapper: (className: string) => string;

  constructor(diContainer: AwilixContainer, classNameMapper: (className: string) => string) {
    this.diContainer = diContainer;
    this.classNameMapper = classNameMapper;
  }

  public get<T>(someClass: ClassConstructor<T>): T {
    return this.diContainer.resolve<T>(this.classNameMapper(someClass.name));
  }
}

export { AwilixAdapter };
