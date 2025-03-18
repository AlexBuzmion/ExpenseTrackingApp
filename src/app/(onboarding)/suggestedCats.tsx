import React, { useEffect, useState } from 'react';
import { View, Text, InputText } from '@/src/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getSuggestedCategories } from '@/src/constants/SuggestedCategories';
import { StyleSheet, ActivityIndicator, SectionList, TouchableOpacity, Modal, Alert } from 'react-native';
import Colors from '@/src/constants/Colors';
import { useCategories } from '@/store/catStore';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';

interface Recommendation {
    userType: string;
    recommendations: Record<string, string[]>;
}
  
export default function SuggestedCats() {
    const router = useRouter();
	const setFirstTimeUser = useAuthStore((state) => state.setFirstTimeUser);
    const [finalCategories, setFinalCategories] = useState<Record<string, string[]>>({});
    const { answers } = useLocalSearchParams<{ answers: string }>();
    const parsedAnswers = answers ? JSON.parse(answers) : {};
    const [isLoading, setIsLoading] = useState(true);
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
    const saveCategories = useCategories().setCategories;
    // selection state: each category has a checked flag and each subcategory a boolean
    const [selectedCategories, setSelectedCategories] = useState<
      	Record<string, { checked: boolean; subcategories: Record<string, boolean> }>
    >({});
    
    // modal state for adding a new category
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
  
    // modal state for adding a new subcategory
    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [currentCategoryForSub, setCurrentCategoryForSub] = useState('');
  
    // generate recommended categories based on parsed answers.
    const generateCats = (): Recommendation => {
		const suggestedCats: any = getSuggestedCategories(); // assuming this helper exists
		setIsLoading(false);
		if (parsedAnswers["1"] === "A") {
			return {
			userType: "Personal",
			recommendations: suggestedCats.personalCategories,
			};
		} else if (parsedAnswers["1"] === "B") {
			if (parsedAnswers["2"] === "C") {
			return {
				userType: "Business - Real Estate",
				recommendations: suggestedCats.realEstateCategories,
			};
			} else {
			return {
				userType: "Business - Generic",
				recommendations: suggestedCats.genericBusinessCategories,
			};
			}
		} else if (parsedAnswers["1"] === "C") {
			return {
			userType: "Mixed",
			recommendations: {
				...suggestedCats.personalCategories,
				...suggestedCats.genericBusinessCategories,
			},
			};
		}
		return {
			userType: "Custom",
			recommendations: {},
		};
	};
  
    useEffect(() => {
		const rec = generateCats();
		setRecommendation(rec);
    }, []);
  
    useEffect(() => {
		if (recommendation?.recommendations) {
			setFinalCategories(recommendation.recommendations);
			const initialSelections = Object.entries(recommendation.recommendations).reduce(
			(acc, [cat, subcats]) => {
				acc[cat] = {
				checked: true,
				subcategories: subcats.reduce((subAcc, sub) => {
					subAcc[sub] = true;
					return subAcc;
				}, {} as Record<string, boolean>),
				};
				return acc;
			},
			{} as Record<string, { checked: boolean; subcategories: Record<string, boolean> }>
			);
			setSelectedCategories(initialSelections);
		}
    }, [recommendation]);
  
    // toggle an entire category, affecting all its subcategories
    const toggleCategory = (category: string) => {
		setSelectedCategories((prev) => {
			const newState = { ...prev };
			const current = newState[category].checked;
			newState[category].checked = !current;
			Object.keys(newState[category].subcategories).forEach((sub) => {
			newState[category].subcategories[sub] = !current;
			});
			return newState;
		});
    };
  
    // toggle a subcategory; uncheck the category only if none remain checked
    const toggleSubcategory = (category: string, subcat: string) => {
		setSelectedCategories((prev) => {
			const newState = { ...prev };
			newState[category].subcategories[subcat] = !newState[category].subcategories[subcat];
			const anyChecked = Object.values(newState[category].subcategories).some((val) => val);
			newState[category].checked = anyChecked;
			return newState;
		});
    };
  
    // prompt user to add a new category by showing the modal
    const promptAddCategory = () => {
      setNewCategoryName('');
      setShowCategoryModal(true);
    };
  
    // confirm adding a new category using the typed name
    const confirmAddCategory = () => {
		if (newCategoryName.trim() === '') {
			alert("Enter category name");
			return;
		}
		if (selectedCategories[newCategoryName]) {
			alert(`${newCategoryName} already exists!`);
			return;
		}
		setSelectedCategories((prev) => ({
			...prev,
			[newCategoryName]: {
			checked: true,
			subcategories: {},
			},
		}));
		setShowCategoryModal(false);
    };
  
    // prompt user to add a new subcategory by showing the modal
    const promptAddSubcategory = (category: string) => {
		setCurrentCategoryForSub(category);
		setNewSubcategoryName('');
		setShowSubcategoryModal(true);
    };
  
    // confirm adding a new subcategory using the typed name
    const confirmAddSubcategory = () => {
        if (newSubcategoryName.trim() === '') {
            alert("Enter a subcategory name");
            return;
        }
        setSelectedCategories((prev) => {
            const newState = { ...prev };
            if (newState[currentCategoryForSub].subcategories[newSubcategoryName]) {
            alert(`${newSubcategoryName} already exists!`);
            return newState;
            }
            newState[currentCategoryForSub].subcategories[newSubcategoryName] = true;
            newState[currentCategoryForSub].checked = true;
            return newState;
        });
      setShowSubcategoryModal(false);
    };
  
    // process final selections when confirm is pressed
    const handleConfirm = () => {
		const finalSelections: Record<string, string[]> = {};
		Object.entries(selectedCategories).forEach(([cat, info]) => {
			const selectedSubs = Object.entries(info.subcategories)
			.filter(([_, checked]) => checked)
			.map(([sub]) => sub);
			if (selectedSubs.length > 0) {
			finalSelections[cat] = selectedSubs;
			}
		});
      	// use finalSelections as your final categories; JSON.stringify is optional
        Alert.alert(
            `Saving..`,
            `Happy with your selections? `,
            [ 
                { text: "Cancel" }, 
                { text: "Confirm",
                    onPress: async () => {
                        await saveCategories(finalSelections);
						await setFirstTimeUser(false);
                        router.replace('/(signedIn)');
                    }
                },
            ],
        );
      
    };
  
    // prepare sections for the SectionList based on the selection state
    const sections = Object.entries(selectedCategories).map(([cat, info]) => ({
		title: cat,
		data: Object.entries(info.subcategories).map(([sub, checked]) => ({
			name: sub,
			checked,
			category: cat,
		})),
		checked: info.checked,
    }));
  
    return (
      <View style={{ flex: 1, padding: 16 }}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 10 }}>
              Here's a list of suggested categories for you:
            </Text>
            {recommendation ? (
              <SectionList
                sections={sections}
                keyExtractor={(item, index) => index.toString()}
                renderSectionHeader={({ section: { title, checked } }) => (
                  <TouchableOpacity onPress={() => toggleCategory(title)}>
                    <View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginTop: 10,
							borderWidth: 1,
							padding: 5,
							marginBottom: 5,
							backgroundColor: checked ? '#ccc' : 'lightgray',
						}}
                    >
						<Text style={{ fontWeight: 'bold', color: checked ? 'black' : 'lightgray' }}>
								{title}
						</Text>
						{checked ? (
								<Ionicons name="checkbox" size={24} color={checked ? 'green' : 'lightgray'} />
							) : (
								<Ionicons name="checkbox-outline" size={24} color={checked ? 'green' : 'lightgray'} />
							)
						}
                    </View>
                  </TouchableOpacity>
                )}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => toggleSubcategory(item.category, item.name)}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginLeft: 30,
                            borderWidth: 1,
                            borderColor: 'gray',
                            padding: 5,
                            marginBottom: 5,
                            backgroundColor: item.checked ? 'white' : '#f0f0f0',
                        }}
                    >
                        <Text style={{ color: item.checked ? 'black' : 'lightgray' }}>{item.name}</Text>
                        {item.checked ? (
                                <Ionicons name="checkbox" size={24} color={item.checked ? 'green' : 'lightgray'} />
                            ) : (
                                <Ionicons name="checkbox-outline" size={24} color={item.checked ? 'green' : 'lightgray'} />
                            )
                        }
                      
                    </View>
                  </TouchableOpacity>
                )}
                // footer for each section to allow adding a new subcategory
                renderSectionFooter={({ section: { title } }) => (
                  <TouchableOpacity onPress={() => promptAddSubcategory(title)} style={{ marginLeft: 10, padding: 5 }}>
                    <Text style={{ color: '#ccc' }}>add more subcategory for {title}</Text>
                  </TouchableOpacity>
                )}
                // footer for the entire list to allow adding a new category
                ListFooterComponent={
                  <TouchableOpacity
                    onPress={promptAddCategory}
                    style={{ padding: 10, backgroundColor: '#ccc', alignItems: 'center', marginTop: 10 }}
                  >
                    <Text>Add Category</Text>
                  </TouchableOpacity>
                }
                style={{ flex: 1 }}
              />
            ) : (
              <Text>loading recommendations...</Text>
            )}
			<View style={{ flex: .12, alignItems: 'center', justifyContent: 'center' }}>
				<TouchableOpacity
				onPress={handleConfirm}
				style={styles.button}
				>
				<Text>Confirm Categories</Text>
				</TouchableOpacity>
			</View>
          </>
        )}
  
        {/* Modal for adding a new category */}
        <Modal visible={showCategoryModal} transparent animationType="slide">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                <Text>enter new category name:</Text>
                <InputText
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    placeholder="category name"
                    style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                    <Text style={{ color: 'blue' }}>cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={confirmAddCategory}>
                    <Text style={{ color: 'blue' }}>confirm</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </Modal>
  
        {/* Modal for adding a new subcategory */}
        <Modal visible={showSubcategoryModal} transparent animationType="slide">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                <Text>enter new subcategory name for {currentCategoryForSub}:</Text>
                <InputText
                    value={newSubcategoryName}
                    onChangeText={setNewSubcategoryName}
                    placeholder="subcategory name"
                    style={{ borderWidth: 1, borderColor: 'gray', marginVertical: 10, padding: 5 }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => setShowSubcategoryModal(false)}>
                    <Text style={{ color: 'blue' }}>cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={confirmAddSubcategory}>
                    <Text style={{color: 'blue' }}>confirm</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </Modal>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    button: {
		backgroundColor: '#5a3286',
		borderRadius: 100,
		padding: 15.2,
		
	},
});