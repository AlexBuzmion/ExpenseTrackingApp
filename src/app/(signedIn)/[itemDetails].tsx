import { View, Text, InputText } from '@/src/components/Themed';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useEntriesStore } from '@/store/entriesStore';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import { InputTextField } from '@/src/components/InputTextField';
import DropdownComponent from '@/src/components/DropdownComponent';
import CustomButton from '@/src/components/CustomButton';


export default ItemDetails;

function ItemDetails() {
    const router = useRouter();
    const { itemDetails } = useLocalSearchParams<{ itemDetails: string }>();
    const itemList = useEntriesStore().itemEntryList;
    const updateExpense = useEntriesStore((state) => state.updateEntry);
    const removeExpense = useEntriesStore((state) => state.deleteEntry);

    const item = itemList[itemDetails];

    // State to track editable fields
    const [name, setName] = useState(item?.name || '');
    const [category, setCategory] = useState(item?.category || '');
    const [subcategory, setSubcategory] = useState(item?.subcategory || '');
    const [subtotal, setSubtotal] = useState(item?.subtotal.toString() || '0.00');
    const [hst, setHst] = useState(item?.hst.toString() || '0.00');
    const [total, setTotal] = useState(item?.total.toString() || '0.00');
    const [hasChanges, setHasChanges] = useState(false);
    const [note, setNote] = useState(item?.note || '');

    useEffect(() => {
        if (
            name !== item?.name ||
            category !== item?.category ||
            subcategory !== item?.subcategory ||
            subtotal !== item?.subtotal.toString() ||
            hst !== item?.hst.toString() ||
            note !== item?.note
        ) {
            setHasChanges(true);
        } else {
            setHasChanges(false);
        }
    }, [name, category, subcategory, subtotal, hst]);

    async function handleDeleteItem() {
        console.log('called')
        Alert.alert(
            `Confirm Deletion`,
            `Are you sure you want to delete:\n\n${item?.name} - $${item?.total}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        await removeExpense(itemDetails);
                        router.back();
                    }
                },
            ],
        );
    }

    async function handleSaveChanges() {
        if (!item) {
            //todo do something here to show a notification that there is no item to update
            return;
        }

        await updateExpense(itemDetails, {
            // id: item.id,
            name,
            date: item.date,
            category: category, // Use category here
            subcategory: subcategory, //Use subcategory here
            subtotal: parseFloat(subtotal),
            hst: parseFloat(hst),
            total: parseFloat((parseFloat(subtotal) + parseFloat(hst)).toFixed(2)),
            note: note
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

            <View style={styles.separator} />

            <InputTextField
                headerTitle="Expense Name"
                value={name}
                onChangeText={setName}
            />

            <View style={styles.dropdownContainer}>
                <DropdownComponent
                    category={category}
                    subcategory={subcategory}
                    onCategoryChange={val => setCategory(val)}
                    onSubcategoryChange={val => setSubcategory(val)}
                />
            </View>

            <InputTextField headerTitle="Subtotal:"
                value={subtotal}
                onChangeText={(val) => setSubtotal(val.replace(/[^0-9.]/g, ''))}
                keyboardType="decimal-pad"
            />

            <InputTextField
                headerTitle="HST:"
                value={hst}
                onChangeText={(val) => setHst(val.replace(/[^0-9.]/g, ''))}
                keyboardType="decimal-pad"
            />

            <InputTextField headerTitle='Total:' value={`$${total}`} editable={false} />

            <InputTextField headerTitle='Note:' value={note} onChangeText={setNote} />

            {hasChanges && (
                <CustomButton
                    title='Save Changes'
                    variant="primary"
                    onPressFunc={handleSaveChanges}
                    width={150}
                />
            )}

            <View style={styles.footer}>

                <Text style={styles.dateText}>Created on {new Date(item.creationDate).toLocaleDateString(
                    'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
                <Pressable onPress={() => handleDeleteItem()}>
                    <Ionicons name="trash-outline" size={40} color="#ccc" />
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10
    },
    separator: {
        marginVertical: 3,
        height: 1,
        width: '80%',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    saveText: {
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
    dropdownContainer: {
        margin: 10,
        width: '90%',
        alignSelf: 'center',
    },
});