import { StatusBar } from 'expo-status-bar';
import { Animated, Keyboard, Platform, StyleSheet, TouchableWithoutFeedback, Alert, ScrollView } from 'react-native';

import { Text, View, InputText, Dropdown, AnimatedView } from '@/src/components/Themed';

import { useEffect, useRef, useState } from 'react';
import { CurrencyInputField } from '../../components/CurrencyInputField';
import { CrossPlatformDatePicker } from '../../components/CrossPlatformDatePicker';
import DropdownComponent from '../../components/DropdownComponent';
import { useEntriesStore } from '@/store/entriesStore';
import { useRouter } from 'expo-router'; // Import Link!
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';
import { useTaxStore } from "@/store/taxStore";
import { useCategories } from '@/store/catStore';
import CustomButton from '@/src/components/CustomButton';
import { InputTextField } from '@/src/components/InputTextField';

export default function ModalScreen() {

	const router = useRouter();
	const listStore = useEntriesStore();
	const { taxRates } = useTaxStore();

	// call init categories on mount
	const initCats = useCategories((state) => state.initCategories);
	useEffect(() => {
		initCats();
	}, []);

	// track input values
	const [itemName, setItemName] = useState("");
	const [date, setDate] = useState(new Date());
	const [categorySelected, setCategorySelected] = useState("");
	const [subCategorySelected, setSubCategorySelected] = useState("");
	const [subTotal, setSubTotal] = useState("0.00");
	const [hst, setHst] = useState("0.00");
	const [province, setProvince] = useState("ON");
	const [itemNote, setItemNote] = useState("");

	// track errors (missing fields)
	const [missingFields, setMissingFields] = useState({
		itemName: false,
		categorySelected: false,
	});

	const provinceTax = taxRates[province] || { GST: 0, HST: 0, PST: 0 };
	const totalTaxRate = provinceTax.GST + provinceTax.HST + provinceTax.PST;

	// Generate province list dynamically from taxRates
	const provinceList = Object.keys(taxRates).map(prov => ({
		label: prov,
		value: prov
	}));

	// function to calculate tax
	function calculateTax(subtotal: string) {
		const parsedSubTotal = parseFloat(subtotal) || 0;  // ensure it's a number
		return (parsedSubTotal * totalTaxRate).toFixed(2);
	}

	// automatically update tax when subtotal or province changes
	useEffect(() => {
		setHst(calculateTax(subTotal));  // update `hst` after `subTotal` changes
	}, [subTotal, province]);

	// pulse animation refs
	const itemBorderAnim = useRef(new Animated.Value(0)).current;
	const categoryBorderAnim = useRef(new Animated.Value(0)).current;

	// pulse border effect
	function triggerPulseAnimation(animRef: Animated.Value) {
		Animated.sequence([
			Animated.timing(animRef, {
				toValue: 2,
				duration: 500,
				useNativeDriver: false,
			}),
			Animated.timing(animRef, {
				toValue: 0,
				duration: 500,
				useNativeDriver: false,
			}),
		]).start();
	}

	function trySaveEntry() {
		const newMissingFields = {
			itemName: !itemName,
			categorySelected: !categorySelected,
		};
		setMissingFields(newMissingFields);

		if (newMissingFields.itemName)
			triggerPulseAnimation(itemBorderAnim);
		if (newMissingFields.categorySelected)
			triggerPulseAnimation(categoryBorderAnim);

		// if any fields are missing, prevent saving
		if (Object.values(newMissingFields).includes(true)) {
			let alertMessage = '';

			if (newMissingFields.itemName) {
				alertMessage += "Item name is required\n";
			}
			if (newMissingFields.categorySelected) {
				alertMessage += "Category is required\n";
			}

			Alert.alert(
				"Missing Information", // Or a more generic title
				alertMessage.trim() // Remove trailing newline
			);
			return;
		}

		console.log("Saving entry...");
		listStore.addEntry({
			name: itemName,
			date: date.toISOString(),
			category: categorySelected,
			subcategory: subCategorySelected,
			subtotal: parseFloat(subTotal) || 0,
			hst: parseFloat(hst) || 0,
			total: parseFloat(getTotal()),
			creationDate: new Date().toISOString(),
			note: itemNote
		});
		router.back();
	}

	function getTotal() {
		const total = parseFloat(hst) + parseFloat(subTotal);
		return total.toFixed(2);
	}
	return (
		<TouchableWithoutFeedback
			onPress={Platform.OS !== 'web' ? () => Keyboard.dismiss() : undefined}
			style={styles.container}
		>
			<ScrollView style={[styles.container]}>

				<View style={{flex: 1, marginTop: 50}} lightColor='fff' darkColor='#222'>
					
					<InputTextField
						headerTitle='Item:'
						value={itemName}
						onChangeText={val => setItemName(val)}
						placeholder='Enter item name'
					/>

					<View style={styles.marginHorizontal} lightColor='fff' darkColor='#222'>
						<Text style={styles.title}>Transaction Date: </Text>
						<CrossPlatformDatePicker
							onChange={val => setDate(val)}
							value={date}
						/>
					</View>

					<View style={styles.marginHorizontal} lightColor='fff' darkColor='#222'>
						<DropdownComponent
							category={categorySelected}
							subcategory={subCategorySelected}
							onCategoryChange={val => setCategorySelected(val)}
							onSubcategoryChange={val => setSubCategorySelected(val)}
						/>
					</View>
					
					<View>
						<CurrencyInputField
							inputTitle='Subtotal:'
							// value={'$ ' + subTotal}
							onValidChange={val => {setSubTotal(val)}}
						/>
					</View>

					<View style={[{flexDirection: 'row', alignItems: 'flex-end', marginHorizontal: '2.5%'}]}>
						<View style={{flex: .74, }}>
							<CurrencyInputField
								value={hst.toString()}
								onValidChange={val => setHst(val)}
								inputTitle='Tax: '
							/>
						</View>
						<View style={[styles.provinceDropdownContainer, {flex: .2,}]} lightColor="#fff" darkColor="#222">
							<Dropdown
								data={provinceList}
								labelField="label"
								valueField="value"
								placeholder="Province"
								value={province}
								onChange={item => setProvince(item.value)}
							/>
						</View>
					</View>

					<View style={styles.inputFieldContainer} lightColor="#fff" darkColor="#222">
						<Text style={[styles.currencySymbol, {fontWeight: 'bold'}]}>Total: </Text>
						<Text style={[styles.currencySymbol]}>
							$ {getTotal()}
						</Text>
					</View>

					<InputTextField
						headerTitle='Note: '
						value={itemNote}
						onChangeText={val => setItemNote(val)}
						placeholder='Enter notes'
					/>

					{/* Use a light status bar on iOS to account for the black space above the modal */}
					<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
					<CustomButton
						title='Save'
						onPressFunc={trySaveEntry}
						variant="primary"
					/>

					<CustomButton
						title='Cancel'
						onPressFunc={() => router.back()}
						variant="secondary"
					/>
				</View>
			</ScrollView>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//padding: 14,
		//marginTop: 40
	},
	title: {
		fontSize: 16,
		fontWeight: '500'
	},
	marginHorizontal: {
		marginHorizontal: '8%'
	},
	inputFieldContainer: {
		marginLeft: '8%',
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#ccc',
		borderWidth: 1.5,
		borderRadius: 8,
		paddingHorizontal: 10,
		maxWidth: '84%',
		height: Platform.OS === 'ios' ? 60 : 50,
		marginVertical: 10,
		marginHorizontal: 18
	},
	currencySymbol: {
		fontSize: 16,
	},
	provinceDropdownContainer: {
		height: Platform.OS === 'ios' ? 60 : 50,
		borderColor: '#ccc',
		borderWidth: 1.5,
		borderRadius: 8,
		justifyContent: 'center',
		padding: 5,
		marginBottom: '1.4%'
	},
});