import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
            title: 'Tab One',
            tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} />,
            // headerRight: () => (
            //   <Link href="/modal" asChild>
            //     <Pressable>
            //       {({ pressed }) => (
            //         <FontAwesome
            //           name="info-circle"
            //           size={25}
            //           color={Colors[colorScheme ?? 'light'].text}
            //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            //         />
            //       )}
            //     </Pressable>
            //   </Link>
            // ),
        }}
      />
        <Tabs.Screen
                name="two"
                options={{
                title: 'Reports',
                tabBarIcon: ({ color }) => <TabBarIcon name="file-text-o" color={color} />,
                }}
        />

        <Tabs.Screen
                name="analytics"
                options={{
                title: 'Analytics',
                tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
                }}
        />

        <Tabs.Screen
                name="account"
                options={{
                title: 'Login',
                tabBarIcon: ({ color }) => <TabBarIcon name="sign-in" color={color} />,
                }}
        />
        
        </Tabs> 
    );
}
