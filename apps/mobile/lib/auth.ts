import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect } from 'react';
import { create } from 'zustand';

import Constants from 'expo-constants';

const SESSION_KEY = 'adopt-auth-session';

const extra = Constants.expoConfig?.extra as {
  oktaIssuer?: string;
  oktaClientId?: string;
} | undefined;

const oktaIssuer = extra?.oktaIssuer ?? '';
const oktaClientId = extra?.oktaClientId ?? '';

interface AuthState {
  accessToken: string | null;
  authenticated: boolean;
  hydrate: () => Promise<void>;
  setSession: (token: string) => Promise<void>;
  clearSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  authenticated: false,
  hydrate: async () => {
    const token = await SecureStore.getItemAsync(SESSION_KEY);
    set({ accessToken: token, authenticated: !!token });
  },
  setSession: async (token: string) => {
    await SecureStore.setItemAsync(SESSION_KEY, token);
    set({ accessToken: token, authenticated: true });
  },
  clearSession: async () => {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    set({ accessToken: null, authenticated: false });
  },
}));

const redirectUri = makeRedirectUri({ scheme: 'adoptai' });

export function useOktaAuth() {
  const discovery = useAutoDiscovery(oktaIssuer);
  const setSession = useAuthStore((s) => s.setSession);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: oktaClientId,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: 'code',
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      void setSession(response.authentication.accessToken);
    }
  }, [response, setSession]);

  const signIn = useCallback(() => {
    void promptAsync();
  }, [promptAsync]);

  return { request, response, signIn };
}
