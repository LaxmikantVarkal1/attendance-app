import { KeyboardAvoidingView, Platform, StyleSheet, useColorScheme } from 'react-native';

import CustomForm from '@/components/CustomForm';
import { Colors } from '@/constants/theme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ModalScreen() {
  const insets = useSafeAreaInsets();
  const theme = useColorScheme() ?? "light";

  const screens = {
    form: <CustomForm/>,
  }
  return (
    <SafeAreaView style={[styles.container,{backgroundColor:Colors[theme].background}]}>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {screens['form']}
     </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal: 10
  }
});
