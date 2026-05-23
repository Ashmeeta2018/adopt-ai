import type { CodeBlock, Language, ResourceLimits, ValidationRule } from './types.js';
import { DEFAULT_RESOURCE_LIMITS } from './types.js';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const BLOCKLIST_ALWAYS: ValidationRule[] = [
  { pattern: /\beval\s*\(/, message: 'eval() is not allowed', level: 'error' },
  { pattern: /\bFunction\s*\(/, message: 'Function() constructor is not allowed', level: 'error' },
  {
    pattern: /require\s*\(\s*['"]child_process['"]\)/,
    message: 'child_process is not allowed',
    level: 'error',
  },
  { pattern: /\bprocess\.exit\s*\(/, message: 'process.exit() is not allowed', level: 'error' },
  {
    pattern: /\bglobalThis\s*\[/,
    message: 'globalThis mutation is not allowed',
    level: 'error',
  },
  {
    pattern: /\bglobalThis\.\w+\s*=/,
    message: 'globalThis mutation is not allowed',
    level: 'error',
  },
];

const BLOCKLIST_FS: ValidationRule[] = [
  {
    pattern: /require\s*\(\s*['"]fs['"]\)/,
    message: 'Filesystem access requires allowFs',
    level: 'error',
  },
  {
    pattern: /require\s*\(\s*['"]fs\/promises['"]\)/,
    message: 'Filesystem access requires allowFs',
    level: 'error',
  },
  {
    pattern: /\bimport\s+.*['"]fs['"]/,
    message: 'Filesystem access requires allowFs',
    level: 'error',
  },
  {
    pattern: /\bimport\s+.*['"]fs\/promises['"]/,
    message: 'Filesystem access requires allowFs',
    level: 'error',
  },
  {
    pattern: /\bimport\s*\(\s*['"]fs['"]\)/,
    message: 'Filesystem access requires allowFs',
    level: 'error',
  },
];

const BLOCKLIST_NETWORK: ValidationRule[] = [
  {
    pattern: /require\s*\(\s*['"]http['"]\)/,
    message: 'Network access requires allowNetwork',
    level: 'error',
  },
  {
    pattern: /require\s*\(\s*['"]https['"]\)/,
    message: 'Network access requires allowNetwork',
    level: 'error',
  },
  {
    pattern: /require\s*\(\s*['"]net['"]\)/,
    message: 'Network access requires allowNetwork',
    level: 'error',
  },
  {
    pattern: /require\s*\(\s*['"]fetch['"]\)/,
    message: 'Network access requires allowNetwork',
    level: 'error',
  },
  {
    pattern: /\bimport\s+.*['"]http['"]/,
    message: 'Network access requires allowNetwork',
    level: 'error',
  },
  {
    pattern: /\bimport\s+.*['"]https['"]/,
    message: 'Network access requires allowNetwork',
    level: 'error',
  },
  {
    pattern: /\bimport\s+.*['"]net['"]/,
    message: 'Network access requires allowNetwork',
    level: 'error',
  },
];

export class CodeValidator {
  private readonly rules: ValidationRule[] = [];

  constructor(customRules?: ValidationRule[]) {
    this.rules.push(...BLOCKLIST_ALWAYS);
    if (customRules) {
      this.rules.push(...customRules);
    }
  }

  validate(
    code: string,
    language: Language,
    limits: ResourceLimits = DEFAULT_RESOURCE_LIMITS,
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (language === 'python' || language === 'sql') {
      errors.push(`Language "${language}" is not yet supported for sandboxed execution`);
      return { valid: false, errors, warnings };
    }

    const activeRules = this.buildActiveRules(limits);

    for (const rule of activeRules) {
      if (rule.pattern.test(code)) {
        if (rule.level === 'error') {
          errors.push(rule.message);
        } else {
          warnings.push(rule.message);
        }
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  private buildActiveRules(limits: ResourceLimits): ValidationRule[] {
    const active = [...this.rules];

    if (!limits.allowFs) {
      active.push(...BLOCKLIST_FS);
    }

    if (!limits.allowNetwork) {
      active.push(...BLOCKLIST_NETWORK);
    }

    return active;
  }
}

export function validateBlock(
  block: CodeBlock,
  limits: ResourceLimits = DEFAULT_RESOURCE_LIMITS,
): ValidationResult {
  const validator = new CodeValidator();
  return validator.validate(block.code, block.language, limits);
}
