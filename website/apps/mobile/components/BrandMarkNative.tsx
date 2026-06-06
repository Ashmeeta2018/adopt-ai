import { Image, type ImageSourcePropType, View } from 'react-native';

const sources: Record<'color' | 'cream' | 'ink', ImageSourcePropType> = {
  color: require('../assets/adopt-ai-mark.png'),
  cream: require('../assets/adopt-ai-mark-cream.png'),
  ink: require('../assets/adopt-ai-mark-ink.png'),
};

interface Props {
  size?: number;
  variant?: 'color' | 'cream' | 'ink';
}

export function BrandMarkNative({ size = 80, variant = 'color' }: Props) {
  const height = Math.round((size * 624) / 1024);
  return (
    <View>
      <Image
        source={sources[variant]}
        style={{ width: size, height }}
        resizeMode="contain"
      />
    </View>
  );
}
