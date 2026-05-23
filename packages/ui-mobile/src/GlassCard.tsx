import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { nativeTokens } from '@adopt-ai/tokens/native';

interface GlassCardProps {
  children: ReactNode;
  dark?: boolean;
  padding?: number;
}

export function GlassCard({
  children,
  dark = false,
  padding = 28,
}: GlassCardProps) {
  const backgroundColor: ViewStyle['backgroundColor'] = dark
    ? 'rgba(26, 15, 8, 0.7)'
    : 'rgba(255, 255, 255, 0.82)';

  const shadow = dark
    ? nativeTokens.shadow.cardDark
    : nativeTokens.shadow.cardDark;

  const borderColor = dark
    ? nativeTokens.hairlines.dark
    : nativeTokens.hairlines.light;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          padding,
          borderColor,
          ...(Platform.OS === 'ios' ? shadow : { elevation: shadow.elevation }),
        } satisfies ViewStyle,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: nativeTokens.radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
