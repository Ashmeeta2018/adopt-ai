import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme, withOpacity } from '@/lib/theme';
import { trpc } from '@/lib/trpc';

export default function WeeklyReportScreen() {
  const { data, isLoading } = trpc.portal.getWeeklyReport.useQuery({});

  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  const trendArrow = (pct: number) => (pct >= 0 ? '↑' : '↓');
  const trendColor = (pct: number) => (pct >= 0 ? theme.colors.accent : theme.colors.amber);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>WEEKLY PERFORMANCE</Text>
        <Text style={styles.h1}>
          {data.range.start} – {data.range.end}
        </Text>

        <View style={styles.bigGrid}>
          <View style={styles.bigCard}>
            <Text style={styles.bigCaption}>HOURS SAVED</Text>
            <Text style={[styles.bigNumber, { color: theme.colors.accent }]}>
              {data.hoursSaved}
            </Text>
            <Text style={[styles.bigTrend, { color: trendColor(data.hoursSavedTrendPct) }]}>
              {trendArrow(data.hoursSavedTrendPct)} {Math.abs(data.hoursSavedTrendPct)}% vs last wk
            </Text>
          </View>
          <View style={styles.bigCard}>
            <Text style={styles.bigCaption}>COST REDUCED</Text>
            <Text style={styles.bigNumber}>${(data.costReducedUsd / 1000).toFixed(1)}k</Text>
            <Text style={[styles.bigTrend, { color: trendColor(data.costReducedTrendPct) }]}>
              {trendArrow(data.costReducedTrendPct)} {Math.abs(data.costReducedTrendPct)}%
            </Text>
          </View>
        </View>

        <Text style={styles.section}>Pipeline breakdown</Text>
        {data.pipelines.map((p) => (
          <View key={p.name} style={styles.pipelineRow}>
            <View style={styles.pipelineHeader}>
              <Text style={styles.pipelineName}>{p.name}</Text>
              <Text style={[styles.pipelineHours, { color: theme.colors[p.accent] }]}>
                {p.hoursSaved}h
              </Text>
            </View>
            <Text style={styles.pipelineMeta}>
              {p.tasks.toLocaleString()} tasks · {(p.successRate * 100).toFixed(1)}% success
            </Text>
            <View style={styles.barTrack}>
              <LinearGradient
                colors={[theme.colors[p.accent], theme.colors.glow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.barFill, { width: `${Math.min(95, p.hoursSaved / 3)}%` }]}
              />
            </View>
          </View>
        ))}

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.buttonDark]}
            accessibilityLabel="Export weekly report as PDF"
            accessibilityRole="button"
          >
            <Text style={styles.buttonDarkText}>Export PDF</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonGhost]}
            accessibilityLabel="Share weekly report"
            accessibilityRole="button"
          >
            <Text style={styles.buttonGhostText}>Share</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.cream },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 18, paddingBottom: 120 },
  eyebrow: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 2.2,
    color: theme.colors.accent,
  },
  h1: { marginTop: 6, fontFamily: 'Sora', fontSize: 26, color: theme.colors.ink },
  sub: {
    marginTop: 2,
    fontFamily: 'Inter',
    fontSize: 13,
    color: withOpacity(theme.colors.ink, 0.55),
  },
  bigGrid: { flexDirection: 'row', gap: 10, marginTop: 22 },
  bigCard: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.hairlines.light,
    backgroundColor: theme.colors.paper,
  },
  bigCaption: {
    fontFamily: 'IBMPlexMono',
    fontSize: 10,
    letterSpacing: 1.8,
    color: withOpacity(theme.colors.ink, 0.55),
  },
  bigNumber: {
    marginTop: 8,
    fontFamily: 'Sora',
    fontSize: 36,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  bigTrend: { marginTop: 6, fontFamily: 'IBMPlexMono', fontSize: 10, letterSpacing: 1.4 },
  section: { marginTop: 24, marginBottom: 10, fontFamily: 'Sora', fontSize: 20 },
  pipelineRow: { marginBottom: 14 },
  pipelineHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  pipelineName: { fontFamily: 'Sora', fontSize: 16, color: theme.colors.ink },
  pipelineHours: { fontFamily: 'Sora', fontSize: 16, fontWeight: '500' },
  pipelineMeta: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    color: withOpacity(theme.colors.ink, 0.55),
  },
  barTrack: {
    marginTop: 8,
    height: 6,
    borderRadius: 99,
    backgroundColor: withOpacity(theme.colors.ink, 0.08),
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 99 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 28 },
  button: { flex: 1, padding: 14, borderRadius: 999, alignItems: 'center' },
  buttonDark: { backgroundColor: theme.colors.ink },
  buttonDarkText: { color: theme.colors.cream, fontFamily: 'Sora', fontWeight: '500' },
  buttonGhost: { borderWidth: 1, borderColor: theme.hairlines.light },
  buttonGhostText: { color: theme.colors.ink, fontFamily: 'Sora', fontWeight: '500' },
});
