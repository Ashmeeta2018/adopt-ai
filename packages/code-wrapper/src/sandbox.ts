import type { CodeBlock, ExecutionContext, ExecutionResult, ResourceLimits } from './types.js';
import { DEFAULT_RESOURCE_LIMITS, Language } from './types.js';

interface InterceptedConsole {
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
}

interface SandboxResult {
  output: unknown;
  stdout: string;
  error: string | null;
}

export class Sandbox {
  private readonly limits: ResourceLimits;

  constructor(limits: Partial<ResourceLimits> = {}) {
    this.limits = { ...DEFAULT_RESOURCE_LIMITS, ...limits };
  }

  async execute(
    block: CodeBlock,
    context?: Partial<ExecutionContext>,
  ): Promise<ExecutionResult> {
    const startTime = performance.now();
    const memoryBefore = process.memoryUsage();

    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    const interceptedConsole: InterceptedConsole = {
      log: (...args: unknown[]) => stdoutChunks.push(args.map(String).join(' ') + '\n'),
      warn: (...args: unknown[]) => stdoutChunks.push('[warn] ' + args.map(String).join(' ') + '\n'),
      error: (...args: unknown[]) => stderrChunks.push(args.map(String).join(' ') + '\n'),
      info: (...args: unknown[]) => stdoutChunks.push('[info] ' + args.map(String).join(' ') + '\n'),
    };

    const timeoutMs = context?.timeout ?? this.limits.maxExecutionMs;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      if (block.language !== Language.JavaScript && block.language !== Language.TypeScript) {
        return {
          stdout: '',
          stderr: `Language "${block.language}" is not supported`,
          exitCode: 1,
          output: undefined,
          error: `Unsupported language: ${block.language}`,
          durationMs: performance.now() - startTime,
          memoryUsedMb: 0,
          timedOut: false,
        };
      }

      const inputKeys = Object.keys(block.inputs);
      const inputValues = Object.values(block.inputs);

      const code = block.language === Language.TypeScript
        ? stripTypeAnnotations(block.code)
        : block.code;

      const result = await this.runInSandbox(
        code,
        inputKeys,
        inputValues,
        interceptedConsole,
        abortController.signal,
      );

      const memoryAfter = process.memoryUsage();
      const memoryUsedMb = (memoryAfter.heapUsed - memoryBefore.heapUsed) / (1024 * 1024);

      const combinedStderr = stderrChunks.join('') + (result.error ? `[execution] ${result.error}\n` : '');

      const outputSize = Buffer.byteLength(stdoutChunks.join('') + combinedStderr, 'utf-8');
      if (outputSize > this.limits.maxOutputBytes) {
        return {
          stdout: stdoutChunks.join('').slice(0, this.limits.maxOutputBytes),
          stderr: 'Output exceeded maximum allowed size',
          exitCode: 1,
          output: undefined,
          error: `Output size (${outputSize} bytes) exceeded limit (${this.limits.maxOutputBytes} bytes)`,
          durationMs: performance.now() - startTime,
          memoryUsedMb: Math.max(0, memoryUsedMb),
          timedOut: false,
        };
      }

      return {
        stdout: stdoutChunks.join(''),
        stderr: combinedStderr,
        exitCode: result.error ? 1 : 0,
        output: result.output,
        error: result.error,
        durationMs: performance.now() - startTime,
        memoryUsedMb: Math.max(0, memoryUsedMb),
        timedOut: false,
      };
    } catch (err: unknown) {
      const timedOut = abortController.signal.aborted;
      return {
        stdout: stdoutChunks.join(''),
        stderr: stderrChunks.join(''),
        exitCode: 1,
        output: undefined,
        error: err instanceof Error ? err.message : String(err),
        durationMs: performance.now() - startTime,
        memoryUsedMb: 0,
        timedOut,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async executeBatch(blocks: CodeBlock[]): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];
    for (const block of blocks) {
      const result = await this.execute(block);
      results.push(result);
    }
    return results;
  }

  prepareContext(inputs: Record<string, unknown>): string[] {
    return Object.keys(inputs);
  }

  private async runInSandbox(
    code: string,
    inputKeys: string[],
    inputValues: unknown[],
    consoleObj: InterceptedConsole,
    abortSignal: AbortSignal,
  ): Promise<SandboxResult> {
    const scopeKeys = [...inputKeys, '__console__'];
    const scopeValues: unknown[] = [...inputValues, consoleObj];

    const wrappedBody = `
      "use strict";
      const console = __console__;
      try {
        const __result = await (async () => {
          ${code}
        })();
        return { output: __result, error: null };
      } catch (__e) {
        return { output: undefined, error: __e instanceof Error ? __e.message : String(__e) };
      }
    `;

    const fn = new Function(...scopeKeys, wrappedBody);

    if (abortSignal.aborted) {
      return { output: undefined, stdout: '', error: 'Execution aborted before start' };
    }

    const result: SandboxResult = await fn(...scopeValues);
    return {
      output: result.output,
      stdout: '',
      error: result.error ?? null,
    };
  }
}

function stripTypeAnnotations(code: string): string {
  return code
    .replace(/:\s*(string|number|boolean|void|unknown|never|object|undefined|null|bigint|symbol)(\[\])?(\s*[=,);])/g, '$3')
    .replace(/<[^>]+>/g, '')
    .replace(/\bas\s+(string|number|boolean|unknown)\b/g, '')
    .replace(/\?\s*:/g, ':');
}
