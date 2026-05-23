import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMarkNative } from '@/components/BrandMarkNative';
import { unlockWithBiometrics } from '@/lib/biometric';
import { theme } from '@/lib/theme';

export default function SignInScreen() {
  const router = useRouter();

  const handleBiometric = async () => {
    const ok = await unlockWithBiometrics();
    if (ok) {
      router.replace('/(portal)/dashboard');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.void, theme.colors.obsidian, theme.colors.smoke]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <BrandMarkNative size={96} variant="color" />
          <Text style={styles.eyebrow}>CLIENT PORTAL</Text>
          <Text style={styles.h1}>{'Welcome back,\nMaya.'}</Text>
          <Text style={styles.sub}>Apex Regional Logistics · Director of Ops</Text>
        </View>

        <View style={styles.bottom}>
          <Pressable style={styles.faceCard} onPress={handleBiometric}>
            <Text style={styles.faceText}>Use Face ID</Text>
            <Text style={styles.faceArrow}>→</Text>
          </Pressable>

          <Pressable style={styles.ssoButton}>
            <Text style={styles.ssoText}>Continue with SSO (Okta)</Text>
          </Pressable>

          <Text style={styles.footer}>SOC 2 · ISO 27001 · HIPAA · END-TO-END ENCRYPTED</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.void },
  safe: { flex: 1, padding: 24, justifyContent: 'space-between' },
  top: { alignItems: 'center', marginTop: 36 },
  eyebrow: {
    marginTop: 24,
    fontFamily: 'IBMPlexMono',
    fontSize: 11,
    letterSpacing: 2.2,
    color: theme.colors.glow,
  },
  h1: {
    marginTop: 14,
    fontFamily: 'Sora',
    fontSize: 32,
    fontWeight: '500',
    color: theme.colors.cream,
    textAlign: 'center',
    lineHeight: 36,
  },
  sub: {
    marginTop: 8,
    fontFamily: 'Inter',
    fontSize: 13,
    color: 'rgba(248,244,238,0.6)',
  },
  bottom: { gap: 14 },
  faceCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(248,244,238,0.06)',
    borderWidth: 1,
    borderColor: theme.hairlines.dark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faceText: { color: theme.colors.cream, fontFamily: 'Sora', fontSize: 16, fontWeight: '500' },
  faceArrow: { color: theme.colors.cream, fontSize: 18 },
  ssoButton: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.hairlines.dark,
    alignItems: 'center',
  },
  ssoText: { color: theme.colors.cream, fontFamily: 'Sora', fontSize: 15 },
  footer: {
    marginTop: 18,
    textAlign: 'center',
    fontFamily: 'IBMPlexMono',
    fontSize: 10,
    letterSpacing: 1.8,
    color: 'rgba(248,244,238,0.4)',
  },
});
