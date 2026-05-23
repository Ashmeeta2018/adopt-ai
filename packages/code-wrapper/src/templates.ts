import { Language } from './types.js';
import type { CodeBlock } from './types.js';

interface FieldMapping {
  from: string;
  to: string;
  transform?: 'lowercase' | 'uppercase' | 'trim' | 'number' | 'date';
}

type AggregateOp = 'sum' | 'avg' | 'count' | 'min' | 'max';

interface MetricSpec {
  field: string;
  operation: AggregateOp;
}

export function extractJsonFromText(code?: string): CodeBlock {
  const defaultCode = code ?? `
    const text = typeof input === 'string' ? input : String(input);
    const jsonBlockRegex = /\`\`\`json\\n?([\\s\\S]*?)\\n?\`\`\`/g;
    const matches = [];
    let match;
    while ((match = jsonBlockRegex.exec(text)) !== null) {
      try {
        matches.push(JSON.parse(match[1]));
      } catch {
        matches.push(null);
      }
    }
    if (matches.length === 0) {
      const braceRegex = /\\{[\\s\\S]*\\}/g;
      let braceMatch;
      while ((braceMatch = braceRegex.exec(text)) !== null) {
        try {
          matches.push(JSON.parse(braceMatch[0]));
        } catch {
          const lines = braceMatch[0].split('\\n');
          let accumulated = '';
          for (const line of lines) {
            accumulated += line;
            try {
              const parsed = JSON.parse(accumulated);
              matches.push(parsed);
              break;
            } catch {
              continue;
            }
          }
        }
      }
    }
    return matches.length > 0
      ? (matches.length === 1 ? matches[0] : matches)
      : null;
  `;

  return {
    language: Language.JavaScript,
    code: defaultCode,
    inputs: { input: '' },
  };
}

export function transformData(mapping: FieldMapping[]): CodeBlock {
  const mappingJson = JSON.stringify(mapping);

  const code = `
    const __mapping = ${mappingJson};
    const __source = typeof data === 'object' && data !== null ? data : {};
    const __result = {};
    for (const rule of __mapping) {
      let value = __source[rule.from];
      if (value === undefined) {
        __result[rule.to] = null;
        continue;
      }
      switch (rule.transform) {
        case 'lowercase':
          value = typeof value === 'string' ? value.toLowerCase() : value;
          break;
        case 'uppercase':
          value = typeof value === 'string' ? value.toUpperCase() : value;
          break;
        case 'trim':
          value = typeof value === 'string' ? value.trim() : value;
          break;
        case 'number':
          value = Number(value);
          if (Number.isNaN(value)) value = null;
          break;
        case 'date':
          value = new Date(value).toISOString();
          break;
      }
      __result[rule.to] = value;
    }
    return __result;
  `;

  return {
    language: Language.JavaScript,
    code,
    inputs: { data: {} },
  };
}

export function validateOutput(schemaSource: string): CodeBlock {
  const code = `
    const __schemaSource = ${JSON.stringify(schemaSource)};
    const __schema = new Function("z", "return " + __schemaSource)(z);
    const __result = __schema.safeParse(data);
    return {
      valid: __result.success,
      data: __result.success ? __result.data : null,
      errors: __result.success ? null : __result.error.issues.map(function(i) {
        return { path: i.path.join("."), message: i.message };
      }),
    };
  `;

  return {
    language: Language.JavaScript,
    code,
    inputs: { data: null, z: null },
  };
}

export function aggregateMetrics(metrics: MetricSpec[]): CodeBlock {
  const metricsJson = JSON.stringify(metrics);

  const code = `
    const __specs = ${metricsJson};
    const __items = Array.isArray(records) ? records : [];
    const __result = {};
    for (const spec of __specs) {
      const values = __items
        .map(function(item) { return item[spec.field]; })
        .filter(function(v) { return typeof v === 'number' && !Number.isNaN(v); });
      switch (spec.operation) {
        case 'sum':
          __result[spec.field + '_sum'] = values.reduce(function(a, b) { return a + b; }, 0);
          break;
        case 'avg':
          __result[spec.field + '_avg'] = values.length > 0
            ? values.reduce(function(a, b) { return a + b; }, 0) / values.length
            : 0;
          break;
        case 'count':
          __result[spec.field + '_count'] = values.length;
          break;
        case 'min':
          __result[spec.field + '_min'] = values.length > 0 ? Math.min.apply(null, values) : null;
          break;
        case 'max':
          __result[spec.field + '_max'] = values.length > 0 ? Math.max.apply(null, values) : null;
          break;
      }
    }
    return __result;
  `;

  return {
    language: Language.JavaScript,
    code,
    inputs: { records: [] },
  };
}
