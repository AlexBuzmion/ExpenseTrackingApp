import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, Dropdown} from '@/src/components/Themed';
import {StyleSheet } from 'react-native';
import { DarkTheme } from '@react-navigation/native';
//import { Dropdown } from 'react-native-element-dropdown';

interface FilterDropdownProps {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ selectedFilter, setSelectedFilter }) => {
  const filterOptions = [
    { label: 'By Date', value: 'date' },
    { label: 'By Category', value: 'category' },
  ];

  return (
    <View style={styles.container} lightColor='fff' darkColor='#fff'>
      <Dropdown
        data={filterOptions}
        labelField="label"
        valueField="value"
        value={selectedFilter}
        onChange={(item) => setSelectedFilter(item.value)}
        style={styles.dropdown}
        placeholder="Select Filter"
        renderLeftIcon={() => (
          <Ionicons name='filter-sharp' size={20} color="#ccc" style={{ marginRight: 8 }} />
        )}
        lightColor="fff"
        darkColor="#222"
        iconColor='#ccc'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: '#ccc',
  },
});

export default FilterDropdown;
