import { AntDesign, Ionicons } from "@expo/vector-icons";
import { StyleSheet, Alert, TouchableOpacity, Modal, useColorScheme } from "react-native";
import { View, Text, InputText } from "./Themed";
import { useCategories } from "@/store/catStore";
import { useState } from "react";
import Colors from "../constants/Colors";

interface SubcategoryItemProps {
    subcategory: string;
    category: string;
}

const SubcategoryItem: React.FC<SubcategoryItemProps> = ({ subcategory, category }) => {
    const { editSubcategory, deleteSubcategory } = useCategories();
    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
    const [newSubcategoryName, setNewSubcategoryName] = useState('');

    const confirmEditSubcategory = async () => {
        if (newSubcategoryName.trim() === '') {
            Alert.alert("Error", "Enter a subcategory name");
            return;
        }
        await editSubcategory(category, subcategory, newSubcategoryName);
        setShowSubcategoryModal(false);
    };

    return (
        <View style={styles.subcategoryItem} lightColor="#ccc" darkColor="#444">
            <Text style={styles.subcatTitle}>{subcategory}</Text>
            <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                <TouchableOpacity
                    onPress={() => {
                        setShowSubcategoryModal(true);
                    }}
                >
                    <AntDesign name="edit" size={24} color={useColorScheme() === 'light' ? Colors.light.tint : Colors.dark.tint} style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Delete Subcategory",
                            `Are you sure you want to delete "${subcategory}"?`,
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "Delete",
                                    style: "destructive",
                                    onPress: () => deleteSubcategory(category, subcategory),
                                },
                            ]
                        );
                    }}
                >
                    <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>

            <Modal visible={showSubcategoryModal} transparent animationType="slide">
                <View style={styles.promptBackgroundView}>
                    <View style={styles.inputFieldBackgroundView} lightColor="#fff" darkColor="#222">
                        <Text style={{ fontWeight: 'bold' }}>Enter new name for {subcategory}:</Text>
                        <InputText value={newSubcategoryName} onChangeText={setNewSubcategoryName} placeholder="Subcategory name" style={styles.inputField} />
                        <View style={styles.promptButtonView}>
                            <TouchableOpacity onPress={() => setShowSubcategoryModal(false)}><Text lightColor="blue" darkColor='#65beff'>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={(event) => confirmEditSubcategory()}>
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
    subcategoryItem: {
        height: 35,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 30,
        padding: 5,
        marginBottom: 5,
    },
    subcatTitle: {
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

export default SubcategoryItem;