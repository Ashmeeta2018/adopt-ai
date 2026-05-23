import { StyleSheet, Text, type TextStyle, TouchableOpacity, type ViewStyle, ActivityIndicator } from 'react-native';
import type { ReactNode } from 'react';

import { nativeTokens } from '@adopt-ai/tokens/native';

type Variant = 'primary' | 'dark' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  onPress: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  loading?: boolean;
}

const sizeStyles: Record<Size, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingHorizontal: 14, paddingVertical: 8 },
    text: { fontSize: 13 },
  },
  md: {
    container: { paddingHorizontal: 18, paddingVertical: 12 },
    text: { fontSize: 14 },
  },
  lg: {
    container: { paddingHorizontal: 24, paddingVertical: 16 },
    text: { fontSize: 15 },
  },
};

const variantStyles: Record<Variant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: nativeTokens.colors.accent,
      shadowColor: nativeTokens.colors.burgundy,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.55,
      shadowRadius: 22,
      elevation: 6,
    },
    text: { color: '#FFF8F0' },
  },
  dark: {
    container: {
      backgroundColor: nativeTokens.colors.void,
    },
    text: { color: nativeTokens.colors.cream },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: nativeTokens.hairlines.light,
    },
    text: { color: nativeTokens.colors.ink },
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  icon,
  loading = false,
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        sizeStyle.container,
        variantStyle.container,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' ? nativeTokens.colors.ink : '#FFF8F0'}
        />
      ) : (
        <>
          <Text style={[styles.text, sizeStyle.text, variantStyle.text]}>
            {children}
          </Text>
          {icon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: nativeTokens.radii.full,
  },
  text: {
    fontFamily: nativeTokens.fonts.display,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  disabled: {
    opacity: 0.6,
  },
});
