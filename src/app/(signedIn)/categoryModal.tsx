import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Text, View, InputText as TextInput } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { useCategories } from '@/store/catStore';
import { set } from 'react-datepicker/dist/date_utils';
import CategoryEditor from '@/src/components/CategoryEditor';

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
            <CategoryEditor></CategoryEditor>
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

