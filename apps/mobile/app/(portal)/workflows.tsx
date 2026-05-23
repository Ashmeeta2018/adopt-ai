import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme, withOpacity } from '@/lib/theme';

const WORKFLOWS = [
  {
    id: 'wf-intake-coordination',
    name: 'Inbound Carrier Coordination',
    description: 'Reads carrier emails, classifies intent, extracts shipment data, and routes to TMS.',
    status: 'ACTIVE' as const,
    version: 4,
    trigger: 'EVENT',
    nodes: 6,
    agents: 1,
  },
  {
    id: 'wf-invoice-extraction',
    name: 'Invoice Data Extraction',
    description: 'Extracts structured data from PDF invoices and posts to QuickBooks.',
    status: 'ACTIVE' as const,
    version: 2,
    trigger: 'EVENT',
    nodes: 4,
    agents: 1,
  },
  {
    id: 'wf-support-triage',
    name: 'Support Ticket Triage',
    description: 'Classifies support requests by severity and routes to the correct team.',
    status: 'ACTIVE' as const,
    version: 1,
    trigger: 'EVENT',
    nodes: 4,
    agents: 1,
  },
] as const;

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: theme.colors.success,
  DRAFT: theme.colors.warning,
  PAUSED: withOpacity(theme.colors.ink, 0.3),
  ARCHIVED: withOpacity(theme.colors.ink, 0.2),
};

export default function WorkflowsListScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Workflows</Text>
        <Text style={styles.subtitle}>{WORKFLOWS.length} active</Text>

        {WORKFLOWS.map((wf) => (
          <Pressable
            key={wf.id}
            style={styles.card}
            onPress={() => router.push(`/(portal)/workflows/${wf.id}`)}
            accessibilityLabel={`${wf.name} — ${wf.status.toLowerCase()}, version ${wf.version}, ${wf.nodes} nodes`}
            accessibilityRole="button"
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconBadge}>
                <Ionicons name="git-branch-outline" size={18} color={theme.colors.cream} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.cardName}>{wf.name}</Text>
                  <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[wf.status] }]} />
                </View>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {wf.description}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>

            <View style={styles.metricsRow}>
              <Metric label="Version" value={`v${wf.version}`} />
              <Metric label="Nodes" value={String(wf.nodes)} />
              <Metric label="Trigger" value={wf.trigger.toLowerCase()} />
              <Metric label="Agents" value={String(wf.agents)} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.cream },
  scroll: { padding: 18, paddingBottom: 120 },
  title: { fontFamily: 'Sora', fontSize: 26, color: theme.colors.ink },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    fontFamily: 'IBMPlexMono',
    fontSize: 12,
    letterSpacing: 1.2,
    color: withOpacity(theme.colors.ink, 0.5),
  },
  card: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: theme.colors.paper,
    borderWidth: 1,
    borderColor: theme.hairlines.light,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.void,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardName: { fontFamily: 'IBMPlexMono', fontSize: 14, fontWeight: '500', color: theme.colors.ink },
  statusDot: { width: 7, height: 7, borderRadius: 99 },
  cardDescription: {
    marginTop: 4,
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 16,
    color: withOpacity(theme.colors.ink, 0.6),
  },
  chevron: { fontSize: 24, color: withOpacity(theme.colors.ink, 0.4), marginTop: 2 },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.hairlines.light,
  },
  metric: { flex: 1 },
  metricValue: {
    fontFamily: 'IBMPlexMono',
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  metricLabel: {
    marginTop: 2,
    fontFamily: 'IBMPlexMono',
    fontSize: 10,
    letterSpacing: 1.2,
    color: withOpacity(theme.colors.ink, 0.45),
  },
});
