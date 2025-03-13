import { View, Text, InputText, useThemeColor } from '@/src/components/Themed';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, TouchableOpacity } from 'react-native';  
import { useExpenseListStore } from '@/store/expenseListStore';
import { Ionicons } from '@expo/vector-icons';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import Colors from '../../constants/Colors';


export default ItemDetails; 

function ItemDetails() {
    const router = useRouter();
    const { itemDetails } = useLocalSearchParams<{ itemDetails: string }>();
    const itemList = useExpenseListStore().expenseList;
    const updateExpense = useExpenseListStore((state) => state.updateExpense);
    const removeExpense = useExpenseListStore((state) => state.removeExpense);

    // Find the item using `id`
    const item = itemList.find((entry) => entry.id === itemDetails);

    // State to track editable fields
    const [name, setName] = useState(item?.name || '');
    const [category, setCategory] = useState(item?.category || '');
    const [subcategory, setSubcategory] = useState(item?.subcategory || '');
    const [subtotal, setSubtotal] = useState(item?.subtotal.toString() || '0.00');
    const [hst, setHst] = useState(item?.hst.toString() || '0.00');
    const [total, setTotal] = useState(item?.total.toString() || '0.00');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (
            name !== item?.name ||
            category !== item?.category ||
            subtotal !== item?.subtotal.toString() ||
            hst !== item?.hst.toString()
        ) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    }, [name, category, subtotal, hst]);

    function handleDeleteItem(itemId: string) {
        Alert.alert(
            `Confirm Deletion`, 
            `Are you sure you want to delete: ${item?.name} - $${item?.total}?`,
            [
                { text: "Cancel", style: "cancel" }, 
                { text: "Yes", onPress: () => {
                    removeExpense(itemId);
                    router.back();
                }}
            ]
        );
    }
    function handleSaveChanges() {
        if (!item) return;
    
        updateExpense(item.id, {
            name,
            category,
            subtotal: parseFloat(subtotal),
            hst: parseFloat(hst),
            total: parseFloat((parseFloat(subtotal) + parseFloat(hst)).toFixed(2)),
        });
    
        setHasChanges(false);
        router.back();
    }

    if (!item) {
        return (
            <View style={styles.container}>
                <Text>Item not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: item.name }} />
            
            <Text style={styles.title}>Expense Name:</Text>
            <InputText value={name} onChangeText={setName} style={styles.input} />

            <Text style={styles.title}>Category:</Text>
            <InputText value={category} onChangeText={setCategory} style={styles.input} />

            <Text style={styles.title}>Subcategory:</Text>
            <InputText value={subcategory} onChangeText={setSubcategory} style={styles.input} />

            <Text style={styles.title}>Subtotal:</Text>
            <InputText 
                value={subtotal} 
                onChangeText={(val) => setSubtotal(val.replace(/[^0-9.]/g, ''))} 
                keyboardType="decimal-pad" 
                style={styles.input} 
            />

            <Text style={styles.title}>HST:</Text>
            <InputText 
                value={hst} 
                onChangeText={(val) => setHst(val.replace(/[^0-9.]/g, ''))} 
                keyboardType="decimal-pad" 
                style={styles.input} 
            />

            <Text style={styles.title}>Total:</Text>
            <InputText value={`$${total}`} editable={false} style={styles.input} />

            <View style={styles.footer}>
                <Text style={styles.dateText}>Created on {new Date(item.creationDate).toLocaleDateString(
                    'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
                <Pressable onPress={() => handleDeleteItem(item.id)}>
                    <Ionicons name="trash-outline" size={40} color="#ccc" />
                </Pressable>
            </View>

            {hasChanges && (
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                    <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        padding: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        marginVertical: 3
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    footer: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    input: {
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 15,
        fontSize: 20,
        letterSpacing: 0.5,
        borderColor: '#ccc', 
        borderWidth: 1, 
        borderRadius: 8,
    },
    saveText: {
        // color: useThemeColor({}, 'text'), //! no hooks inside hooks 
        fontWeight: 'bold',

    },
    saveButton: {
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
        paddingVertical: 10
    },
    dateText: {
        fontSize: 15,
        color: '#888',
    },
});