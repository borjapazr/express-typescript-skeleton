import { DateTime } from 'luxon';

import { AuthenticationUtils } from '@infrastructure/shared/authentication/authentication-utils';

enum RepositoryAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

abstract class BasePrismaRepository<T> {
  protected getAuditablePersitenceModel(auditAction: RepositoryAction, persistenceModel?: T): T {
    const username = AuthenticationUtils.getAuthentication()?.username;

    return {
      ...((persistenceModel || {}) as T),
      createdBy: Array.of(RepositoryAction.CREATE).includes(auditAction) ? username : undefined,
      updatedBy: Array.of(RepositoryAction.CREATE, RepositoryAction.UPDATE).includes(auditAction)
        ? username
        : undefined,
      deletedBy: Array.of(RepositoryAction.DELETE).includes(auditAction) ? username : undefined,
      deletedAt: Array.of(RepositoryAction.DELETE).includes(auditAction) ? DateTime.utc().toJSDate() : undefined
    };
  }
}

export { BasePrismaRepository, RepositoryAction };
