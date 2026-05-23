import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/lib/theme';

const agents = ['intake-agent-v4', 'invoice-agent-v2', 'support-router-v1'] as const;

export default function AgentsListScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Your agents</Text>
        {agents.map((id) => (
          <Pressable
            key={id}
            style={styles.row}
            onPress={() => router.push(`/(portal)/agents/${id}`)}
          >
            <Text style={styles.rowText}>{id}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.cream },
  scroll: { padding: 18 },
  title: { fontFamily: 'Sora', fontSize: 26, color: theme.colors.ink, marginBottom: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.hairlines.light,
  },
  rowText: { fontFamily: 'IBMPlexMono', fontSize: 14, color: theme.colors.ink },
  chevron: { fontSize: 22, color: 'rgba(61,26,15,0.45)' },
});
