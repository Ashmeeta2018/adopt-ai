import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgentPillNative } from '@/components/AgentPillNative';
import { theme, withOpacity } from '@/lib/theme';
import { USER } from '@/lib/persona';

const agents = [
  {
    id: 'intake-agent-v4',
    name: 'intake-agent-v4',
    description: 'Inbound coordination',
    tasks: '14,235/day',
    success: '99.43%',
  },
  {
    id: 'invoice-agent-v2',
    name: 'invoice-agent-v2',
    description: 'Invoice extraction',
    tasks: '2,122/day',
    success: '98.7%',
  },
  {
    id: 'support-router-v1',
    name: 'support-router-v1',
    description: 'Customer support triage',
    tasks: '1,430/day',
    success: '97.2%',
  },
] as const;

function formatDayHeader(d: Date): string {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${days[d.getDay()]} · ${months[d.getMonth()]} ${d.getDate()}`;
}

function greetingFor(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

export default function DashboardScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.date}>{formatDayHeader(new Date())}</Text>
          <Text style={styles.greeting}>{greetingFor()} {USER.firstName}.</Text>
          <View style={styles.pillRow}>
            <AgentPillNative label="3 LIVE" />
            <AgentPillNative label="0 ALERTS" status="queue" />
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/(portal)/reports')}
          accessibilityLabel="Weekly report — 22 hours reallocated, up 12%"
          accessibilityRole="button"
        >
          <View style={styles.heroCard}>
            <LinearGradient
              colors={[theme.colors.burgundy, theme.colors.accent, theme.colors.glow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.heroEyebrow}>THIS WEEK · MAY 15–22</Text>
            <Text style={styles.heroNumber}>22h</Text>
            <Text style={styles.heroSub}>Human-hours reallocated · ↑ 12% vs last week</Text>
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Your agents</Text>
        {agents.map((a) => (
          <Pressable
            key={a.id}
            style={styles.agentCard}
            onPress={() => router.push(`/(portal)/agents/${a.id}`)}
            accessibilityLabel={`${a.name} — ${a.description}, ${a.tasks}, ${a.success} success`}
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
                <Text style={styles.agentName}>{a.name}</Text>
                <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
              </View>
              <Text style={styles.agentDescription}>{a.description}</Text>
              <Text style={styles.agentMetrics}>
                {a.tasks} · {a.success}
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
  agentDescription: { fontFamily: 'Inter', fontSize: 12, color: withOpacity(theme.colors.ink, 0.65) },
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
