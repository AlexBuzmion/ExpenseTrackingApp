// CategoryItem.tsx
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Alert, TouchableOpacity } from "react-native";
import { View, Text } from "./Themed";
import { useCategories } from "@/store/catStore";
import Colors from "../constants/Colors";

interface CategoryItemProps {
    category: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
    const { editCategory, deleteCategory } = useCategories();

    return (
        <View style={styles.categoryItem} lightColor="#eee" darkColor="#333">
            <Text style={styles.catTitle}>{category}</Text>
            <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                <TouchableOpacity
                    onPress={() => {
                        Alert.prompt(
                            "Edit Category",
                            "Enter new category name:",
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "OK",
                                    onPress: async (newCatName) => {
                                        if (newCatName !== null && newCatName !== undefined && newCatName.trim() !== "" && newCatName !== category) {
                                            await editCategory(category, newCatName);
                                        }
                                    },
                                },
                            ],
                            "plain-text",
                            category
                        );
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
});

export default CategoryItem;