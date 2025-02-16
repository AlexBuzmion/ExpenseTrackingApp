import { useState } from 'react';
import { Text, View, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useExpenseListStore } from '@/store/expenseListStore';
import Colors from '../constants/Colors';

export default function CategoryModalScreen() {
    const { categories, addCategory, addSubcategory } = useExpenseListStore();
    
    const [newCategory, setNewCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newSubcategory, setNewSubcategory] = useState('');

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Create New Category</Text>
            
            <TextInput 
                placeholder="Category name"
                value={newCategory}
                onChangeText={setNewCategory}
                style={styles.inputFieldContainer}
            />

            <TouchableOpacity style={styles.button} onPress={() => {
                if (newCategory.trim()) {
                    addCategory(newCategory.trim());
                    setNewCategory('');
                }
            }}>
                <Text>Add Category</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 18, marginTop: 20 }}>Categories</Text>
            
            {Object.keys(categories).map((category) => (
                <View key={category} style={{ marginVertical: 10 }}>
                    <Text 
                        onPress={() => setSelectedCategory(category)}
                        style={{
                            fontSize: 16, fontWeight: 'bold',
                            textDecorationLine: selectedCategory === category ? 'underline' : 'none'
                        }}
                    >
                        {category}
                    </Text>

                    {selectedCategory === category && (
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <TextInput 
                                placeholder="Subcategory name"
                                value={newSubcategory}
                                onChangeText={setNewSubcategory}
                                style={styles.inputFieldContainer}
                            />

                            <TouchableOpacity style={styles.button} onPress={() => {
                                if (newSubcategory.trim()) {
                                    addSubcategory(category, newSubcategory.trim());
                                    setNewSubcategory('');
                                }
                            }}>
                                <Text>Add</Text>
                            </TouchableOpacity> 
                        </View>
                    )}

                    {categories[category].map((sub) => (
                        <Text key={sub} style={{ marginLeft: 10, color: 'gray' }}>- {sub}</Text>
                    ))}

                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.light.tint,
        borderRadius: 20,
        width: 100,
        height: 40, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    inputFieldContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 10,
		maxWidth: 400,
		height: 40,
        marginTop: 10,
        marginBottom: 10
	}
});
