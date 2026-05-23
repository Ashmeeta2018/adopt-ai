import { describe, expect, it } from 'vitest';
import { CodeValidator, validateBlock } from './validator';
import { Language, DEFAULT_RESOURCE_LIMITS } from './types';
import type { CodeBlock } from './types';

describe('CodeValidator', () => {
  const validator = new CodeValidator();

  it('accepts safe JavaScript code', () => {
    const result = validator.validate('const x = 1 + 2; return x;', Language.JavaScript);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts safe TypeScript code', () => {
    const result = validator.validate('const x: number = 1; return x;', Language.TypeScript);
    expect(result.valid).toBe(true);
  });

  it('rejects eval()', () => {
    const result = validator.validate('eval("console.log(1)")', Language.JavaScript);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('eval() is not allowed');
  });

  it('rejects Function() constructor', () => {
    const result = validator.validate('new Function("return 1")()', Language.JavaScript);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Function() constructor is not allowed');
  });

  it('rejects child_process', () => {
    const result = validator.validate(
      'require("child_process").exec("ls")',
      Language.JavaScript,
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('child_process is not allowed');
  });

  it('rejects process.exit()', () => {
    const result = validator.validate('process.exit(1)', Language.JavaScript);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('process.exit() is not allowed');
  });

  it('rejects globalThis mutation via bracket access', () => {
    const result = validator.validate('globalThis["x"] = 1', Language.JavaScript);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('globalThis mutation is not allowed');
  });

  it('rejects globalThis mutation via property assignment', () => {
    const result = validator.validate('globalThis.foo = 1', Language.JavaScript);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('globalThis mutation is not allowed');
  });

  it('rejects unsupported languages', () => {
    const result = validator.validate('print("hello")', Language.Python);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('not yet supported');
  });

  it('rejects filesystem access when allowFs is false', () => {
    const result = validator.validate('require("fs")', Language.JavaScript);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Filesystem access requires allowFs');
  });

  it('allows filesystem access when allowFs is true', () => {
    const limits = { ...DEFAULT_RESOURCE_LIMITS, allowFs: true };
    const result = validator.validate('require("fs")', Language.JavaScript, limits);
    expect(result.valid).toBe(true);
  });

  it('rejects network access when allowNetwork is false', () => {
    const result = validator.validate('require("http")', Language.JavaScript);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Network access requires allowNetwork');
  });

  it('allows network access when allowNetwork is true', () => {
    const limits = { ...DEFAULT_RESOURCE_LIMITS, allowNetwork: true, allowFs: false };
    const result = validator.validate('require("http")', Language.JavaScript, limits);
    expect(result.valid).toBe(true);
  });

  it('supports custom rules', () => {
    const v = new CodeValidator([
      { pattern: /\bDANGEROUS\b/, message: 'No DANGEROUS allowed', level: 'error' },
    ]);
    const result = v.validate('const x = DANGEROUS;', Language.JavaScript);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('No DANGEROUS allowed');
  });

  it('adds warnings for warn-level rules', () => {
    const v = new CodeValidator([
      { pattern: /\bconsole\.log\b/, message: 'Consider removing console.log', level: 'warn' },
    ]);
    const result = v.validate('console.log("debug")', Language.JavaScript);
    expect(result.valid).toBe(true);
    expect(result.warnings).toContain('Consider removing console.log');
  });

  it('allows adding rules via addRule()', () => {
    const v = new CodeValidator();
    v.addRule({ pattern: /\bFORBIDDEN\b/, message: 'Forbidden', level: 'error' });
    const result = v.validate('const x = FORBIDDEN;', Language.JavaScript);
    expect(result.valid).toBe(false);
  });
});

describe('validateBlock', () => {
  it('validates a code block', () => {
    const block: CodeBlock = {
      language: Language.JavaScript,
      code: 'return inputs.x + 1;',
      inputs: { x: 5 },
    };
    const result = validateBlock(block);
    expect(result.valid).toBe(true);
  });
});
