import { DateTime } from 'luxon';

import { AuthenticationUtils } from '@infrastructure/shared/authentication/authentication-utils';

enum RepositoryAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

abstract class BaseRepository<T> {
  protected getAuditablePersitenceModel(auditAction: RepositoryAction, persistenceModel?: T): T {
    const username = AuthenticationUtils.getAuthentication()?.username;
    const actionDate = DateTime.utc().toISO();

    return {
      ...((persistenceModel || {}) as T),
      ...(Array.of(RepositoryAction.CREATE).includes(auditAction) && { createdBy: username }),
      ...(Array.of(RepositoryAction.CREATE).includes(auditAction) && { createdAt: actionDate }),
      ...(Array.of(RepositoryAction.CREATE, RepositoryAction.UPDATE).includes(auditAction) && { updatedBy: username }),
      ...(Array.of(RepositoryAction.CREATE, RepositoryAction.UPDATE).includes(auditAction) && {
        updatedAt: actionDate
      }),
      ...(Array.of(RepositoryAction.DELETE).includes(auditAction) && { deletedBy: username }),
      ...(Array.of(RepositoryAction.DELETE).includes(auditAction) && { deletedAt: actionDate })
    };
  }
}

export { BaseRepository, RepositoryAction };
