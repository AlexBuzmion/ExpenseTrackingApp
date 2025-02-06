import { SectionList, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, InputText } from '@/src/components/Themed';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';
import { useExpenseListStore } from '@/store/expenseListStore';
import { format } from 'date-fns';
import ItemEntry from '@/src/components/itemEntry';
import { useEffect, useRef } from 'react';

export default function TabOneScreen() {
    const listStore = useExpenseListStore().expenseList;
    const sections = groupExpensesByMonth(listStore);
	const scaleAnim = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (listStore.length === 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.1, // Expand slightly
                        duration: 100,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1, // Shrink back
                        duration: 2000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [listStore.length]);

	function groupExpensesByMonth(listStore: any[]) {
		const grouped:Record<string, any[]> = {};
	
		listStore.forEach((expense) => {
			const date = new Date(expense.date);
			const monthKey = format(date, "MMMM yyyy"); // Example: "February 2025"
	
			if (!grouped[monthKey]) {
				grouped[monthKey] = [];
			}
			grouped[monthKey].push(expense);
		});
	
		return Object.keys(grouped).map((month) => ({
			title: month,
			data: grouped[month],
		}));
	}

    return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container}>
				<Stack.Screen options={{ title: 'Expenses' }} />
				<View style={[ styles.searchBar, {flexDirection: 'row', alignItems: 'center'}]}>
					<Ionicons style={{paddingHorizontal: 10}} name="search" size={20} color={Colors.dark.tint}></Ionicons>
					<InputText
						style={{ marginLeft: 10, color: Colors.dark.tint }}
						placeholder="Search"
					>
					</InputText>
				</View>
				{/* <Text style={styles.title}>Expense List</Text> */}
				{/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
				{listStore.length === 0 ? (
					<Text style={styles.title}>No expenses found</Text>
					) : (
						<SectionList
							sections={sections}
							keyExtractor={(item, index) => item.id + index}
							renderItem={({ item }) => (
								<ItemEntry item={item} />
							)}
							renderSectionHeader={({ section: { title } }) => (
								<View style={styles.headerContainer}>
									<Text style={styles.headerText} lightColor={Colors.dark.tint} darkColor={Colors.light.tint}>{title}</Text>
									<View style={styles.separator} lightColor={Colors.dark.tint} darkColor={Colors.light.tint} />
								</View>
								
							)}
						/>
					)
				}
				<Animated.View style={[styles.addbutton, { transform: [{ scale: listStore.length === 0 ? scaleAnim : 1 }] }]}>
					<Link href="/modal" asChild>
						<TouchableOpacity>
						<Ionicons name="add" size={30} color={Colors.dark.tint} />
						</TouchableOpacity>
					</Link>
				</Animated.View>
			</View>
		</SafeAreaView>
  );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 5,
		height: 1,
		width: '100%',
	},
	addbutton: {
		position: 'absolute',
		bottom: 20,
		right: 20,
		backgroundColor: Colors.light.tint,
		borderRadius: 6,
		elevation: 5, // Shadow effect
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
	},
	itemContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 10,
	},
	headerContainer: {
		padding: 5,
	},
	headerText: {
		fontSize: 18,
		fontWeight: 400,
	},
	searchBar: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: '#ccc',
	},
});
