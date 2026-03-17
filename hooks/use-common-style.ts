import { Colors } from "@/constants/theme";
import { useColorScheme } from "react-native";

export const useIconStyle = (isActive: boolean) => {
  const theme = useColorScheme() ?? 'light';
  
  return {
    size: 20,
    color: isActive? Colors[theme].activeIcon: Colors[theme].icon,
  };
};