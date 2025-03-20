import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Dropdown } from '@/src/components/Themed';
import { useEntriesStore } from '@/store/entriesStore';
import Colors from '../constants/Colors';
import { useCategories } from '@/store/catStore';

type DropdownComponentProps = {
    category: string;
    subcategory: string;
    onCategoryChange: (value: string) => void;
    onSubcategoryChange: (value: string) => void;
};

const DropdownComponent: React.FC<DropdownComponentProps> = ({
    category,
    subcategory,
    onCategoryChange,
    onSubcategoryChange,
}) => {
  const categories = useCategories((state) => state.categories);
  const [isFocus, setIsFocus] = useState(false);

    const categoryData = Object.keys(categories).map((cat) => ({
        label: cat,
        value: cat,
    }));

    const subcategoryData = category && categories[category]
        ? categories[category].map((sub) => ({ label: sub, value: sub }))
        : [];

    useEffect(() => {
        if (category && !categories[category]?.includes(subcategory)) {
            onSubcategoryChange('');
        }
    }, [category, categories, subcategory, onSubcategoryChange]);

    return (
        <View>
            <Dropdown
                containerStyle={[styles.dropdown, isFocus && { borderColor: Colors.light.tint }]}
                data={categoryData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select category' : '...'}
                searchPlaceholder="Search..."
                value={category}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    onCategoryChange(item.value);
                    setIsFocus(false);
                }}
                lightColor="#fff" // Set light/dark colors
                darkColor="#222"
                iconColor='#ccc'
            />

            <Dropdown
                containerStyle={[styles.dropdown, isFocus && { borderColor: Colors.light.tint }]}
                data={subcategoryData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select subcategory' : '...'}
                searchPlaceholder="Search..."
                value={subcategory}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    onSubcategoryChange(item.value);
                    setIsFocus(false);
                }}
                lightColor="#fff" // Set light/dark colors
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