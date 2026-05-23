import { StyleSheet, View } from 'react-native';

import { nativeTokens } from '@adopt-ai/tokens/native';

type Status = 'running' | 'queued' | 'error' | 'paused';

interface StatusDotProps {
  status: Status;
  size?: number;
}

const statusColors: Record<Status, string> = {
  running: nativeTokens.colors.success,
  queued: nativeTokens.colors.gold,
  error: nativeTokens.colors.accent,
  paused: 'rgba(61, 26, 15, 0.3)',
};

export function StatusDot({ status, size = 8 }: StatusDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: statusColors[status],
        },
      ]}
      accessibilityLabel={`Status: ${status}`}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    // Dimensions set inline via style prop
  },
});
