import { describe, expect, it } from 'vitest';
import { createWorkflow } from './builder';

describe('WorkflowBuilder', () => {
  it('builds a minimal valid workflow', () => {
    const builder = createWorkflow('wf-1', 'Test Workflow')
      .description('A test')
      .trigger('manual');
    builder.addNode('trigger', 'Start');
    const wf = builder.build();

    expect(wf.id).toBe('wf-1');
    expect(wf.name).toBe('Test Workflow');
    expect(wf.description).toBe('A test');
    expect(wf.trigger).toBe('manual');
    expect(wf.nodes).toHaveLength(1);
    expect(wf.version).toBe(1);
  });

  it('builds a multi-node workflow with edges', () => {
    const builder = createWorkflow('wf-2', 'Multi Node');
    const trigger = builder.addNode('trigger', 'Trigger');
    const agent = builder.addNode('agent', 'Agent Step');
    const output = builder.addNode('output', 'Output');
    builder.addEdge(trigger.id, agent.id);
    builder.addEdge(agent.id, output.id);

    const wf = builder.build();
    expect(wf.nodes).toHaveLength(3);
    expect(wf.edges).toHaveLength(2);
  });

  it('rejects an empty workflow', () => {
    const result = createWorkflow('wf-3', 'Empty').validate();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Workflow must have at least one node');
  });

  it('rejects a workflow with DAG errors (cycle)', () => {
    const builder = createWorkflow('wf-4', 'Invalid');
    const t1 = builder.addNode('trigger', 'T1');
    const a1 = builder.addNode('agent', 'A1');
    const a2 = builder.addNode('agent', 'A2');
    builder.addEdge(t1.id, a1.id);
    builder.addEdge(a1.id, a2.id);
    builder.addEdge(a2.id, a1.id);

    const result = builder.validate();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Workflow DAG contains a cycle');
  });

  it('throws on build() when workflow is invalid', () => {
    expect(() => createWorkflow('wf-5', 'Bad').build()).toThrow(
      'Cannot build invalid workflow',
    );
  });

  it('sets version and trigger', () => {
    const builder = createWorkflow('wf-6', 'V2')
      .version(3)
      .trigger('webhook');
    builder.addNode('trigger', 'Start');
    const wf = builder.build();

    expect(wf.version).toBe(3);
    expect(wf.trigger).toBe('webhook');
  });

  it('supports node positioning via at()', () => {
    const builder = createWorkflow('wf-7', 'Positioned');
    const start = builder.addNode('trigger', 'Start');
    start.at(100, 200);
    const end = builder.addNode('output', 'End');
    builder.addEdge(start.id, end.id);

    const wf = builder.build();
    expect(wf.nodes[0].position).toEqual({ x: 100, y: 200 });
  });
});
