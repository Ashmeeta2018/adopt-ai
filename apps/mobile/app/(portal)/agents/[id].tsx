import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme, withOpacity } from '@/lib/theme';
import { ORG } from '@/lib/persona';

interface FeedLine {
  id: string;
  ts: string;
  status: 'ok' | 'warn' | 'error';
  message: string;
}

// Placeholder messages rotated by the mock feed generator.
// TODO: Replace with tRPC subscription once WebSocket link + auth are wired.
const MOCK_MESSAGES = [
  { status: 'ok' as const, message: 'Routed inbound message → TMS dispatcher' },
  { status: 'ok' as const, message: 'Extracted shipment data from carrier email' },
  { status: 'ok' as const, message: 'Classified intent — action required' },
  { status: 'warn' as const, message: 'Confidence below threshold — escalated' },
  { status: 'ok' as const, message: 'Invoice matched to PO-4821' },
  { status: 'ok' as const, message: 'Support ticket routed to Tier 2' },
  { status: 'error' as const, message: 'TMS adapter timeout — retrying' },
  { status: 'ok' as const, message: 'Carrier response parsed successfully' },
];

export default function AgentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [feed, setFeed] = useState<FeedLine[]>([]);
  const seqRef = useRef(0);

  useEffect(() => {
    const tick = setInterval(() => {
      const msg = MOCK_MESSAGES[seqRef.current % MOCK_MESSAGES.length]!;
      seqRef.current++;
      const line: FeedLine = {
        id: seqRef.current.toString(),
        ts: new Date().toLocaleTimeString(),
        status: msg.status,
        message: msg.message,
      };
      setFeed((f) => [line, ...f].slice(0, 16));
    }, 1800);
    return () => clearInterval(tick);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.void }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.eyebrow}>YOUR AGENTS</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{id ?? 'intake-agent-v4'}</Text>
            <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
          </View>
          <Text style={styles.sub}>{`${ORG.name} · Inbound coordination`}</Text>

          <View style={styles.metricsGrid}>
            <Stat label="24h tasks" value="14,235" />
            <Stat label="Success" value="99.43%" />
            <Stat label="p95 latency" value="412ms" />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartLabel}>THROUGHPUT · 24H</Text>
          </View>

          <Text style={styles.feedHeader}>SIMULATED · LIVE PREVIEW</Text>
          {feed.map((line, i) => (
            <View key={line.id} style={[styles.feedRow, { opacity: 1 - i * 0.05 }]}>
              <Text style={styles.feedTs}>{line.ts}</Text>
              <Text
                style={[
                  styles.feedStatus,
                  { color: line.status === 'ok' ? theme.colors.success : line.status === 'error' ? theme.colors.error : theme.colors.warning },
                ]}
              >
                {line.status === 'ok' ? '✓' : line.status === 'error' ? '✗' : '⚙'}
              </Text>
              <Text style={styles.feedMessage} numberOfLines={1}>
                {line.message}
              </Text>
            </View>
          ))}
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
  sub: { marginTop: 4, fontFamily: 'Inter', fontSize: 13, color: withOpacity(theme.colors.cream, 0.55) },
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
  feedHeader: {
    marginTop: 24,
    marginBottom: 8,
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 2.2,
    color: theme.colors.accent,
  },
  feedRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.hairlines.dark,
  },
  feedTs: { fontFamily: 'IBMPlexMono', fontSize: 11, color: withOpacity(theme.colors.cream, 0.45) },
  feedStatus: { fontSize: 12 },
  feedMessage: {
    flex: 1,
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    color: withOpacity(theme.colors.cream, 0.75),
  },
});
