import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Alert, TouchableOpacity, Modal } from "react-native";
import { View, Text, InputText } from "./Themed";
import { useCategories } from "@/store/catStore";
import Colors from "../constants/Colors";
import { useState } from "react";

interface CategoryItemProps {
    category: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
    const { editCategory, deleteCategory } = useCategories();
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const confirmEditCategory = async () => {
        if (newCategoryName.trim() === '') {
            Alert.alert("Error", "Enter a category name");
            return;
        }
        await editCategory(category, newCategoryName);
        setShowCategoryModal(false);
    };

    return (
        <View style={styles.categoryItem} lightColor="#eee" darkColor="#333">
            <Text style={styles.catTitle}>{category}</Text>
            <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                <TouchableOpacity
                    onPress={() => {
                        setShowCategoryModal(true);
                    }}
                >
                    <Ionicons name="pencil" size={24} color="#65beff" style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Delete Category",
                            `Are you sure you want to delete "${category}" and all its subcategories?`,
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "Delete",
                                    style: "destructive",
                                    onPress: () => deleteCategory(category),
                                },
                            ]
                        );
                    }}
                >
                    <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>

            <Modal visible={showCategoryModal} transparent animationType="slide">
                <View style={styles.promptBackgroundView}>
                    <View style={styles.inputFieldBackgroundView} lightColor="#fff" darkColor="#222">
                        <Text style={{ fontWeight: 'bold' }}>Enter new name for {category}:</Text>
                        <InputText value={newCategoryName} onChangeText={setNewCategoryName} placeholder="Category name" style={styles.inputField} />
                        <View style={styles.promptButtonView}>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}><Text lightColor="blue" darkColor='#65beff'>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={(event) => confirmEditCategory() }>
                                <Text lightColor="blue" darkColor='#65beff'>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    categoryItem: {
        height: 45,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        padding: 5,
        marginBottom: 5,
    },
    catTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 5
    },
    promptButtonView: {
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        backgroundColor: 'transparent'
    },
    inputField: {
        borderWidth: 1, 
        borderColor: 'gray', 
        marginVertical: 10,
        padding: 10
    },
    promptBackgroundView: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    inputFieldBackgroundView: {
        width: '80%', 
        padding: 20, 
        borderRadius: 10,
        borderWidth: 1, 
        borderColor: 'gray'
    },
});

export default CategoryItem;