import { useState, useEffect, useRef, useMemo } from 'react';
import { SectionList, StyleSheet, TouchableOpacity, Animated, Easing, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '@/src/components/Themed';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';
import { useExpenseListStore } from '@/store/expenseListStore';
import { format } from 'date-fns';
import ItemEntry from '@/src/components/itemEntry';
import FilterDropdown from '@/src/components/FilterDropdown';

export default function TabOneScreen() {
    const listStore = useExpenseListStore().expenseList;
    const [searchQuery, setSearchQuery] = useState(''); // Store the user's input
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const [selectedFilter, setSelectedFilter] = useState('date'); // Track selected filter

	// Animate the add button if no expenses exist
	useEffect(() => {
		if (listStore.length === 0) {
			scaleAnim.setValue(1); // Reset before animating
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
	
	// Filter expenses based on search query
    const filteredExpenses = listStore.filter(expense => 
        expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

	// Only expenses matching the search query are displayed.
	// 'useMemo()' is used to avoid unnecessary re-renders. Only recalculates when 'filteredExpenses' changes.

	const sections = useMemo(() => {
		if (selectedFilter === 'category') {
			return groupExpensesByCategory(filteredExpenses);
		}
		return groupExpensesByMonth(filteredExpenses);
	}, [filteredExpenses, selectedFilter]);

	//const sections = useMemo(() => groupExpensesByMonth(filteredExpenses), [filteredExpenses]);
	
	// Group filtered expenses by month
    function groupExpensesByMonth(expenses: any[]) {
        const grouped: Record<string, any[]> = {};

        expenses.forEach((expense) => {
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

	function groupExpensesByCategory(expenses: any[]) {
		const grouped: Record<string, any[]> = {};
	
		expenses.forEach((expense) => {
			const categoryKey = expense.category;
	
			if (!grouped[categoryKey]) {
				grouped[categoryKey] = [];
			}
			grouped[categoryKey].push(expense);
		});
	
		return Object.keys(grouped).map((category) => ({
			title: category,
			data: grouped[category],
		}));
	}	

    return (
		<SafeAreaView style={styles.container}>
			<View style={styles.container}>
				<Stack.Screen options={{ title: 'Expenses' }} />
				{/* Search Bar */}
				<View style={styles.searchBar}>
					<Ionicons style={{ paddingHorizontal: 10 }} name="search" size={20} color={Colors.dark.tint} />
					<TextInput
						style={{ flex: 1, color: Colors.dark.tint }}
						placeholder="Search"
						placeholderTextColor="#999"
						onChangeText={(text) => setSearchQuery(text.trimStart())}
						value={searchQuery}
					/>
				</View>

				<FilterDropdown selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />

				{/* Expense List */}
				{filteredExpenses.length === 0 ? (
					<Text style={styles.title}>No expenses found</Text>
					) : (
						<SectionList
							sections={sections}
							keyExtractor={(item, index) => item.id?.toString() ?? index.toString()} // Prevents crashes if item.id is undefined or null. If item.id is missing, it falls back to index.toString().
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

				{/* Add Button */}
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
		textAlign: 'center',
		marginTop: 20,
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
		padding: 10,
	},
	headerContainer: {
		padding: 5,
	},
	headerText: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	searchBar: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: '#ccc',
		paddingHorizontal: 10,
		backgroundColor: '#fff',
		flexDirection: 'row', 
		alignItems: 'center'
	},
});
