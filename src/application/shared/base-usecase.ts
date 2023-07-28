import { performance } from 'node:perf_hooks';

import { Logger } from '@domain/shared';

import { UseCaseRequest } from './usecase.request';

abstract class BaseUseCase<IRequest extends UseCaseRequest, IResponse> {
  public async execute(request: IRequest): Promise<IResponse> {
    try {
      const startTime = performance.now();

      request.validate();

      const response = await this.performOperation(request);

      const endTime = performance.now();

      const useCaseExecutionTime = endTime - startTime;

      Logger.info(`${this.constructor.name}.execute(${request}) took +${useCaseExecutionTime} ms to execute!`);

      return response;
    } catch (error) {
      Logger.error(`[@UseCase] ${this.constructor.name}.execute(${request}) threw the following error! --- ${error}`);
      throw error;
    }
  }

  protected abstract performOperation(request: IRequest): Promise<IResponse>;
}

export { BaseUseCase };
