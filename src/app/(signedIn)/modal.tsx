import { StatusBar } from 'expo-status-bar';
import { Animated, Keyboard, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import { Text, View, InputText, Dropdown, AnimatedView} from '@/src/components/Themed';

import { useEffect, useMemo, useRef, useState} from 'react';
import { CurrencyInputField } from '../../components/CurrencyInputField';
import { CrossPlatformDatePicker } from '../../components/CrossPlatformDatePicker';
import DropdownComponent from '../../components/DropdownComponent';
import { useEntriesStore } from '@/store/entriesStore';
import { useRouter, Link } from 'expo-router'; // Import Link!
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';
import { useTaxStore } from "@/store/taxStore";

// import { getApp } from "firebase/app";
// import { doc, getDoc, getFirestore } from "firebase/firestore";


export default function ModalScreen() {
	const router = useRouter();
	const listStore = useEntriesStore();
	const { taxRates } = useTaxStore();
	
	// track input values
	const [itemName, setItemName] = useState("");
	const [date, setDate] = useState(new Date());
	const [categorySelected, setCategorySelected] = useState("");
	const [subCategorySelected, setSubCategorySelected] = useState("");
	const [subTotal, setSubTotal] = useState("0.00");
	const [hst, setHst] = useState("0.00");
	const [province, setProvince] = useState("Ontario");

	// track errors (missing fields)
	const [missingFields, setMissingFields] = useState({
		itemName: false,
		categorySelected: false,
		subCategorySelected: false,
	});
	
	// fetchProvTaxRates().then((data: Record<string, { GST: number; HST: number; PST: number }> | undefined) => {
	// 	console.log('data from outside fetchProvTaxRates: ', data)
	// 	useTaxStore().setTaxRates(data || {});
	// }).finally(() => {
	// 	console.log('useTaxStore: ', useTaxStore.getState().taxRates);
	// });
	// get tax rates from Store
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
	const subCategoryBorderAnim = useRef(new Animated.Value(0)).current;

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
			subCategorySelected: !subCategorySelected,
		};
		setMissingFields(newMissingFields);

		if (newMissingFields.itemName) triggerPulseAnimation(itemBorderAnim);
		if (newMissingFields.categorySelected)
			triggerPulseAnimation(categoryBorderAnim);
		if (newMissingFields.subCategorySelected)
			triggerPulseAnimation(subCategoryBorderAnim);

		// if any fields are missing, prevent saving
		if (Object.values(newMissingFields).includes(true)) {
			alert("Please fill out all required fields before saving.");
			return;
		}

		listStore.addExpense({
			name: itemName,
			date: date.toISOString(),
			category: categorySelected,
			subcategory: subCategorySelected,
			subtotal: parseFloat(subTotal) || 0,
			hst: parseFloat(hst) || 0,
			total: parseFloat(getTotal()),
			creationDate: new Date().toISOString(),
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
					onChange={ val => setDate(val)}
					value={date}
				/>

			<DropdownComponent 
				category={categorySelected}
				subcategory={subCategorySelected}
				onCategoryChange={val => setCategorySelected(val) }
				onSubcategoryChange={val => setSubCategorySelected(val)}
			/>
			
			{/* Add Category Button */}
            <Link href="/categoryModal" asChild>
                <TouchableOpacity style={styles.addCategoryButton}>
                    <Text style={styles.addCategoryButtonText}>Edit Categories</Text>
                </TouchableOpacity>
            </Link>
			

			<CurrencyInputField 
				value={subTotal}
				onValidChange={val => {
					setSubTotal(val)
				}}
				inputTitle='Subtotal'
			/>

			<View style={styles.inputWrapper}>
				<CurrencyInputField 
					value={hst.toString()}
					onValidChange={val => setHst(val)}
					inputTitle='Tax'
				/>
			</View>
					
			<View >
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
				<Text style={[styles.currencySymbol]}>Total </Text>
				<Text style={[styles.currencySymbol]}>
					${getTotal()}
				</Text>
			</View>	

				{/* Use a light status bar on iOS to account for the black space above the modal */}
				<StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
				<TouchableOpacity 
					style={[styles.button,{ borderWidth: 1, margin: 10,}]} 
					onPress={() => {trySaveEntry()}}>
					<Text style={styles.saveButtonText}>Save</Text>
				</TouchableOpacity>
			</View>
		</TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 14
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
		width: 'auto',
		height: 45,
		borderWidth: 1, 
		borderColor: '#ccc', 
		borderRadius: 8, 
		paddingHorizontal: 10,
		marginVertical: 10
	},
	inputWrapper: {
		 justifyContent: 'center',
		 marginVertical: 10,
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
	}
});