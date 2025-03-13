import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { AuthInfo } from '@/store/authStore';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function SignedInLayout() {
	const isSignedIn = AuthInfo(state => state.signedIn);
  	const colorScheme = useColorScheme();
	
	if (!isSignedIn) {
		return null;
	}
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.dark.tint,
				headerShown: false,
			}}
		>
		<Tabs.Screen
			name="index"
			options={{
				title: 'Tab One',
				tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} />,
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
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
				}}
			/>
		</Tabs> 
	);
}
