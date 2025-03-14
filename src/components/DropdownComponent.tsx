import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
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

  // Generate category and subcategory data for the dropdowns
  const categoryData = Object.keys(categories).map((cat) => ({
    label: cat,
    value: cat,
  }));

  const subcategoryData = category && categories[category]
    ? categories[category].map((sub) => ({ label: sub, value: sub }))
    : [];

  useEffect(() => {
    // Clear subcategory selection when category changes.
    if (category && !categories[category]?.includes(subcategory)) {
      onSubcategoryChange('');
    }
  }, [category, categories, subcategory, onSubcategoryChange]);

  return (
    <View>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: Colors.light.tint }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        itemTextStyle={styles.itemTextStyle}
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
      />

      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: Colors.light.tint }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        itemTextStyle={styles.itemTextStyle}
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
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 10
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    itemTextStyle: {
        fontSize: 16
    }
});