import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/lib/theme';

interface Alert {
  id: string;
  tag: 'OPS' | 'DRIFT' | 'TEAM';
  time: string;
  title: string;
  body: string;
  severity: 'glow' | 'accent' | 'gold';
}

const today: Alert[] = [
  {
    id: '1',
    tag: 'OPS',
    time: '2 min ago',
    title: 'Throughput spike on intake-agent-v4',
    body: '2.4× baseline, last hour. All within p95.',
    severity: 'glow',
  },
  {
    id: '2',
    tag: 'DRIFT',
    time: '14 min ago',
    title: 'Confidence dipped below threshold on 3 messages',
    body: 'Escalated to your #ops-ai Slack channel for review.',
    severity: 'accent',
  },
  {
    id: '3',
    tag: 'TEAM',
    time: '1 hr ago',
    title: 'Maya added a comment to last weekly report',
    body: '"Great week — let’s slot a 1:1 to look at invoice success rate."',
    severity: 'gold',
  },
];

const earlier: Pick<Alert, 'id' | 'tag' | 'title'>[] = [
  { id: '4', tag: 'OPS', title: 'Nightly rebuild of intake-agent-v4 completed successfully' },
  { id: '5', tag: 'OPS', title: 'Auto-patched TMS adapter to handle new carrier format' },
];

const severityColor: Record<Alert['severity'], string> = {
  glow: theme.colors.glow,
  accent: theme.colors.accent,
  gold: theme.colors.gold,
};

export default function AlertsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>NOTIFICATIONS</Text>
            <Text style={styles.h1}>Alerts & updates</Text>
          </View>
          <Pressable>
            <Text style={styles.clear}>CLEAR</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>TODAY</Text>
        {today.map((a) => (
          <View key={a.id} style={styles.card}>
            <View style={[styles.bar, { backgroundColor: severityColor[a.severity] }]} />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <View style={styles.cardTop}>
                <Text style={styles.tag}>{a.tag}</Text>
                <Text style={styles.time}>{a.time}</Text>
              </View>
              <Text style={styles.title}>{a.title}</Text>
              <Text style={styles.body}>{a.body}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.section}>EARLIER</Text>
        {earlier.map((a) => (
          <View key={a.id} style={styles.simpleRow}>
            <Text style={styles.tag}>{a.tag}</Text>
            <Text style={styles.simpleTitle}>{a.title}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.cream },
  scroll: { padding: 18, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  eyebrow: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 2.2,
    color: 'rgba(61,26,15,0.55)',
  },
  h1: { marginTop: 6, fontFamily: 'Sora', fontSize: 26, color: theme.colors.ink },
  clear: { fontFamily: 'IBMPlexMono', letterSpacing: 1.8, color: theme.colors.accent },
  section: {
    marginTop: 22,
    marginBottom: 10,
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 1.8,
    color: 'rgba(61,26,15,0.55)',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.hairlines.light,
  },
  bar: { width: 4, borderRadius: 99 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  tag: {
    fontFamily: 'IBMPlexMono',
    fontSize: 10,
    letterSpacing: 1.8,
    color: 'rgba(61,26,15,0.55)',
  },
  time: { fontFamily: 'IBMPlexMono', fontSize: 10, color: 'rgba(61,26,15,0.5)' },
  title: { marginTop: 6, fontFamily: 'Sora', fontSize: 15, color: theme.colors.ink },
  body: { marginTop: 4, fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(61,26,15,0.65)' },
  simpleRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.hairlines.light,
  },
  simpleTitle: { marginTop: 4, fontFamily: 'Inter', fontSize: 13, color: theme.colors.ink },
});
