import { useDecorators } from '@tsed/core';
import { Controller } from '@tsed/di';
import { ContentType } from '@tsed/schema';

const RestController = (options: any): ClassDecorator =>
  useDecorators(Controller(options), ContentType('application/json'));

export { RestController };
