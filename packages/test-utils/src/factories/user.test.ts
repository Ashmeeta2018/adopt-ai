import { describe, expect, it } from 'vitest';
import {
  createUser,
  createOrganisation,
  createMembership,
  createAgent,
  createAgentRun,
  createAlert,
  createWeeklyReport,
  createSession,
} from './user';

describe('createUser', () => {
  it('creates a user with defaults', () => {
    const user = createUser();
    expect(user.id).toBeTruthy();
    expect(user.email).toContain('@example.com');
    expect(user.name).toBe('Test User');
    expect(user.deletedAt).toBeNull();
  });

  it('applies overrides', () => {
    const user = createUser({ name: 'Alice', email: 'alice@test.com' });
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@test.com');
  });

  it('preserves unspecified defaults', () => {
    const user = createUser({ name: 'Bob' });
    expect(user.email).toContain('@example.com');
  });
});

describe('createOrganisation', () => {
  it('creates an organisation with defaults', () => {
    const org = createOrganisation();
    expect(org.plan).toBe('spark');
    expect(org.slug).toContain('test-org-');
  });

  it('applies plan overrides', () => {
    const org = createOrganisation({ plan: 'ember' });
    expect(org.plan).toBe('ember');
  });
});

describe('createMembership', () => {
  it('links a user and organisation', () => {
    const membership = createMembership({ role: 'OWNER' });
    expect(membership.role).toBe('OWNER');
    expect(membership.userId).toBeTruthy();
    expect(membership.organisationId).toBeTruthy();
  });
});

describe('createAgent', () => {
  it('creates an agent with defaults', () => {
    const agent = createAgent();
    expect(agent.kind).toBe('CUSTOM');
    expect(agent.status).toBe('RUNNING');
  });

  it('accepts kind and status overrides', () => {
    const agent = createAgent({ kind: 'INBOX_TRIAGE', status: 'PAUSED' });
    expect(agent.kind).toBe('INBOX_TRIAGE');
    expect(agent.status).toBe('PAUSED');
  });
});

describe('createAgentRun', () => {
  it('creates a run with defaults', () => {
    const run = createAgentRun();
    expect(run.status).toBe('success');
    expect(run.tokenInput).toBe(120);
    expect(run.costUsd).toBeTruthy();
  });
});

describe('createAlert', () => {
  it('creates an alert with defaults', () => {
    const alert = createAlert();
    expect(alert.severity).toBe('OPS');
    expect(alert.read).toBe(false);
  });
});

describe('createWeeklyReport', () => {
  it('creates a report with pipeline data', () => {
    const report = createWeeklyReport();
    expect(report.hoursSaved).toBe('22.50');
    expect(report.pipelinesJson.pipelines).toHaveLength(2);
  });
});

describe('createSession', () => {
  it('creates a session with a future expiry', () => {
    const session = createSession();
    expect(session.sessionToken).toContain('st_');
    expect(session.expires.getTime()).toBeGreaterThan(Date.now());
  });
});
