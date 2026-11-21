import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme, withOpacity } from '@/lib/theme';
import { trpc } from '@/lib/trpc';

const STATUS_DOT: Record<string, string> = {
  running: theme.colors.success,
  queued: theme.colors.warning,
  error: theme.colors.error,
  paused: withOpacity(theme.colors.ink, 0.3),
};

export default function AgentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = trpc.portal.getAgent.useQuery({ agentId: id });

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.void,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color={theme.colors.cream} />
        <Text
          style={{ color: theme.colors.cream, marginTop: 12, fontFamily: 'Inter', fontSize: 14 }}
        >
          Loading agent...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.void }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.eyebrow}>YOUR AGENTS</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{data?.agent.name ?? id}</Text>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    STATUS_DOT[data?.agent.status ?? 'running'] ?? theme.colors.success,
                },
              ]}
            />
          </View>
          <Text style={styles.sub}>{data?.agent.description ?? ''}</Text>

          <View style={styles.metricsGrid}>
            <Stat label="24h tasks" value={data ? data.agent.tasks24h.toLocaleString() : '—'} />
            <Stat
              label="Success"
              value={data ? `${(data.agent.successRate * 100).toFixed(2)}%` : '—'}
            />
            <Stat label="p95 latency" value={data ? `${data.metrics.p95LatencyMs}ms` : '—'} />
          </View>

          <View style={styles.chartCard}>
            <Text
              style={styles.chartLabel}
            >{`THROUGHPUT · ${data?.throughput.length ?? 0} POINTS`}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 18, paddingBottom: 120 },
  eyebrow: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 2.2,
    color: withOpacity(theme.colors.cream, 0.55),
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  title: { fontFamily: 'IBMPlexMono', fontSize: 22, color: theme.colors.cream },
  dot: { width: 8, height: 8, borderRadius: 99 },
  sub: {
    marginTop: 4,
    fontFamily: 'Inter',
    fontSize: 13,
    color: withOpacity(theme.colors.cream, 0.55),
  },
  metricsGrid: { flexDirection: 'row', gap: 10, marginTop: 22 },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: withOpacity(theme.colors.cream, 0.05),
    borderWidth: 1,
    borderColor: theme.hairlines.dark,
  },
  statValue: { fontFamily: 'Sora', fontSize: 20, color: theme.colors.cream, fontWeight: '500' },
  statLabel: {
    marginTop: 6,
    fontFamily: 'IBMPlexMono',
    fontSize: 10,
    letterSpacing: 1.8,
    color: withOpacity(theme.colors.cream, 0.55),
  },
  chartCard: {
    marginTop: 18,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.hairlines.dark,
    padding: 12,
  },
  chartLabel: {
    fontFamily: 'IBMPlexMono',
    fontSize: 10,
    letterSpacing: 1.8,
    color: withOpacity(theme.colors.cream, 0.55),
  },
});
