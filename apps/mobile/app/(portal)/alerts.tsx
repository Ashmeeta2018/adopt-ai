import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme, withOpacity } from '@/lib/theme';
import { trpc } from '@/lib/trpc';

type Severity = 'ops' | 'drift' | 'team';

function relativeTime(iso: string): string {
  const elapsed = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (elapsed < 60) return 'just now';
  if (elapsed < 3600) return `${Math.floor(elapsed / 60)} min ago`;
  if (elapsed < 86400) return `${Math.floor(elapsed / 3600)} hr ago`;
  return `${Math.floor(elapsed / 86400)}d ago`;
}

const severityColor: Record<Severity, string> = {
  ops: theme.colors.glow,
  drift: theme.colors.accent,
  team: theme.colors.gold,
};

export default function AlertsScreen() {
  const { data, isLoading } = trpc.portal.listAlerts.useQuery({});

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>NOTIFICATIONS</Text>
            <Text style={styles.h1}>Alerts & updates</Text>
          </View>
          <Pressable accessibilityLabel="Clear all alerts" accessibilityRole="button">
            <Text style={styles.clear}>CLEAR</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>TODAY</Text>
        {data?.today.map((a) => (
          <View key={a.id} style={styles.card}>
            <View style={[styles.bar, { backgroundColor: severityColor[a.severity] }]} />
            <View style={{ flex: 1, paddingLeft: 14 }}>
              <View style={styles.cardTop}>
                <Text style={styles.tag}>{a.severity.toUpperCase()}</Text>
                <Text style={styles.time}>{relativeTime(a.ts)}</Text>
              </View>
              <Text style={styles.title}>{a.title}</Text>
              <Text style={styles.body}>{a.body}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.section}>EARLIER</Text>
        {data?.earlier.map((a) => (
          <View key={a.id} style={styles.simpleRow}>
            <Text style={styles.tag}>{a.severity.toUpperCase()}</Text>
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  eyebrow: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 2.2,
    color: withOpacity(theme.colors.ink, 0.55),
  },
  h1: { marginTop: 6, fontFamily: 'Sora', fontSize: 26, color: theme.colors.ink },
  clear: { fontFamily: 'IBMPlexMono', letterSpacing: 1.8, color: theme.colors.accent },
  section: {
    marginTop: 22,
    marginBottom: 10,
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 1.8,
    color: withOpacity(theme.colors.ink, 0.55),
  },
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 14,
    backgroundColor: theme.colors.paper,
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
    color: withOpacity(theme.colors.ink, 0.55),
  },
  time: { fontFamily: 'IBMPlexMono', fontSize: 10, color: withOpacity(theme.colors.ink, 0.5) },
  title: { marginTop: 6, fontFamily: 'Sora', fontSize: 15, color: theme.colors.ink },
  body: {
    marginTop: 4,
    fontFamily: 'Inter',
    fontSize: 12.5,
    color: withOpacity(theme.colors.ink, 0.65),
  },
  simpleRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.hairlines.light,
  },
  simpleTitle: { marginTop: 4, fontFamily: 'Inter', fontSize: 13, color: theme.colors.ink },
});
