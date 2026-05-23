import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Wraps `expo-local-authentication` with the prompt copy used in
 * the design (`Use Face ID`).
 */
export async function unlockWithBiometrics(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return false;
  }
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    return false;
  }
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock Adopt AI',
    fallbackLabel: 'Use passcode',
    disableDeviceFallback: false,
  });
  return result.success;
}
