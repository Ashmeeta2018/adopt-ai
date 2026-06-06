import { describe, expect, it } from 'vitest';
import {
  validateDAG,
  topologicalSort,
  getRootNodes,
  getDescendants,
  getExecutionBatches,
} from './dag';
import type { WorkflowNode, WorkflowEdge } from './types';

function node(id: string, kind = 'agent' as const): WorkflowNode {
  return { id, kind, label: id, config: {}, position: { x: 0, y: 0 } };
}

function edge(id: string, source: string, target: string): WorkflowEdge {
  return { id, source, target, kind: 'data' };
}

describe('validateDAG', () => {
  it('accepts a valid linear DAG', () => {
    const nodes = [node('a', 'trigger'), node('b'), node('c')];
    const edges = [edge('e1', 'a', 'b'), edge('e2', 'b', 'c')];
    const result = validateDAG(nodes, edges);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts a valid diamond DAG', () => {
    const nodes = [node('a', 'trigger'), node('b'), node('c'), node('d')];
    const edges = [
      edge('e1', 'a', 'b'),
      edge('e2', 'a', 'c'),
      edge('e3', 'b', 'd'),
      edge('e4', 'c', 'd'),
    ];
    expect(validateDAG(nodes, edges).valid).toBe(true);
  });

  it('rejects edges referencing unknown nodes', () => {
    const nodes = [node('a', 'trigger')];
    const edges = [edge('e1', 'a', 'missing')];
    const result = validateDAG(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Edge "e1" references unknown target node "missing"',
    );
  });

  it('rejects duplicate edges', () => {
    const nodes = [node('a', 'trigger'), node('b')];
    const edges = [edge('e1', 'a', 'b'), edge('e2', 'a', 'b')];
    const result = validateDAG(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Duplicate edge from "a" to "b"');
  });

  it('rejects non-trigger nodes with no incoming edges', () => {
    const nodes = [node('a', 'trigger'), node('b'), node('c')];
    const edges = [edge('e1', 'a', 'b')];
    const result = validateDAG(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('"c"') && e.includes('no incoming'))).toBe(true);
  });

  it('rejects cycles', () => {
    const nodes = [node('a', 'trigger'), node('b'), node('c')];
    const edges = [edge('e1', 'a', 'b'), edge('e2', 'b', 'c'), edge('e3', 'c', 'b')];
    const result = validateDAG(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Workflow DAG contains a cycle');
  });
});

describe('topologicalSort', () => {
  it('returns a valid ordering for a linear DAG', () => {
    const nodes = [node('a', 'trigger'), node('b'), node('c')];
    const edges = [edge('e1', 'a', 'b'), edge('e2', 'b', 'c')];
    const order = topologicalSort(nodes, edges);
    expect(order.indexOf('a')).toBeLessThan(order.indexOf('b'));
    expect(order.indexOf('b')).toBeLessThan(order.indexOf('c'));
  });

  it('includes all nodes', () => {
    const nodes = [node('a', 'trigger'), node('b'), node('c')];
    const edges = [edge('e1', 'a', 'b'), edge('e2', 'a', 'c')];
    const order = topologicalSort(nodes, edges);
    expect(order).toHaveLength(3);
    expect(order).toContain('a');
    expect(order).toContain('b');
    expect(order).toContain('c');
  });
});

describe('getRootNodes', () => {
  it('returns nodes with no incoming edges', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const edges = [edge('e1', 'a', 'b'), edge('e2', 'a', 'c')];
    const roots = getRootNodes(nodes, edges);
    expect(roots).toHaveLength(1);
    expect(roots[0].id).toBe('a');
  });

  it('returns all nodes when there are no edges', () => {
    const nodes = [node('a'), node('b')];
    const roots = getRootNodes(nodes, []);
    expect(roots).toHaveLength(2);
  });
});

describe('getDescendants', () => {
  it('returns all descendants of a node', () => {
    const edges = [edge('e1', 'a', 'b'), edge('e2', 'b', 'c'), edge('e3', 'b', 'd')];
    const descendants = getDescendants('a', edges);
    expect(descendants).toContain('b');
    expect(descendants).toContain('c');
    expect(descendants).toContain('d');
    expect(descendants).toHaveLength(3);
  });

  it('returns empty for a leaf node', () => {
    const edges = [edge('e1', 'a', 'b')];
    expect(getDescendants('b', edges)).toHaveLength(0);
  });
});

describe('getExecutionBatches', () => {
  it('batches a linear DAG correctly', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const edges = [edge('e1', 'a', 'b'), edge('e2', 'b', 'c')];
    const batches = getExecutionBatches(nodes, edges);
    expect(batches).toEqual([['a'], ['b'], ['c']]);
  });

  it('batches a diamond DAG with parallel nodes in the same batch', () => {
    const nodes = [node('a'), node('b'), node('c'), node('d')];
    const edges = [
      edge('e1', 'a', 'b'),
      edge('e2', 'a', 'c'),
      edge('e3', 'b', 'd'),
      edge('e4', 'c', 'd'),
    ];
    const batches = getExecutionBatches(nodes, edges);
    expect(batches[0]).toEqual(['a']);
    expect(batches[1].sort()).toEqual(['b', 'c']);
    expect(batches[2]).toEqual(['d']);
  });

  it('returns all nodes in a single batch for disconnected nodes', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const batches = getExecutionBatches(nodes, []);
    expect(batches).toHaveLength(1);
    expect(batches[0].sort()).toEqual(['a', 'b', 'c']);
  });
});
