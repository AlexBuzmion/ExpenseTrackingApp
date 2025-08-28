import { View, Text } from '@/src/components/Themed';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useEntriesStore } from '@/store/entriesStore';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { InputTextField } from '@/src/components/InputTextField';
import DropdownComponent from '@/src/components/DropdownComponent';
import CustomButton from '@/src/components/CustomButton';
import DismissKeyboardView from '@/src/components/DismissKeyboardView';
import { StatusBar } from 'expo-status-bar';

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
    }, [name, category, subcategory, subtotal, hst, note]);

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
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
            <DismissKeyboardView>
                <View style={{ flex: 1, justifyContent: 'space-between' }} lightColor='fff' darkColor='#222'>

                    <View style={styles.separator} lightColor='fff' darkColor='#222' />
                    <View style={styles.separator} lightColor='fff' darkColor='#222' />

                    <InputTextField
                        headerTitle="Expense Name"
                        value={name}
                        onChangeText={setName}
                    />

                    <View style={styles.dropdownContainer} lightColor='fff' darkColor='#222'>
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

                    <View style={{ backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'center' }}>
                        <CustomButton
                            title='Back'
                            variant="secondary"
                            onPressFunc={() => router.back()}
                            width={150}
                        />

                        {hasChanges && (
                            <CustomButton
                                title='Save Changes'
                                variant="primary"
                                onPressFunc={handleSaveChanges}
                                width={150}
                            />
                        )}
                    </View>

                    <View style={styles.footer} lightColor='fff' darkColor='#222'>

                        <Text style={styles.dateText}>Created on {new Date(item.creationDate).toLocaleDateString(
                            'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Text>
                        <Pressable onPress={() => handleDeleteItem()}>
                            <Ionicons name="trash-outline" size={40} color="#ccc" />
                        </Pressable>
                    </View>
                </View>
            </DismissKeyboardView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,

    },
    separator: {
        marginVertical: 10,
        height: 1,
        width: '100%',
    },
    footer: {
        position: 'relative',
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
    dateText: {
        fontSize: 15,
        color: '#888',
    },
    dropdownContainer: {
        margin: 10,
        width: '85%',
        alignSelf: 'center',
    },
});