export enum Language {
  JavaScript = 'javascript',
  TypeScript = 'typescript',
  Python = 'python',
  SQL = 'sql',
}

export interface ResourceLimits {
  maxExecutionMs: number;
  maxMemoryMb: number;
  maxOutputBytes: number;
  allowNetwork: boolean;
  allowFs: boolean;
}

export const DEFAULT_RESOURCE_LIMITS: ResourceLimits = {
  maxExecutionMs: 30_000,
  maxMemoryMb: 128,
  maxOutputBytes: 1_048_576,
  allowNetwork: false,
  allowFs: false,
};

export interface ExecutionContext {
  env: Record<string, string>;
  timeout: number;
  workingDir: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  output: unknown;
  error: string | null;
  durationMs: number;
  memoryUsedMb: number;
  timedOut: boolean;
}

export interface CodeBlock {
  language: Language;
  code: string;
  inputs: Record<string, unknown>;
}

export interface ValidationRule {
  pattern: RegExp;
  message: string;
  level: 'error' | 'warn';
}
