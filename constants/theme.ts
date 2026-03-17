/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */


const tintColorLight = '#ff2a04';
const tintColorDark = '#ff2a048b';

export const Colors: any = {
  light: {
    text: '#6e0e01',
    background: '#ff000007',
    tint: tintColorLight,
    icon: '#6e0e01',
    lightBG:"#ff000007",
    activeIcon: "#ff4e08",
    prime:"#ff2a048b",
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    original:"#fff"
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    lightBG:"#3d3c3c",
    activeIcon: "#ff4e08",
    prime:"#ff63478b",
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    original:"#000"
  },
};