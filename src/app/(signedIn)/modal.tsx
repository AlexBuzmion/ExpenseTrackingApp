import { StatusBar } from 'expo-status-bar';
import { Animated, Keyboard, Platform, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';

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
	const [province, setProvince] = useState("Ontario");
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
			<View style={[styles.container]}>
				<AnimatedView
					style={[styles.inputFieldContainer,
					{
						borderColor: itemBorderAnim.interpolate({
							inputRange: [0, 2],
							outputRange: ['#ccc', 'red'],
						}),
						borderWidth: missingFields.itemName ? 2 : 1,
					},
					]}
					lightColor="#fff"  // Set light/dark colors
					darkColor="#222"
				>

					<Text style={{ marginRight: 10, fontSize: 16 }}>Item:</Text>
					<InputText
						style={styles.inputField}
						onChangeText={val => setItemName(val)}
						placeholder="Enter item name"
						placeholderTextColor="#888"
					/>
				</AnimatedView>

				<View style={styles.separator} lightColor="#fff" darkColor="#222" />
				<CrossPlatformDatePicker
					onChange={val => setDate(val)}
					value={date}
				/>
				
				<DropdownComponent
					category={categorySelected}
					subcategory={subCategorySelected}
					onCategoryChange={val => setCategorySelected(val)}
					onSubcategoryChange={val => setSubCategorySelected(val)}
				/>

				<View style={styles.inputWrapper}>
					<CurrencyInputField
						value={subTotal}
						onValidChange={val => {
							setSubTotal(val)
						}}
						inputTitle='Subtotal'
					/>
				</View>

				<View style={styles.inputWrapper}>
					<CurrencyInputField
						value={hst.toString()}
						onValidChange={val => setHst(val)}
						inputTitle='Tax'
					/>
				</View>

				<View style={styles.provinceDropdownContainer} lightColor="#fff" darkColor="#222">
					<Dropdown
						style={styles.provinceDropdown}
						data={provinceList}
						labelField="label"
						valueField="value"
						placeholder="Select Province"
						value={province}
						onChange={item => setProvince(item.value)}
						renderLeftIcon={() => (
							<Ionicons name="filter" size={20} color="#ccc" style={{ marginRight: 8 }} />
						)}
						iconColor="#ccc"
						lightColor="#fff"
						darkColor="#222"
					/>
				</View>

				<View style={styles.inputFieldContainer} lightColor="#fff" darkColor="#222">
					<Text style={[styles.currencySymbol]}>TOTAL: </Text>
					<Text style={[styles.currencySymbol]}>
						$ {getTotal()}
					</Text>
				</View>

				<View style={[styles.inputFieldContainer, { height: 100, alignItems: 'flex-start' }]} lightColor='#fff' darkColor='#222'>
					<Text style={{ marginRight: 10, fontSize: 16 }}>Note:</Text>
					<InputText
						style={[styles.inputField, { textAlignVertical: 'top' }]}
						onChangeText={val => setItemNote(val)}
						placeholder="Enter notes"
						placeholderTextColor="#888"
					/>
				</View>

				{/* Use a light status bar on iOS to account for the black space above the modal */}
				<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
				<CustomButton
					title='Save'
					onPressFunc={trySaveEntry}
					variant="primary"
					width={150}
					height={60}
					borderWidth={1}
					margin={10}
				/>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 14,
		marginTop: 40
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 10,
		height: 1,
		width: '100%',
	},
	inputField: {
		flex: 1,
		fontSize: 16,
		paddingVertical: 10,
		paddingHorizontal: 8,
		height: '100%'
	},
	inputFieldContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 10,
		maxWidth: '100%',
		height: 50,
		marginVertical: 10
	},
	currencySymbol: {
		fontSize: 16,

	},
	button: {
		backgroundColor: Colors.light.tint,
		borderRadius: 20,
		width: 100,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center'
	},
	provinceDropdown: {
		height: '100%',
	},
	provinceDropdownContainer: {
		height: 45,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 8,
		justifyContent: 'center',
		padding: 5,
		marginTop: 10
	},
	inputWrapper: {
		justifyContent: 'center',
		marginTop: 10,
	},
	addCategoryButton: {
		backgroundColor: Colors.light.tint,
		borderRadius: 20,
		width: 120,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		marginVertical: 10,
	},
	addCategoryButtonText: {
		color: Colors.dark.tint,
		fontWeight: 'bold',
	},
	saveButtonText: {
		color: Colors.dark.tint,
		fontSize: 16,
		fontWeight: 'bold',
	},
});