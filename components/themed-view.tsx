import { useColorScheme, View, type ViewProps } from 'react-native';

import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const cardStyle = {
    gap: 8,
    padding:12,
    marginBottom: 8,
    justifyContent:"space-between",
    flexDirection:"row",
    flexWrap:"wrap",
    backgroundColor:Colors[useColorScheme()??"light"].activeIcon
  }

  return <View style={[style]} {...otherProps} />;
}
