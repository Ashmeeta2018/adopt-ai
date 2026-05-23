import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { theme, withOpacity } from '@/lib/theme';

interface Props {
  label: string;
  status?: 'running' | 'queue' | 'error';
  dark?: boolean;
}

const dotColor: Record<NonNullable<Props['status']>, string> = {
  running: theme.colors.success,
  queue: theme.colors.gold,
  error: theme.colors.accent,
};

export function AgentPillNative({ label, status = 'running', dark = false }: Props) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(0.5, { duration: 700 }), -1, true);
  }, [pulse]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <View style={[styles.pill, dark ? styles.pillDark : styles.pillLight]}>
      <Animated.View
        style={[
          styles.dot,
          { backgroundColor: dotColor[status], shadowColor: dotColor[status] },
          dotStyle,
        ]}
      />
      <Text style={[styles.label, { color: dark ? theme.colors.cream : theme.colors.ink }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillLight: {
    backgroundColor: withOpacity(theme.colors.ink, 0.04),
    borderColor: theme.hairlines.light,
  },
  pillDark: {
    backgroundColor: withOpacity(theme.colors.cream, 0.06),
    borderColor: theme.hairlines.dark,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  label: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11.5,
    letterSpacing: 0.06,
  },
});
