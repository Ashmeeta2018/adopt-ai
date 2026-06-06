import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme, withOpacity } from '@/lib/theme';

interface WorkflowNode {
  id: string;
  kind: string;
  label: string;
}

const WORKFLOW_DATA: Record<string, {
  name: string;
  description: string;
  status: string;
  version: number;
  trigger: string;
  agents: number;
  lastExecution: string;
  nodes: WorkflowNode[];
}> = {
  'wf-intake-coordination': {
    name: 'Inbound Carrier Coordination',
    description: 'Reads carrier emails, classifies intent, extracts shipment data, and routes to TMS.',
    status: 'ACTIVE',
    version: 4,
    trigger: 'Event',
    agents: 1,
    lastExecution: 'Completed · 12 min ago',
    nodes: [
      { id: 'n1', kind: 'trigger', label: 'New email' },
      { id: 'n2', kind: 'agent', label: 'Classify' },
      { id: 'n3', kind: 'condition', label: 'Actionable?' },
      { id: 'n4', kind: 'agent', label: 'Extract data' },
      { id: 'n5', kind: 'output', label: 'Push to TMS' },
      { id: 'n6', kind: 'output', label: 'Archive' },
    ],
  },
  'wf-invoice-extraction': {
    name: 'Invoice Data Extraction',
    description: 'Extracts structured data from PDF invoices and posts to QuickBooks.',
    status: 'ACTIVE',
    version: 2,
    trigger: 'Event',
    agents: 1,
    lastExecution: 'Completed · 28 min ago',
    nodes: [
      { id: 'n1', kind: 'trigger', label: 'PDF received' },
      { id: 'n2', kind: 'agent', label: 'Extract fields' },
      { id: 'n3', kind: 'transform', label: 'Map to QB' },
      { id: 'n4', kind: 'output', label: 'Post to QB' },
    ],
  },
  'wf-support-triage': {
    name: 'Support Ticket Triage',
    description: 'Classifies support requests by severity and routes to the correct team.',
    status: 'ACTIVE',
    version: 1,
    trigger: 'Event',
    agents: 1,
    lastExecution: 'Completed · 5 min ago',
    nodes: [
      { id: 'n1', kind: 'trigger', label: 'Request' },
      { id: 'n2', kind: 'agent', label: 'Classify' },
      { id: 'n3', kind: 'agent', label: 'Suggest reply' },
      { id: 'n4', kind: 'output', label: 'Zendesk' },
    ],
  },
};

const NODE_KIND_COLORS: Record<string, { bg: string; text: string }> = {
  trigger: { bg: withOpacity(theme.colors.success, 0.12), text: theme.colors.success },
  agent: { bg: withOpacity(theme.colors.accent, 0.10), text: theme.colors.accent },
  condition: { bg: withOpacity(theme.colors.warning, 0.12), text: theme.colors.warning },
  transform: { bg: withOpacity(theme.colors.glow, 0.10), text: theme.colors.glow },
  output: { bg: withOpacity(theme.colors.ink, 0.06), text: withOpacity(theme.colors.ink, 0.5) },
};

export default function WorkflowDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const wf = WORKFLOW_DATA[id ?? ''] ?? WORKFLOW_DATA['wf-intake-coordination']!;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.void }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <PressableBack onPress={() => router.back()} />

          <Text style={styles.eyebrow}>WORKFLOW</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{wf.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
          </View>
          <Text style={styles.description}>{wf.description}</Text>

          <View style={styles.metricsGrid}>
            <Stat label="Version" value={`v${wf.version}`} />
            <Stat label="Trigger" value={wf.trigger} />
            <Stat label="Agents" value={String(wf.agents)} />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pipeline</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pipelineScroll}>
            {wf.nodes.map((node, i) => {
              const colors = NODE_KIND_COLORS[node.kind] ?? NODE_KIND_COLORS.output!;
              return (
                <View key={node.id} style={styles.pipelineItem}>
                  <View style={[styles.nodePill, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.nodeLabel, { color: colors.text }]}>{node.label}</Text>
                  </View>
                  {i < wf.nodes.length - 1 && (
                    <Text style={styles.arrow}>→</Text>
                  )}
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Last run</Text>
          </View>
          <View style={styles.executionCard}>
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
            <Text style={styles.executionText}>{wf.lastExecution}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function PressableBack({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.backButton} accessibilityLabel="Go back" accessibilityRole="button">
      <Ionicons name="chevron-back" size={20} color={withOpacity(theme.colors.cream, 0.6)} />
      <Text style={styles.backText}>Workflows</Text>
    </Pressable>
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
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backText: {
    fontFamily: 'IBMPlexMono',
    fontSize: 13,
    color: withOpacity(theme.colors.cream, 0.55),
  },
  eyebrow: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 2.2,
    color: withOpacity(theme.colors.cream, 0.55),
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  title: { fontFamily: 'Sora', fontSize: 24, color: theme.colors.cream, fontWeight: '600' },
  statusDot: { width: 8, height: 8, borderRadius: 99 },
  description: {
    marginTop: 8,
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 20,
    color: withOpacity(theme.colors.cream, 0.6),
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
  statValue: { fontFamily: 'Sora', fontSize: 18, color: theme.colors.cream, fontWeight: '500' },
  statLabel: {
    marginTop: 6,
    fontFamily: 'IBMPlexMono',
    fontSize: 10,
    letterSpacing: 1.8,
    color: withOpacity(theme.colors.cream, 0.55),
  },
  sectionHeader: { marginTop: 28, marginBottom: 10 },
  sectionTitle: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 2.2,
    color: withOpacity(theme.colors.cream, 0.55),
  },
  pipelineScroll: { flexDirection: 'row' },
  pipelineItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nodePill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  nodeLabel: { fontFamily: 'IBMPlexMono', fontSize: 11, fontWeight: '500' },
  arrow: { color: withOpacity(theme.colors.cream, 0.25), fontSize: 14 },
  executionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: withOpacity(theme.colors.cream, 0.05),
    borderWidth: 1,
    borderColor: theme.hairlines.dark,
  },
  executionText: {
    fontFamily: 'IBMPlexMono',
    fontSize: 12,
    color: withOpacity(theme.colors.cream, 0.75),
  },
});
