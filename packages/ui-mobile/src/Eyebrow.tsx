import { StyleSheet, Text, type TextStyle } from 'react-native';
import type { ReactNode } from 'react';

import { nativeTokens } from '@adopt-ai/tokens/native';

type Tone = 'default' | 'accent' | 'muted';
type EyebrowSize = 'sm' | 'md';

interface EyebrowProps {
  children: ReactNode;
  tone?: Tone;
  size?: EyebrowSize;
}

const toneColors: Record<Tone, string> = {
  default: nativeTokens.colors.accent,
  accent: nativeTokens.colors.glow,
  muted: nativeTokens.colors.ink,
};

const sizeMap: Record<EyebrowSize, number> = {
  sm: 10,
  md: 11,
};

export function Eyebrow({ children, tone = 'default', size = 'md' }: EyebrowProps) {
  return (
    <Text
      style={[
        styles.base,
        { color: toneColors[tone], fontSize: sizeMap[size] },
      ]}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: nativeTokens.fonts.mono,
    fontWeight: '500',
    letterSpacing: 0.22,
    textTransform: 'uppercase',
  } satisfies TextStyle,
});
