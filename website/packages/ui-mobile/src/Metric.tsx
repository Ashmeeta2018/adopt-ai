import { StyleSheet, Text, View } from 'react-native';

import { nativeTokens } from '@adopt-ai/tokens/native';

interface MetricProps {
  value: string;
  label: string;
  accent?: boolean;
  dark?: boolean;
}

export function Metric({ value, label, accent = false, dark = false }: MetricProps) {
  return (
    <View>
      <Text
        style={[
          styles.value,
          accent && { color: nativeTokens.colors.accent },
          !accent && dark && { color: nativeTokens.colors.cream },
          !accent && !dark && { color: nativeTokens.colors.ink },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.label,
          dark ? { color: 'rgba(248, 244, 238, 0.55)' } : { color: 'rgba(61, 26, 15, 0.55)' },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  value: {
    fontFamily: nativeTokens.fonts.display,
    fontWeight: '600',
    fontSize: 56,
    lineHeight: 56 * 0.92,
    letterSpacing: -0.04,
  },
  label: {
    marginTop: 10,
    fontFamily: nativeTokens.fonts.mono,
    fontSize: nativeTokens.type.eyebrow.size,
    fontWeight: '500',
    letterSpacing: 0.18,
    textTransform: 'uppercase',
  },
});
