import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { categories } from '@/store/expenseListStore';
import Colors from '../constants/Colors';
import { View, Text } from '@/src/components/Themed';
import { useColorScheme } from '@/src/components/useColorScheme';

const data = categories;

type DropdownComponentProps = {
    category: string;
    subcategory: string;
    onCategoryChange: (category: string) => void;
    onSubcategoryChange: (subcategory: string) => void;
};

const DropdownComponent: React.FC<DropdownComponentProps> = ({
    category,
    subcategory,
    onCategoryChange,
    onSubcategoryChange
}) => {
    const theme = useColorScheme() ?? 'light';

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subcategories, setSubcategories] = useState<{ label: string; value: string }[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');

    // Dynamically set colors
    const dropdownStyle = {
        backgroundColor: Colors[theme].background,
        borderColor: isFocus ? 'transparent' : 'transparent',
    };

    const textColor = Colors[theme].text;
    const placeholderColor = theme === 'dark' ? '#bbb' : '#888';

    return (
        <View style={[styles.container, { maxWidth: 400 }]}>
            {/* Category Dropdown */}
            <View style={styles.dropdownContainer}>
                <Dropdown
                    style={[styles.dropdown, dropdownStyle]}
                    placeholderStyle={[styles.placeholderStyle, { color: placeholderColor }]}
                    selectedTextStyle={[styles.selectedTextStyle, { color: textColor }]}
                    inputSearchStyle={[styles.inputSearchStyle, { backgroundColor: '#ccc', color: textColor }]}
                    iconStyle={styles.iconStyle}
                    data={Object.keys(data).map((key) => ({ label: key, value: key }))}
                    search
                    maxHeight={450}
                    labelField="label"
                    valueField="value"
                    placeholder={selectedCategory ? selectedCategory : !isFocus ? 'Select category' : 'What is this expense for?'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item.value);
                        setSelectedCategory(item.label);
                        onCategoryChange(item.value);
                        setSelectedSubcategory('');
                        onSubcategoryChange('');
                        setIsFocus(false);
                        setSubcategories(categories[item.label].map(subcat => ({ label: subcat, value: subcat })));
                    }}
                />
            </View>
            {/* Subcategory Dropdown */}
            {selectedCategory && (
                <View style={styles.dropdownContainer}>
                <Dropdown
                    style={[styles.dropdown, dropdownStyle]}
                    placeholderStyle={[styles.placeholderStyle, { color: placeholderColor }]}
                    selectedTextStyle={[styles.selectedTextStyle, { color: textColor }]}
                    inputSearchStyle={[styles.inputSearchStyle, { backgroundColor: '#ccc', color: textColor }]}
                    iconStyle={styles.iconStyle}
                    data={subcategories}
                    search
                    maxHeight={450}
                    labelField="label"
                    valueField="value"
                    placeholder={selectedSubcategory ? selectedSubcategory : !isFocus ? 'Select subcategory' : '...'}
                    searchPlaceholder="Search..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item.label);
                        setSelectedSubcategory(item.label);
                        onSubcategoryChange(item.value);
                        setIsFocus(false);
                    }}
                />
                </View>
            )}
        </View>
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    container: {

    },
    dropdownContainer: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    dropdown: {
        height: 38,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'gray',
        left: 22,
        top: 8,
        zIndex: 9999,
        // paddingHorizontal: 8,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});