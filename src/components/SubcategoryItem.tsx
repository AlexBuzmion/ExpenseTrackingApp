// SubcategoryItem.tsx (NEW FILE!)
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Alert, TouchableOpacity } from "react-native";
import { View, Text } from "./Themed";
import { useCategories } from "@/store/catStore";

interface SubcategoryItemProps {
    subcategory: string;
    category: string;
}

const SubcategoryItem: React.FC<SubcategoryItemProps> = ({ subcategory, category }) => {
    const { editSubcategory, deleteSubcategory } = useCategories();

    return (
        <View style={styles.subcategoryItem} lightColor="#ccc" darkColor="#444">
            <Text style={styles.subcatTitle}>{subcategory}</Text>
            <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
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
                                        if (newSubName !== null && newSubName !== undefined && newSubName.trim() !== "" && newSubName !== subcategory) {
                                            await editSubcategory(category, subcategory, newSubName);
                                        }
                                    },
                                },
                            ],
                            "plain-text",
                            subcategory
                        );
                    }}
                >
                    <Ionicons name="pencil" size={24} color="#65beff" style={{ marginRight: 10 }} />
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
});

export default SubcategoryItem;