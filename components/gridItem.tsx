import { Colors } from "@/constants/theme";
import { useFormData } from "@/store/globleState";
import React from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";

// Use React.memo so the parent doesn't force it to re-render
const GridItem = React.memo(({ id, updateList, theme }: any) => {
  // SELECTOR: This hook makes this component ONLY watch its specific data
  const itemData = useFormData((state) => state.listData.obj[id]);

  if (!itemData) return null;

  return (
    <TouchableOpacity 
      style={{
        width: "15%", height: 50,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: itemData.present ? Colors[theme].prime : Colors[theme].lightBG,
      }}
      onPress={() => updateList(id, !itemData.present)}
    >
      <ThemedText>{itemData.id}</ThemedText>
    </TouchableOpacity>
  );
});

export default GridItem;