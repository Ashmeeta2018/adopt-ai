import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme, withOpacity } from '@/lib/theme';
import { trpc } from '@/lib/trpc';

const NODE_KIND_COLORS: Record<string, { bg: string; text: string }> = {
  trigger: { bg: withOpacity(theme.colors.success, 0.12), text: theme.colors.success },
  agent: { bg: withOpacity(theme.colors.accent, 0.1), text: theme.colors.accent },
  condition: { bg: withOpacity(theme.colors.warning, 0.12), text: theme.colors.warning },
  transform: { bg: withOpacity(theme.colors.glow, 0.1), text: theme.colors.glow },
  output: { bg: withOpacity(theme.colors.ink, 0.06), text: withOpacity(theme.colors.ink, 0.5) },
};

const STATUS_DOT: Record<string, string> = {
  ACTIVE: theme.colors.success,
  DRAFT: theme.colors.warning,
  PAUSED: withOpacity(theme.colors.ink, 0.3),
  ARCHIVED: withOpacity(theme.colors.ink, 0.2),
};

export default function WorkflowDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: wf, isLoading } = trpc.workflows.get.useQuery({ workflowId: id ?? '' });

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
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (!wf) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.void,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{ fontFamily: 'Inter', fontSize: 16, color: withOpacity(theme.colors.cream, 0.6) }}
        >
          Workflow not found
        </Text>
      </View>
    );
  }

  const lastExec = wf.executions[0];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.void }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <PressableBack onPress={() => router.back()} />

          <Text style={styles.eyebrow}>WORKFLOW</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{wf.name}</Text>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: STATUS_DOT[wf.status] ?? theme.colors.success },
              ]}
            />
          </View>
          {wf.description ? <Text style={styles.description}>{wf.description}</Text> : null}

          <View style={styles.metricsGrid}>
            <Stat label="Version" value={`v${wf.version}`} />
            <Stat label="Trigger" value={wf.trigger} />
            <Stat label="Agents" value={String(wf.agents.length)} />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pipeline</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pipelineScroll}
          >
            {wf.nodesJson.map((node: { id: string; kind: string; label: string }, i: number) => {
              const colors = NODE_KIND_COLORS[node.kind] ?? NODE_KIND_COLORS.output!;
              return (
                <View key={node.id} style={styles.pipelineItem}>
                  <View style={[styles.nodePill, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.nodeLabel, { color: colors.text }]}>{node.label}</Text>
                  </View>
                  {i < wf.nodesJson.length - 1 && <Text style={styles.arrow}>→</Text>}
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Last run</Text>
          </View>
          {lastExec ? (
            <View style={styles.executionCard}>
              <Ionicons
                name={lastExec.status === 'COMPLETED' ? 'checkmark-circle' : 'alert-circle'}
                size={18}
                color={
                  lastExec.status === 'COMPLETED' ? theme.colors.success : theme.colors.warning
                }
              />
              <Text style={styles.executionText}>
                {lastExec.status} · {Math.round(lastExec.durationMs / 60000)} min ago
              </Text>
            </View>
          ) : (
            <View style={styles.executionCard}>
              <Text style={styles.executionText}>No executions yet</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function PressableBack({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.backButton}
      accessibilityLabel="Go back"
      accessibilityRole="button"
    >
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
