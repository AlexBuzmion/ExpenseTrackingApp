import React, { useState, useEffect } from 'react';
import { View, Dropdown } from '@/src/components/Themed';
import { useEntriesStore } from '@/store/entriesStore';
import { StyleSheet, Alert } from 'react-native';
import Colors from '../constants/Colors';
import { useCategories } from '@/store/catStore';
import { useRouter } from 'expo-router';


type DropdownComponentProps = {
    category: string;
    subcategory: string;
    onCategoryChange: (value: string) => void;
    onSubcategoryChange: (value: string) => void;
};

const ADD_NEW_CATEGORY_VALUE = '__ADD_NEW_CATEGORY__';
const ADD_NEW_SUBCATEGORY_VALUE = '__ADD_NEW_SUBCATEGORY__';

const DropdownComponent: React.FC<DropdownComponentProps> = ({
    category,
    subcategory,
    onCategoryChange,
    onSubcategoryChange,
}) => {
    const categories = useCategories((state) => state.categories);
    const [isCategoryFocus, setIsCategoryFocus] = useState(false);
    const [isSubcategoryFocus, setIsSubcategoryFocus] = useState(false);
    const router = useRouter();


    // --- Prepare category data with the "Add New" item ---
    const categoryData = [
        { label: '+ ADD NEW CATEGORY', value: ADD_NEW_CATEGORY_VALUE },
        ...Object.keys(categories).map((cat) => ({
            label: cat,
            value: cat,
        })),
    ];

    // --- Prepare subcategory data with the "Add New" item (only if valid category selected) ---
    const subcategoryData = (category && category !== ADD_NEW_CATEGORY_VALUE && categories[category])
        ? [
        { label: '+ ADD NEW SUBCATEGORY', value: ADD_NEW_SUBCATEGORY_VALUE },
            ...categories[category].map((sub) => ({ label: sub, value: sub }))
        ]
        : [];

    useEffect(() => {
        // Reset subcategory if category changes or becomes invalid (or is the Add New placeholder)
        if (category && category !== ADD_NEW_CATEGORY_VALUE && (!categories[category] || !categories[category]?.includes(subcategory))) {
            onSubcategoryChange('');
        } else if (category === ADD_NEW_CATEGORY_VALUE) {
            onSubcategoryChange('');
        }
    }, [category, categories, subcategory, onSubcategoryChange]);

    // Determine if the subcategory dropdown should be disabled (for the disable prop)
    const isSubcategoryDisabled = !category || category === ADD_NEW_CATEGORY_VALUE || !categories[category];

    return (
        <View>
            {/* Category Dropdown */}
            <Dropdown
                containerStyle={[styles.dropdown, isCategoryFocus && { borderColor: Colors.dark.tint }]} // Use separate focus state
                data={categoryData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isCategoryFocus ? 'Select category or Add New' : '...'}
                searchPlaceholder="Search..."
                value={category}
                onFocus={() => setIsCategoryFocus(true)}
                onBlur={() => setIsCategoryFocus(false)}
                onChange={item => {
                    setIsCategoryFocus(false); // Close dropdown
                    if (item.value === ADD_NEW_CATEGORY_VALUE) {
                        router.push("/categoryModal");
                        // Keep the previous category selected visually
                    } else {
                        onCategoryChange(item.value); // Normal category change
                    }
                }}
                lightColor="#fff" // Set light/dark colors
                darkColor="#222"
                iconColor='#ccc'
            />

            {/* Subcategory Dropdown */}
            <Dropdown
                containerStyle={[styles.dropdown, isSubcategoryFocus && { borderColor: Colors.dark.tint }]} // Use separate focus state
                data={subcategoryData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isSubcategoryFocus ? 'Select subcategory or Add New' : '...'} // Updated placeholder
                searchPlaceholder="Search..."
                value={subcategory}
                onFocus={() => setIsSubcategoryFocus(true)} // Use separate focus state setter
                onBlur={() => setIsSubcategoryFocus(false)} // Use separate focus state setter
                onChange={item => {
                    setIsSubcategoryFocus(false); // Close dropdown
                    if (item.value === ADD_NEW_SUBCATEGORY_VALUE) {
                        if (category && category !== ADD_NEW_CATEGORY_VALUE) {
                            router.push("/categoryModal");
                        } else {
                            // Alert user if they somehow clicked Add New without a valid category
                            Alert.alert("Select Category", "Please select a valid category before adding a subcategory.");
                        }
                    } else {
                        onSubcategoryChange(item.value); // Normal subcategory change
                    }
                }}

                // DISABLE SUBCATEGORY DROPDOWN if no valid category is selected or data is empty
                disable={isSubcategoryDisabled}
                lightColor="#fff"
                darkColor="#222"
                iconColor='#ccc'
            />
        </View>
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 10,
    },
});