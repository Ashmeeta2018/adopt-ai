import type { WorkflowNode, WorkflowEdge } from './types';

interface DAGValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateDAG(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): DAGValidationResult {
  const errors: string[] = [];
  const nodeIds = new Set(nodes.map((n) => n.id));

  const edgeKeys = new Set<string>();
  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) {
      errors.push(`Edge "${edge.id}" references unknown source node "${edge.source}"`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Edge "${edge.id}" references unknown target node "${edge.target}"`);
    }

    const key = `${edge.source}->${edge.target}`;
    if (edgeKeys.has(key)) {
      errors.push(`Duplicate edge from "${edge.source}" to "${edge.target}"`);
    }
    edgeKeys.add(key);
  }

  const nonTriggerNodes = nodes.filter((n) => n.kind !== 'trigger');
  const nodesWithIncoming = new Set(edges.map((e) => e.target));
  for (const node of nonTriggerNodes) {
    if (!nodesWithIncoming.has(node.id)) {
      errors.push(`Node "${node.id}" ("${node.label}") has no incoming edges and is not a trigger`);
    }
  }

  if (hasCycle(nodes, edges)) {
    errors.push('Workflow DAG contains a cycle');
  }

  return { valid: errors.length === 0, errors };
}

function hasCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
  }

  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  const color = new Map<string, number>();
  for (const node of nodes) {
    color.set(node.id, WHITE);
  }

  function dfs(nodeId: string): boolean {
    color.set(nodeId, GRAY);
    const neighbours = adjacency.get(nodeId) ?? [];
    for (const neighbour of neighbours) {
      const neighbourColor = color.get(neighbour);
      if (neighbourColor === GRAY) return true;
      if (neighbourColor === WHITE && dfs(neighbour)) return true;
    }
    color.set(nodeId, BLACK);
    return false;
  }

  for (const node of nodes) {
    if (color.get(node.id) === WHITE && dfs(node.id)) return true;
  }
  return false;
}

export function topologicalSort(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): string[] {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) queue.push(nodeId);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    for (const neighbour of adjacency.get(current) ?? []) {
      const newDegree = (inDegree.get(neighbour) ?? 1) - 1;
      inDegree.set(neighbour, newDegree);
      if (newDegree === 0) queue.push(neighbour);
    }
  }

  return sorted;
}

export function getRootNodes(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): WorkflowNode[] {
  const targets = new Set(edges.map((e) => e.target));
  return nodes.filter((n) => !targets.has(n.id));
}

export function getDescendants(nodeId: string, edges: WorkflowEdge[]): string[] {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.source) ?? [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  const visited = new Set<string>();
  const stack = [...(adjacency.get(nodeId) ?? [])];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);
    const children = adjacency.get(current) ?? [];
    for (const child of children) {
      if (!visited.has(child)) stack.push(child);
    }
  }

  return [...visited];
}

export function getExecutionBatches(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): string[][] {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  const batches: string[][] = [];
  let currentBatch: string[] = [];

  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) currentBatch.push(nodeId);
  }

  while (currentBatch.length > 0) {
    batches.push(currentBatch);
    const nextBatch: string[] = [];

    for (const nodeId of currentBatch) {
      for (const neighbour of adjacency.get(nodeId) ?? []) {
        const newDegree = (inDegree.get(neighbour) ?? 1) - 1;
        inDegree.set(neighbour, newDegree);
        if (newDegree === 0) nextBatch.push(neighbour);
      }
    }

    currentBatch = nextBatch;
  }

  return batches;
}
