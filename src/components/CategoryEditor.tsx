// CategoryEditor.tsx
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, ActivityIndicator, SectionList, TouchableOpacity, Modal, Alert } from "react-native";
import { InputText, View, Text } from "./Themed"; // Ensure Themed components exist
import { useAuthStore } from "@/store/authStore";
import { useCategories } from "@/store/catStore";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import Colors from "../constants/Colors";

export default function CategoryEditor() {
    const router = useRouter();
    const setFirstTimeUser = useAuthStore((state) => state.setFirstTimeUser);

    const { categories, addCategory, deleteCategory, editCategory, addSubcategory, deleteSubcategory, editSubcategory, initCategories } = useCategories();

    const [loading, setLoading] = useState(true);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [currentCategoryForSub, setCurrentCategoryForSub] = useState('');

    useEffect(() => {
        const initialize = async () => {
            await initCategories();
            setLoading(false);
        };
        initialize();
    }, [initCategories]);

    const promptAddCategory = () => {
        setNewCategoryName('');
        setShowCategoryModal(true);
    };

    const confirmAddCategory = async () => {
        if (newCategoryName.trim() === '') {
            Alert.alert("Error", "Enter category name");
            return;
        }
        if (categories[newCategoryName]) {
            Alert.alert("Error", `${newCategoryName} already exists!`);
            return;
        }
        await addCategory(newCategoryName);
        setShowCategoryModal(false);
    };

    const promptAddSubcategory = (category: string) => {
        setCurrentCategoryForSub(category);
        setNewSubcategoryName('');
        setShowSubcategoryModal(true);
    };

    const confirmAddSubcategory = async () => {
        if (newSubcategoryName.trim() === '') {
            Alert.alert("Error", "Enter a subcategory name");
            return;
        }
        if (categories[currentCategoryForSub]?.includes(newSubcategoryName)) {
            Alert.alert("Error", `${newSubcategoryName} already exists!`);
            return;
        }
        await addSubcategory(currentCategoryForSub, newSubcategoryName);
        setShowSubcategoryModal(false);
    };

    const handleConfirm = () => {
        Alert.alert(
            "Saving..",
            "Happy with your selections?",
            [
                { text: "Cancel" },
                {
                    text: "Confirm",
                    onPress: async () => {
                        await setFirstTimeUser(false);
                        router.replace('/(signedIn)');
                    }
                },
            ],
        );
    };

    const sections = Object.entries(categories).map(([cat, subcats]) => ({
        title: cat,
        data: subcats.map((sub) => ({ name: sub, category: cat })),
    }));

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16 }} lightColor="#fff" darkColor="#222">
            <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 10 }}>
                Here are your categories:
            </Text>

            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item.category + item.name + index}
                renderSectionHeader={({ section: { title } }) => (
                    // Category Item
                    <View style={styles.categoryItem} lightColor="#eee" darkColor="#333">
                        <Text style={ styles.catTitle }>{title}</Text>
                        <View style={{ flexDirection: 'row', backgroundColor: 'transparent'}}>
                            <TouchableOpacity
                                onPress={() => {
                                    //console.log(title);
                                    Alert.prompt(
                                        "Edit Category",
                                        "Enter new category name:",
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            {
                                                text: "OK",
                                                onPress: async (newCatName) => {
                                                    if (newCatName !== null && newCatName !== undefined) {
                                                        if (newCatName.trim() !== "" && newCatName !== title) {
                                                            await editCategory(title, newCatName);
                                                        }
                                                    }
                                                }
                                            }
                                        ],
                                        "plain-text",
                                        title
                                    );
                                }}
                            >
                                <Ionicons name="pencil" size={24} color="#65beff" style={{ marginRight: 10 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { 
                                Alert.alert("Delete Category", 
                                `Are you sure you want to delete "${title}" and all its subcategories?`, 
                                [{ text: "Cancel", style: "cancel" }, 
                                { text: "Delete", style: "destructive", 
                                onPress: () => deleteCategory(title) }]); 
                            }}>
                                <Ionicons name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                
                renderItem={({ item }) => (
                    // Subcategory Item
                    <View style={styles.subcategoryItem} lightColor="#ccc" darkColor="#444">
                        <Text style={styles.subcatTitle}>{item.name}</Text>
                        <View style={{ flexDirection: 'row' , backgroundColor: 'transparent'}}>
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.prompt(
                                        "Edit Subcategory",
                                        "Enter new subcategory name:",
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            {
                                                text: "OK",
                                                onPress: async (newSubName) => {
                                                    if (newSubName != null) {
                                                        if (newSubName.trim() !== "" && newSubName !== item.name) {
                                                            await editSubcategory(item.category, item.name, newSubName);
                                                        }
                                                    }
                                                }
                                            }
                                        ],
                                        "plain-text",
                                        item.name
                                    );
                                }}
                            >
                                <Ionicons name="pencil" size={24} color="#65beff" style={{ marginRight: 10 }} />
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => { 
                                Alert.alert("Delete Subcategory", 
                                `Are you sure you want to delete "${item.name}"?`, 
                                [{ text: "Cancel", style: "cancel" }, 
                                { text: "Delete", style: "destructive", 
                                onPress: () => deleteSubcategory(item.category, item.name) }]); 
                            }}>
                                <Ionicons name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                renderSectionFooter={({ section: { title } }) => (
                    <TouchableOpacity onPress={() => promptAddSubcategory(title)} style={{ marginLeft: 10, padding: 5 }}>
                        <Text style={styles.addSubCategoryButtonText} lightColor='blue' darkColor='#65beff'>Add subcategory for {title}</Text>
                    </TouchableOpacity>
                )}
                ListFooterComponent={
                    <TouchableOpacity onPress={promptAddCategory} style={styles.addCategoryButton}>
                        <Text style={styles.addCategoryButtonText}>Add Category</Text>
                    </TouchableOpacity>
                }
                style={{ flex: 1 }}
            />

            {/*Confirm Categories*/}
            <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20 }} lightColor="#fff" darkColor="#222">
                <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirm Categories</Text>
                </TouchableOpacity>
            </View>
            
            {/*Adding a New Category*/}
            <Modal visible={showCategoryModal} transparent animationType="slide">
                <View style={styles.promptBackgroundView}>
                    <View style={styles.inputFieldBackgroundView}>
                        <Text style={{ fontWeight: 'bold' }}>Enter new category name:</Text>
                        <InputText value={newCategoryName} onChangeText={setNewCategoryName} placeholder="Category name" style={styles.inputField} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}><Text style={{ color: 'blue' }}>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={confirmAddCategory}><Text style={{ color: 'blue' }}>Confirm</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/*Adding a New Subcategory*/}
            <Modal visible={showSubcategoryModal} transparent animationType="slide">
                <View style={styles.promptBackgroundView}>
                    <View style={styles.inputFieldBackgroundView}>
                        <Text style={{ fontWeight: 'bold' }}>Enter new subcategory name for {currentCategoryForSub}:</Text>
                        <InputText value={newSubcategoryName} onChangeText={setNewSubcategoryName} placeholder="Subcategory name" style={styles.inputField} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => setShowSubcategoryModal(false)}><Text style={{ color: 'blue' }}>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={confirmAddSubcategory}><Text style={{ color: 'blue' }}>Confirm</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    confirmButton: {
        backgroundColor: '#5a3286',
        borderRadius: 100,
        padding: 15
    },
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
    catTitle: {
        fontWeight: 'bold', 
        fontSize: 16,
        marginLeft: 5
    },
    subcatTitle: {
        marginLeft: 5
    },
    addCategoryButton: {
        padding: 10, 
        backgroundColor: '#e6cff2', 
        borderRadius: 8,
        alignItems: 'center', 
        marginTop: 10 
    },
    addCategoryButtonText: {
        fontWeight: 'bold',
        fontSize: 12,
        color: Colors.dark.tint
    },
    addSubCategoryButtonText: {
        fontWeight: 'bold',
        fontSize: 12,
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
        backgroundColor: 'white', 
        padding: 20, 
        borderRadius: 10 
    },
});