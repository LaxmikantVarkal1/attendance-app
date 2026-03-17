import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { File, Plus } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  
  const iconStyle = {
    color: Colors[colorScheme].icon,
    size: 25
  };


  const TabScreens = [{
    name: "index",
    title: "Records",
    options: {
      tabBarIcon: ({ color }: any) => <File {...{...iconStyle,color}} />,
    }
  },
  {
    name: "AddAttendance",
    title: "Add new",
    options: {
      tabBarStyle: { display: 'none' },
      tabBarIcon: ({ color }: any) => <Plus {...{...iconStyle,color}} />,
    }
  }
  ]

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarAllowFontScaling:true,
        tabBarIconStyle:{
          marginBottom:5
        },
        tabBarItemStyle: {
          paddingTop: 5,
          marginBottom: 10,
        },
        tabBarStyle: {
          height: 90
        }
      }}>
      {
        TabScreens.map((tab) => (
          <Tabs.Screen
            name={tab.name}
            options={tab?.title ? {...tab.options, title:tab?.title}: {...tab.options, tabBarHideOnKeyboard:true} as any}
          />
        ))
      }
    </Tabs>
  );
}
