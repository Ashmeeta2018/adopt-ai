import { Image, StyleSheet, type ImageSourcePropType, type ViewStyle } from 'react-native';

import { nativeTokens } from '@adopt-ai/tokens/native';

type BrandMarkVariant = 'mark' | 'lockup' | 'mono' | 'cream';

interface BrandMarkProps {
  variant?: BrandMarkVariant;
  size: number;
}

const assetMap: Record<BrandMarkVariant, ImageSourcePropType> = {
  mark: require('../../assets/adopt-ai-mark.png'),
  lockup: require('../../assets/adopt-ai-lockup.png'),
  mono: require('../../assets/adopt-ai-mark-ink.png'),
  cream: require('../../assets/adopt-ai-mark-cream.png'),
};

export function BrandMark({ variant = 'mark', size }: BrandMarkProps) {
  const aspectRatio = variant === 'lockup' ? 1024 / 624 : 1024 / 624;

  return (
    <Image
      source={assetMap[variant]}
      style={[
        styles.mark,
        {
          width: size,
          height: Math.round(size / aspectRatio),
        } satisfies ViewStyle,
      ]}
      resizeMode="contain"
      accessible
      accessibilityLabel="Adopt AI"
    />
  );
}

const styles = StyleSheet.create({
  mark: {
    // Dimensions set inline via style prop
  },
});
