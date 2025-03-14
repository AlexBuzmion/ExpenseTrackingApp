import { useState } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, View, InputText as TextInput } from '../../components/Themed';
import { useExpenseListStore } from '@/store/expenseListStore';
import { Feather } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

export default function CategoryModalScreen() {
    const { categories, addCategory, addSubcategory, renameCategory, renameSubcategory } = useExpenseListStore();
    
    const [newCategory, setNewCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newSubcategory, setNewSubcategory] = useState('');
    const [isEditing, setIsEditing] = useState('');
    const [editedCategoryName, setEditedCategoryName] = useState('');

    // Subcategory Editing State
    const [editingSubcategory, setEditingSubcategory] = useState('');
    const [editedSubcategoryName, setEditedSubcategoryName] = useState('');

    const [, setState] = useState({});
    const forceUpdate = () => setState({});

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
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
                    <Text style={styles.buttonText}>Add Category</Text>
                </TouchableOpacity>

                <Text style={{ fontSize: 18, marginTop: 20 }}>Categories</Text>
                
                {/* Object.keys() returns an array of keys from the categories object */}
                {Object.keys(categories)
                .sort()
                .map((category) => (
                    <View key={category} style={{ marginVertical: 10 }}>
                        <View style={styles.categoryHeader}>
                            {isEditing === category ? (
                                <TextInput
                                    value={editedCategoryName}
                                    onChangeText={setEditedCategoryName}
                                    style={styles.inputFieldContainer}
                                    // onBlur is triggered when the input loses focus, usually when the user taps outside the input or presses the return key
                                    onBlur={() => {
                                        if (editedCategoryName.trim() && editedCategoryName !== category) {
                                            renameCategory(category, editedCategoryName.trim());
                                        }
                                        setIsEditing('');
                                    }}
                                />
                            ) : (
                                <Text 
                                    onPress={() => setSelectedCategory(category)}
                                    style={{
                                        fontSize: 16, fontWeight: 'bold',
                                        textDecorationLine: selectedCategory === category ? 'underline' : 'none'
                                    }}>
                                    {category}
                                </Text>
                            )}
                            <TouchableOpacity onPress={() => {
                                if (isEditing === category) {
                                    setIsEditing('');
                                } else {
                                    setIsEditing(category);
                                    setEditedCategoryName(category);
                                }
                            }}>
                                <Feather name="edit" size={18} color="gray" />
                            </TouchableOpacity>
                        </View>

                        {isEditing === category && (
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                                        <Text style={styles.buttonText}>Add</Text>
                                    </TouchableOpacity> 
                                </View>
                                
                                {/* categories[category].map() iterates over the array and renders each subcategory. */}
                                {categories[category].map((sub, index) => (
                                    <View key={index} style={styles.subcategoryContainer}>
                                        {editingSubcategory === sub ? (
                                            <TextInput
                                                value={editedSubcategoryName}
                                                onChangeText={setEditedSubcategoryName}
                                                style={styles.inputFieldContainer}
                                                onBlur={() => {
                                                    if (editedSubcategoryName.trim() && editedSubcategoryName !== sub) {
                                                        renameSubcategory(category, sub, editedSubcategoryName.trim());
                                                    }
                                                    setEditingSubcategory('');
                                                }}
                                            />
                                        ) : (
                                            <Text style={{ color: 'gray' }}>- {sub}</Text>
                                        )}
                                        <TouchableOpacity onPress={() => {
                                            setEditingSubcategory(sub);
                                            setEditedSubcategoryName(sub);
                                        }}>
                                            <Feather name="edit" size={14} color="gray" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    subcategoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
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
    },
    buttonText: {
        color: Colors.dark.tint,
        fontSize: 16,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: Colors.light.tint,
        borderRadius: 20,
        width: 120,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 10,
    },
});

