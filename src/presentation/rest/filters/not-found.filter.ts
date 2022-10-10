import { Catch, ExceptionFilterMethods, PlatformContext, ResourceNotFound } from '@tsed/common';

import { PathNotFoundException } from '@presentation/rest/exceptions';

@Catch(ResourceNotFound)
class ResourceNotFoundFilter implements ExceptionFilterMethods {
  public catch(_exception: ResourceNotFound, context: PlatformContext): void {
    const { request } = context;
    throw new PathNotFoundException(request.method, request.url);
  }
}

export { ResourceNotFoundFilter };
