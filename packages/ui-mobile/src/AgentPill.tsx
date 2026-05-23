import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { nativeTokens } from '@adopt-ai/tokens/native';

type Status = 'running' | 'queued' | 'error';

interface AgentPillProps {
  label: string;
  status?: Status;
  count?: number;
  dark?: boolean;
}

const statusColors: Record<Status, string> = {
  running: nativeTokens.colors.success,
  queued: nativeTokens.colors.gold,
  error: nativeTokens.colors.accent,
};

export function AgentPill({
  label,
  status = 'running',
  count,
  dark = false,
}: AgentPillProps) {
  const pulseAnim = useRef(new Animated.Value(1));
  const color = statusColors[status];

  useEffect(() => {
    if (status !== 'running') return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim.current, {
          toValue: 0.4,
          duration: nativeTokens.motion.agentPulse.duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim.current, {
          toValue: 1,
          duration: nativeTokens.motion.agentPulse.duration / 2,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => { animation.stop(); };
  }, [status]);

  return (
    <View
      style={[
        styles.container,
        dark ? styles.containerDark : styles.containerLight,
      ]}
    >
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: color,
            opacity: status === 'running' ? pulseAnim.current : 1,
          },
        ]}
      />
      <Text style={[styles.label, dark && styles.labelDark]}>{label}</Text>
      {count !== undefined && (
        <Text style={[styles.count, dark && styles.countDark]}>
          {' · '}
          {count}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: nativeTokens.radii.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  containerLight: {
    backgroundColor: 'rgba(61,26,15,0.04)',
    borderColor: nativeTokens.hairlines.light,
  },
  containerDark: {
    backgroundColor: 'rgba(248,244,238,0.06)',
    borderColor: nativeTokens.hairlines.dark,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 9999,
  },
  label: {
    fontFamily: nativeTokens.fonts.mono,
    fontSize: 11.5,
    letterSpacing: 0.06,
    color: nativeTokens.colors.ink,
  },
  labelDark: {
    color: nativeTokens.colors.cream,
  },
  count: {
    fontFamily: nativeTokens.fonts.mono,
    fontSize: 11.5,
    letterSpacing: 0.06,
    color: nativeTokens.colors.ink,
    opacity: 0.5,
  },
  countDark: {
    color: nativeTokens.colors.cream,
  },
});
