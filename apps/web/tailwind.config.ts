import { adoptAiPreset } from '@adopt-ai/tokens/tailwind-preset';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [adoptAiPreset as Config],
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
    '../../packages/ui-web/src/**/*.{ts,tsx}',
  ],
  plugins: [typography],
};

export default config;
