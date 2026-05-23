import { z } from 'zod';
import type {
  WorkflowDefinition,
  WorkflowTrigger,
  WorkflowNode,
  WorkflowEdge,
  NodeKind,
  EdgeKind,
} from './types';
import { validateDAG } from './dag';

function nextNodeId(): string {
  return crypto.randomUUID();
}

function nextEdgeId(): string {
  return crypto.randomUUID();
}

export class NodeBuilder {
  private readonly node: WorkflowNode;

  constructor(node: WorkflowNode) {
    this.node = node;
  }

  get id(): string {
    return this.node.id;
  }

  at(x: number, y: number): NodeBuilder {
    this.node.position = { x, y };
    return this;
  }

  get(): WorkflowNode {
    return this.node;
  }
}

export class WorkflowBuilder {
  private readonly _id: string;
  private readonly _name: string;
  private _description = '';
  private _version = 1;
  private _trigger: WorkflowTrigger = 'manual';
  private readonly _nodes: WorkflowNode[] = [];
  private readonly _edges: WorkflowEdge[] = [];
  private _inputSchema: Record<string, unknown> | undefined;
  private _outputSchema: Record<string, unknown> | undefined;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
  }

  description(text: string): WorkflowBuilder {
    this._description = text;
    return this;
  }

  version(n: number): WorkflowBuilder {
    this._version = n;
    return this;
  }

  trigger(trigger: WorkflowTrigger): WorkflowBuilder {
    this._trigger = trigger;
    return this;
  }

  addNode(kind: NodeKind, label: string, config?: Record<string, unknown>): NodeBuilder {
    const node: WorkflowNode = {
      id: nextNodeId(),
      kind,
      label,
      config: config ?? {},
      position: { x: 0, y: 0 },
    };
    this._nodes.push(node);
    return new NodeBuilder(node);
  }

  addEdge(
    source: string,
    target: string,
    kind: EdgeKind = 'data',
    condition?: string,
  ): WorkflowBuilder {
    const edge: WorkflowEdge = {
      id: nextEdgeId(),
      source,
      target,
      kind,
      condition,
    };
    this._edges.push(edge);
    return this;
  }

  inputSchema(schema: z.ZodType): WorkflowBuilder {
    this._inputSchema = zodToJson(schema);
    return this;
  }

  outputSchema(schema: z.ZodType): WorkflowBuilder {
    this._outputSchema = zodToJson(schema);
    return this;
  }

  validate(): { valid: boolean; errors: string[] } {
    if (this._nodes.length === 0) {
      return { valid: false, errors: ['Workflow must have at least one node'] };
    }

    return validateDAG(this._nodes, this._edges);
  }

  build(): WorkflowDefinition {
    const validation = this.validate();
    if (!validation.valid) {
      throw new Error(`Cannot build invalid workflow: ${validation.errors.join('; ')}`);
    }

    return {
      id: this._id,
      name: this._name,
      description: this._description,
      version: this._version,
      trigger: this._trigger,
      nodes: [...this._nodes],
      edges: [...this._edges],
      inputSchema: this._inputSchema,
      outputSchema: this._outputSchema,
    };
  }
}

function zodToJson(schema: z.ZodType): Record<string, unknown> {
  const def = schema._def;
  const json: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(def)) {
    json[key] = value;
  }
  return json;
}

export function createWorkflow(id: string, name: string): WorkflowBuilder {
  return new WorkflowBuilder(id, name);
}
