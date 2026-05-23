export { Language, DEFAULT_RESOURCE_LIMITS } from './types.js';
export type {
  ResourceLimits,
  ExecutionContext,
  ExecutionResult,
  CodeBlock,
  ValidationRule,
} from './types.js';

export { CodeValidator } from './validator.js';
export { Sandbox } from './sandbox.js';
export {
  extractJsonFromText,
  transformData,
  validateOutput,
  aggregateMetrics,
} from './templates.js';

import type { CodeBlock, Language, ResourceLimits, ValidationRule } from './types.js';
import { DEFAULT_RESOURCE_LIMITS } from './types.js';
import { CodeValidator } from './validator.js';
import { Sandbox } from './sandbox.js';

export class CodeValidationError extends Error {
  public readonly errors: readonly string[];

  constructor(errors: readonly string[]) {
    super(`Code validation failed: ${errors.join('; ')}`);
    this.name = 'CodeValidationError';
    this.errors = errors;
  }
}

export class ExecutionTimeoutError extends Error {
  public readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`Execution timed out after ${timeoutMs}ms`);
    this.name = 'ExecutionTimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

export class ResourceLimitError extends Error {
  public readonly limit: string;
  public readonly actual: unknown;

  constructor(limit: string, actual: unknown) {
    super(`Resource limit exceeded: ${limit} (actual: ${String(actual)})`);
    this.name = 'ResourceLimitError';
    this.limit = limit;
    this.actual = actual;
  }
}

export interface CodeRunner {
  run(block: CodeBlock): Promise<import('./types.js').ExecutionResult>;
  runBatch(blocks: CodeBlock[]): Promise<import('./types.js').ExecutionResult[]>;
  validate(code: string, language: Language): { valid: boolean; errors: string[]; warnings: string[] };
  addValidationRule(rule: ValidationRule): void;
}

export function createCodeRunner(
  config?: {
    limits?: Partial<ResourceLimits>;
    customRules?: ValidationRule[];
  },
): CodeRunner {
  const limits: ResourceLimits = { ...DEFAULT_RESOURCE_LIMITS, ...config?.limits };
  const validator = new CodeValidator(config?.customRules);
  const sandbox = new Sandbox(limits);

  return {
    async run(block: CodeBlock) {
      const validation = validator.validate(block.code, block.language, limits);
      if (!validation.valid) {
        throw new CodeValidationError(validation.errors);
      }

      const result = await sandbox.execute(block);

      if (result.timedOut) {
        throw new ExecutionTimeoutError(limits.maxExecutionMs);
      }

      if (result.memoryUsedMb > limits.maxMemoryMb) {
        throw new ResourceLimitError(`maxMemoryMb (${limits.maxMemoryMb})`, result.memoryUsedMb);
      }

      return result;
    },

    async runBatch(blocks: CodeBlock[]) {
      const results: import('./types.js').ExecutionResult[] = [];
      for (const block of blocks) {
        const validation = validator.validate(block.code, block.language, limits);
        if (!validation.valid) {
          throw new CodeValidationError(validation.errors);
        }
        const result = await sandbox.execute(block);
        if (result.timedOut) {
          throw new ExecutionTimeoutError(limits.maxExecutionMs);
        }
        results.push(result);
      }
      return results;
    },

    validate(code: string, language: Language) {
      return validator.validate(code, language, limits);
    },

    addValidationRule(rule: ValidationRule) {
      validator.addRule(rule);
    },
  };
}
