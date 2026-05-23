import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/lib/theme';

const pipelines = [
  { name: 'Inbound coordination', hours: 220, tasks: 14235, success: 99.4, color: theme.colors.accent },
  { name: 'Invoice extraction', hours: 150, tasks: 2122, success: 98.7, color: theme.colors.glow },
  { name: 'Support triage', hours: 75.5, tasks: 1430, success: 97.2, color: theme.colors.amber },
] as const;

export default function WeeklyReportScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>WEEKLY PERFORMANCE</Text>
        <Text style={styles.h1}>May 15 – May 22</Text>
        <Text style={styles.sub}>Apex Regional Logistics</Text>

        <View style={styles.bigGrid}>
          <View style={styles.bigCard}>
            <Text style={styles.bigCaption}>HOURS SAVED</Text>
            <Text style={[styles.bigNumber, { color: theme.colors.accent }]}>445.5</Text>
            <Text style={styles.bigTrend}>↑ 12% vs last wk</Text>
          </View>
          <View style={styles.bigCard}>
            <Text style={styles.bigCaption}>COST REDUCED</Text>
            <Text style={styles.bigNumber}>$17.8k</Text>
            <Text style={styles.bigTrend}>↑ 8%</Text>
          </View>
        </View>

        <Text style={styles.section}>Pipeline breakdown</Text>
        {pipelines.map((p) => (
          <View key={p.name} style={styles.pipelineRow}>
            <View style={styles.pipelineHeader}>
              <Text style={styles.pipelineName}>{p.name}</Text>
              <Text style={[styles.pipelineHours, { color: p.color }]}>{p.hours}h</Text>
            </View>
            <Text style={styles.pipelineMeta}>
              {p.tasks.toLocaleString()} tasks · {p.success}% success
            </Text>
            <View style={styles.barTrack}>
              <LinearGradient
                colors={[p.color, theme.colors.glow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.barFill, { width: `${Math.min(95, p.hours / 3)}%` }]}
              />
            </View>
          </View>
        ))}

        <View style={styles.actions}>
          <Pressable style={[styles.button, styles.buttonDark]}>
            <Text style={styles.buttonDarkText}>Export PDF</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonGhost]}>
            <Text style={styles.buttonGhostText}>Share</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.cream },
  scroll: { padding: 18, paddingBottom: 120 },
  eyebrow: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 2.2,
    color: theme.colors.accent,
  },
  h1: { marginTop: 6, fontFamily: 'Sora', fontSize: 26, color: theme.colors.ink },
  sub: { marginTop: 2, fontFamily: 'Inter', fontSize: 13, color: 'rgba(61,26,15,0.55)' },
  bigGrid: { flexDirection: 'row', gap: 10, marginTop: 22 },
  bigCard: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.hairlines.light,
    backgroundColor: '#fff',
  },
  bigCaption: {
    fontFamily: 'IBMPlexMono',
    fontSize: 10,
    letterSpacing: 1.8,
    color: 'rgba(61,26,15,0.55)',
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
  pipelineMeta: { fontFamily: 'IBMPlexMono', fontSize: 11, color: 'rgba(61,26,15,0.55)' },
  barTrack: {
    marginTop: 8,
    height: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(61,26,15,0.08)',
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
