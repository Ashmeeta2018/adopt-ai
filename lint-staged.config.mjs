/**
 * lint-staged configuration.
 *
 * Why a function (and not per-file `eslint --fix`): with type-aware linting
 * (`projectService: true`), typescript-eslint builds a TS program from the
 * files it is given. In the React Native packages (apps/mobile, packages/
 * ui-mobile) linting a *subset* of files makes react-native's types resolve
 * to its Flow-typed `.js` source instead of its `.d.ts`, which the TS parser
 * chokes on. Linting the whole configured set resolves types correctly.
 * lint-staged always passes a subset, so we run each touched workspace
 * package's own `lint` script (the same command CI runs) instead of feeding
 * individual files to eslint. Prettier still formats the staged files.
 */
import path from 'node:path';

const CODE = /\.(ts|tsx|js|jsx)$/;
const PRETTIER = /\.(ts|tsx|js|jsx|json|md|yml|yaml)$/;

function packageDirOf(file) {
  const rel = path.relative(process.cwd(), file).split(path.sep).join('/');
  const match = rel.match(/^(apps\/[^/]+|packages\/[^/]+)\//);
  return match ? match[1] : null;
}

export default function lintStaged(stagedFiles) {
  const commands = [];

  const prettierFiles = stagedFiles.filter((f) => PRETTIER.test(f));
  if (prettierFiles.length > 0) {
    const list = prettierFiles.map((f) => JSON.stringify(f)).join(' ');
    commands.push(`prettier --write ${list}`);
  }

  // Full lint per touched workspace package — reliable with RN + type-aware rules.
  const packages = new Set();
  for (const file of stagedFiles) {
    if (!CODE.test(file)) continue;
    const dir = packageDirOf(file);
    if (dir) packages.add(dir);
  }
  for (const dir of packages) {
    commands.push(`pnpm --filter ./${dir} run lint`);
  }

  return commands;
}
