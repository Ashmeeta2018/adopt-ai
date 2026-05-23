import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgentPillNative } from '@/components/AgentPillNative';
import { theme } from '@/lib/theme';

const sections = [
  {
    title: 'ACCOUNT',
    rows: [
      { label: 'Profile' },
      { label: 'Notifications' },
      { label: 'Security & 2FA' },
    ],
  },
  {
    title: 'WORKSPACE',
    rows: [
      { label: 'Team members', value: '8 active' },
      { label: 'API keys', value: '4 keys' },
      { label: 'Billing', value: 'Lift · $5,800 · annual' },
      { label: 'Audit log', value: '14 days' },
    ],
  },
  {
    title: 'SUPPORT',
    rows: [
      { label: 'Contact your architect', value: 'Tomás Costa →', accent: true },
      { label: 'Open ticket' },
      { label: 'Documentation' },
    ],
  },
] as const;

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <LinearGradient
            colors={[theme.colors.burgundy, theme.colors.accent, theme.colors.glow]}
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>ML</Text>
          </LinearGradient>
          <Text style={styles.name}>Maya Lindqvist</Text>
          <Text style={styles.sub}>Director of Operations · Apex Logistics</Text>
          <View style={{ marginTop: 14 }}>
            <AgentPillNative label="STUDIO PLAN" status="queue" />
          </View>
        </View>

        {sections.map((s) => (
          <View key={s.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <View style={styles.card}>
              {s.rows.map((r, i) => (
                <Pressable
                  key={r.label}
                  style={[
                    styles.row,
                    i < s.rows.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.hairlines.light,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.rowLabel,
                      'accent' in r && r.accent && { color: theme.colors.accent },
                    ]}
                  >
                    {r.label}
                  </Text>
                  {'value' in r && <Text style={styles.rowValue}>{r.value}</Text>}
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footer}>ADOPT AI · v2.4.1 · BUILD 88241</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.cream },
  scroll: { padding: 18, paddingBottom: 120 },
  header: { alignItems: 'center', marginBottom: 22 },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff8f0', fontFamily: 'Sora', fontSize: 28, fontWeight: '600' },
  name: { marginTop: 12, fontFamily: 'Sora', fontSize: 22, color: theme.colors.ink },
  sub: { marginTop: 2, fontFamily: 'Inter', fontSize: 13, color: 'rgba(61,26,15,0.55)' },
  section: { marginTop: 18 },
  sectionTitle: {
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 1.8,
    color: 'rgba(61,26,15,0.5)',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.hairlines.light,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  rowLabel: { fontFamily: 'Sora', fontSize: 15, color: theme.colors.ink },
  rowValue: { fontFamily: 'IBMPlexMono', fontSize: 12, color: 'rgba(61,26,15,0.55)' },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'IBMPlexMono',
    fontSize: 10,
    letterSpacing: 1.6,
    color: 'rgba(61,26,15,0.4)',
  },
});
