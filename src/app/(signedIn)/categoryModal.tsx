import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Text, View, InputText as TextInput } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { useCategories } from '@/store/catStore';
import { set } from 'react-datepicker/dist/date_utils';

export default function CategoryModalScreen() {

    //! using the new category store
    const categories = useCategories((state) => state.categories);
    const addCategory = useCategories((state) => state.addCategory);
    const deleteCategory = useCategories((state) => state.deleteCategory);
    const editCategory = useCategories((state) => state.editCategory);
    const addSubcategory = useCategories((state) => state.addSubcategory); 
    const deleteSubcategory = useCategories((state) => state.deleteSubcategory);
    const editSubcategory = useCategories((state) => state.editSubcategory);

    const [newCategory, setNewCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newSubcategory, setNewSubcategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [isEditing, setIsEditing] = useState('');
    const [editedCategoryName, setEditedCategoryName] = useState('');

    // Subcategory Editing State
    const [editingSubcategory, setEditingSubcategory] = useState('');
    const [editedSubcategoryName, setEditedSubcategoryName] = useState('');

    function handleAddCategory() {
        if (newCategory === '') {
            alert('Please enter a category name');
            return;
        }
        addCategory(newCategory);
        setNewCategory('');
    }
    function handleEditCat() {
        // we should have a reference to the category we want to edit
        // and the new name
        editCategory(selectedCategory, newCategory);
        setSelectedCategory('');
        setNewCategory('');
    }
    function handleDeleteCat(){
        deleteCategory(selectedCategory);   
        setSelectedCategory('');
    }
    function handleAddSubCat() {
        addSubcategory(selectedCategory, newSubcategory);
        setSelectedCategory('');
        setNewSubcategory('');
    }
    function handleEditSubCat() {
        editSubcategory(selectedCategory , selectedSubcategory, newSubcategory);
        setSelectedCategory('');
        setSelectedSubcategory('');
        setNewSubcategory('');
    }
    function handleDeleteSubCat() {
        deleteSubcategory(selectedCategory, selectedSubcategory);
        setSelectedCategory('');
        setSelectedSubcategory('');
    }

    useEffect(() => {
        // handleEditSubCat()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            {/* <ScrollView contentContainerStyle={{ padding: 20 }}> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'gray', padding: 5}}>
                <Text>Selected Cat: </Text>
                <Text> {selectedCategory}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'gray', padding: 5}}>
                <Text>New Cat Text: </Text>
                <Text> {newCategory}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'gray', padding: 5}}>
                <Text> Selected Subcat: </Text>
                <Text> {selectedSubcategory}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'gray', padding: 5}}>
                <Text> New Subcat Text: </Text>
                <Text> {newSubcategory} </Text>
            </View>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Create New Category</Text>

                <TextInput 
                    placeholder="Category name"
                    value={newCategory}
                    onChangeText={setNewCategory}
                    style={styles.inputFieldContainer}
                />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
                        <Text>Add</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.button} onPress={handleEditCat}>
                        <Text>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleDeleteCat}>
                        <Text>Delete</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 18, marginTop: 20 }}>Categories</Text>
                <FlatList
                    data={Object.keys(categories).map((cat) => cat)}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'gray', padding: 10 }}>
                            
                            <TouchableOpacity onPress={() => {
                                setSelectedCategory(item)
                            }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <Text style={{ fontSize: 18, marginTop: 20 }}>Sub categories</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>New SubCategory</Text>
                
                <TextInput 
                    placeholder="SubCategory name"
                    value={newSubcategory}
                    onChangeText={setNewSubcategory}
                    style={styles.inputFieldContainer}
                />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.button} onPress={handleAddSubCat}>
                        <Text>Add</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.button} onPress={handleEditSubCat}>
                        <Text>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleDeleteSubCat}>
                        <Text>Delete</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={Object.values(categories).flat()} 
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: 'gray', padding: 10 }}>
                            <TouchableOpacity onPress={() => {
                                setSelectedSubcategory(item)
                            }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    />
                {/* Object.keys() returns an array of keys from the categories object */}
                

            {/* </ScrollView> */}
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
});

