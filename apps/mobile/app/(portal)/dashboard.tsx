import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgentPillNative } from '@/components/AgentPillNative';
import { theme, withOpacity } from '@/lib/theme';
import { trpc } from '@/lib/trpc';

function formatDayHeader(d: Date): string {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  return `${days[d.getDay()]} · ${months[d.getMonth()]} ${d.getDate()}`;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { data, isLoading } = trpc.portal.getDashboard.useQuery();

  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.spinnerWrap}>
          <Text style={styles.spinnerText}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.date}>{formatDayHeader(new Date())}</Text>
          <Text style={styles.greeting}>{data.greeting}</Text>
          <View style={styles.pillRow}>
            <AgentPillNative label={`${data.liveAgents} LIVE`} />
            <AgentPillNative
              label={`${data.openAlerts} ALERTS`}
              status={data.openAlerts > 0 ? 'queue' : undefined}
            />
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/(portal)/reports')}
          accessibilityLabel={`Weekly report — ${data.hoursReallocated} hours reallocated`}
          accessibilityRole="button"
        >
          <View style={styles.heroCard}>
            <LinearGradient
              colors={[theme.colors.burgundy, theme.colors.accent, theme.colors.glow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.heroEyebrow}>
              THIS WEEK · {data.weekRange.start}–{data.weekRange.end}
            </Text>
            <Text style={styles.heroNumber}>{data.hoursReallocated}h</Text>
            <Text style={styles.heroSub}>
              Human-hours reallocated · {data.hoursTrendPct >= 0 ? '↑' : '↓'}
              {Math.abs(data.hoursTrendPct)}% vs last week
            </Text>
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Your agents</Text>
        {data.agents.map((agent) => (
          <Pressable
            key={agent.id}
            style={styles.agentCard}
            onPress={() => router.push(`/(portal)/agents/${agent.id}`)}
            accessibilityLabel={`${agent.name} — ${agent.description}, ${agent.tasks24h} tasks, ${Math.round(agent.successRate * 100)}% success`}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={[theme.colors.accent, theme.colors.glow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.agentGlyph}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.agentNameRow}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
              </View>
              <Text style={styles.agentDescription}>{agent.description}</Text>
              <Text style={styles.agentMetrics}>
                {agent.tasks24h.toLocaleString()} tasks/24h · {Math.round(agent.successRate * 100)}%
                success
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.cream },
  scroll: { padding: 18, paddingBottom: 120 },
  spinnerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  spinnerText: {
    fontFamily: 'IBMPlexMono',
    fontSize: 12,
    color: withOpacity(theme.colors.ink, 0.4),
  },
  header: { marginBottom: 18 },
  date: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 2.2,
    color: withOpacity(theme.colors.ink, 0.6),
  },
  greeting: {
    marginTop: 8,
    fontFamily: 'Sora',
    fontSize: 26,
    color: theme.colors.ink,
  },
  pillRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  heroCard: {
    height: 200,
    borderRadius: 22,
    overflow: 'hidden',
    padding: 22,
    justifyContent: 'space-between',
  },
  heroEyebrow: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 2.2,
    color: withOpacity(theme.colors.cream, 0.85),
  },
  heroNumber: { fontFamily: 'Sora', fontSize: 64, color: theme.colors.cream, fontWeight: '600' },
  heroSub: { fontFamily: 'Inter', fontSize: 13, color: withOpacity(theme.colors.cream, 0.85) },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontFamily: 'Sora',
    fontSize: 22,
    color: theme.colors.ink,
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: theme.colors.paper,
    borderWidth: 1,
    borderColor: theme.hairlines.light,
  },
  agentGlyph: { width: 42, height: 42, borderRadius: 12 },
  agentNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  agentName: { fontFamily: 'IBMPlexMono', fontSize: 14, color: theme.colors.ink },
  agentDescription: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: withOpacity(theme.colors.ink, 0.65),
  },
  agentMetrics: {
    marginTop: 4,
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 0.6,
    color: withOpacity(theme.colors.ink, 0.55),
  },
  dot: { width: 7, height: 7, borderRadius: 99 },
  chevron: { fontSize: 24, color: withOpacity(theme.colors.ink, 0.4) },
});
