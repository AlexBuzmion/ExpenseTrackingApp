import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

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
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
        <Ionicons name='filter-sharp' size={24} color="black" />
        <Dropdown
          data={filterOptions}
          labelField="label"
          valueField="value"
          value={selectedFilter}
          onChange={(item) => setSelectedFilter(item.value)}
          style={styles.dropdown}
          placeholder="Select Filter"
        />
      </View>
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
    height: 36,
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginLeft : 10
  },
});

export default FilterDropdown;
