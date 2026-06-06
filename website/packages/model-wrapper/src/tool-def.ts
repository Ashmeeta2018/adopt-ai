import { z } from 'zod';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export function tool<T extends z.ZodType>(
  name: string,
  description: string,
  parameters: T,
): ToolDefinition {
  return {
    name,
    description,
    parameters: zodToJsonSchema(parameters),
  };
}

export function toolkit(tools: ToolDefinition[]): {
  tools: ToolDefinition[];
  lookup(name: string): ToolDefinition | undefined;
} {
  const seen = new Set<string>();
  for (const t of tools) {
    if (seen.has(t.name)) {
      throw new Error(`Duplicate tool name: "${t.name}"`);
    }
    seen.add(t.name);
  }

  const map = new Map(tools.map((t) => [t.name, t]));

  return {
    tools: [...tools],
    lookup(name: string): ToolDefinition | undefined {
      return map.get(name);
    },
  };
}

export type ToolExecutor = Map<
  string,
  (args: Record<string, unknown>) => Promise<unknown>
>;

interface ZodDef {
  typeName: string;
  shape?: () => Record<string, z.ZodType>;
  type?: z.ZodType;
  innerType?: z.ZodType;
  values?: string[];
  defaultValue?: unknown;
  options?: z.ZodType[];
  valueType?: z.ZodType;
  value?: unknown;
}

function getDef(schema: z.ZodType): ZodDef {
  return (schema as unknown as { _def: ZodDef })._def;
}

function zodToJsonSchema(schema: z.ZodType): Record<string, unknown> {
  const def = getDef(schema);
  const typeName = def.typeName;

  if (typeName === 'ZodObject') {
    const shape = def.shape?.() ?? {};
    const properties: Record<string, Record<string, unknown>> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      properties[key] = zodToJsonSchema(value);
      if (!value.isOptional()) {
        required.push(key);
      }
    }

    const result: Record<string, unknown> = {
      type: 'object',
      properties,
    };
    if (required.length > 0) {
      result.required = required;
    }
    return result;
  }

  if (typeName === 'ZodString') {
    return { type: 'string' };
  }

  if (typeName === 'ZodNumber') {
    return { type: 'number' };
  }

  if (typeName === 'ZodBoolean') {
    return { type: 'boolean' };
  }

  if (typeName === 'ZodArray') {
    return {
      type: 'array',
      items: def.type ? zodToJsonSchema(def.type) : {},
    };
  }

  if (typeName === 'ZodEnum') {
    return {
      type: 'string',
      enum: def.values ?? [],
    };
  }

  if (typeName === 'ZodOptional') {
    return def.innerType ? zodToJsonSchema(def.innerType) : {};
  }

  if (typeName === 'ZodDefault') {
    const inner = def.innerType ? zodToJsonSchema(def.innerType) : {};
    if (def.defaultValue !== undefined) {
      inner.default = typeof def.defaultValue === 'function' ? def.defaultValue() : def.defaultValue;
    }
    return inner;
  }

  if (typeName === 'ZodNullable') {
    const inner = def.innerType ? zodToJsonSchema(def.innerType) : {};
    return { ...inner, nullable: true };
  }

  if (typeName === 'ZodUnion') {
    const options = def.options ?? [];
    return {
      oneOf: options.map(zodToJsonSchema),
    };
  }

  if (typeName === 'ZodLiteral') {
    const literalValue = def.value;
    return {
      type: typeof literalValue === 'string' ? 'string' : typeof literalValue === 'number' ? 'number' : 'boolean',
      const: literalValue,
    };
  }

  if (typeName === 'ZodRecord') {
    return {
      type: 'object',
      additionalProperties: def.valueType ? zodToJsonSchema(def.valueType) : {},
    };
  }

  return {};
}
