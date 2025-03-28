import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, Dropdown} from '@/src/components/Themed';
import {StyleSheet } from 'react-native';
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
    <View style={styles.container} lightColor='fff' darkColor='#222'>
      <Dropdown
        style={styles.dropdown}
        data={filterOptions}
        labelField="label"
        valueField="value"
        value={selectedFilter}
        onChange={(item) => setSelectedFilter(item.value)}
        placeholder="Select Filter"
        renderLeftIcon={() => (
          <Ionicons name='filter-sharp' size={20} color="#ccc" style={{ marginRight: 8 }} />
        )}
        iconColor='#ccc'
        lightColor="fff"
        darkColor="#222"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    justifyContent: 'center',
    padding: 5,
    height: 40,
    width: 250,
  },
  dropdown: {
    height: '100%',
    width: '90%',
    paddingHorizontal: 10,
  },
});

export default FilterDropdown;
