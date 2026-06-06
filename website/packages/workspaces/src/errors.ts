export class WorkspaceNotFoundError extends Error {
  constructor(public readonly organisationId: string) {
    super(`Workspace not found: ${organisationId}`);
    this.name = "WorkspaceNotFoundError";
  }
}

export class InsufficientPermissionsError extends Error {
  constructor(
    public readonly userId: string,
    public readonly organisationId: string,
    public readonly action: string,
  ) {
    super(
      `User ${userId} lacks permission to ${action} in organisation ${organisationId}`,
    );
    this.name = "InsufficientPermissionsError";
  }
}

export class PlanLimitExceededError extends Error {
  constructor(
    public readonly organisationId: string,
    public readonly action: string,
    public readonly limit: number,
    public readonly current: number,
  ) {
    super(
      `Plan limit exceeded for ${action} in organisation ${organisationId}: ${current}/${limit}`,
    );
    this.name = "PlanLimitExceededError";
  }
}

export class MemberAlreadyExistsError extends Error {
  constructor(
    public readonly userId: string,
    public readonly organisationId: string,
  ) {
    super(
      `User ${userId} is already a member of organisation ${organisationId}`,
    );
    this.name = "MemberAlreadyExistsError";
  }
}
