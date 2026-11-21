import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme, withOpacity } from '@/lib/theme';
import { trpc } from '@/lib/trpc';

const statusDotColor: Record<string, string> = {
  RUNNING: theme.colors.success,
  QUEUED: theme.colors.warning,
  ERROR: theme.colors.error,
  PAUSED: withOpacity(theme.colors.ink, 0.3),
};

export default function AgentsListScreen() {
  const router = useRouter();
  const { data, isLoading } = trpc.agents.list.useQuery();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  const agents = data ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Agents</Text>
        <Text style={styles.subtitle}>
          {agents.length} agent{agents.length === 1 ? '' : 's'}
        </Text>

        {agents.map((agent) => (
          <Pressable
            key={agent.id}
            style={styles.card}
            onPress={() => router.push(`/(portal)/agents/${agent.id}`)}
            accessibilityLabel={`${agent.name} — ${agent.description}, ${agent._count.runs} runs, status ${agent.status}`}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={[theme.colors.accent, theme.colors.glow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glyph}
            />
            <View style={styles.cardBody}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {agent.name}
                </Text>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: statusDotColor[agent.status] ?? theme.colors.ink },
                  ]}
                />
              </View>
              <Text style={styles.description} numberOfLines={2}>
                {agent.description}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.runs}>
                  {agent._count.runs.toLocaleString()} run{agent._count.runs === 1 ? '' : 's'}
                </Text>
                {agent.workflow && (
                  <Text style={styles.workflow} numberOfLines={1}>
                    {agent.workflow.name}
                  </Text>
                )}
              </View>
            </View>
            <Text style={styles.chevron}>&rsaquo;</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: 18,
    paddingBottom: 120,
  },
  title: {
    fontFamily: 'Sora',
    fontSize: 26,
    fontWeight: '500',
    color: theme.colors.ink,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 18,
    fontFamily: 'IBMPlexMono',
    fontSize: 12,
    letterSpacing: 0.6,
    color: withOpacity(theme.colors.ink, 0.55),
  },
  card: {
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
  glyph: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  cardBody: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flex: 1,
    fontFamily: 'IBMPlexMono',
    fontSize: 14,
    color: theme.colors.ink,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 99,
  },
  description: {
    marginTop: 3,
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 18,
    color: withOpacity(theme.colors.ink, 0.65),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  runs: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 0.6,
    color: withOpacity(theme.colors.ink, 0.55),
  },
  workflow: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 11,
    color: withOpacity(theme.colors.ink, 0.45),
  },
  chevron: {
    fontSize: 24,
    color: withOpacity(theme.colors.ink, 0.4),
  },
});
