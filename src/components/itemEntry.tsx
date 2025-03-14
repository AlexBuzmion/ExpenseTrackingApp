import React from "react";
import { View, Text } from "./Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { Link } from "expo-router";

export default ItemEntry; 

type Item = {
    name?: string,
    date?: string, 
    category?: string, 
    subcategory?: string, 
    subtotal?: number, 
    hst?: number, 
    total?: number
    id?: string
}

type ItemEntryProps = {
    item: Item
}

function ItemEntry({item}: ItemEntryProps) {
    
    return (
        <Link href={`/${item.id}`} asChild>
            <TouchableOpacity style={styles.mainContainer} >
                <View style={styles.leftContainer} lightColor="#fff" darkColor='#222'>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>    
                </View>
                <View style={styles.rightContainer} lightColor="#fff" darkColor='#222'>
                    <Text style={styles.itemTotal}>- ${item.total}</Text>    
                </View>
            </TouchableOpacity>
        </Link>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        margin: 5,
        padding: 5,
        justifyContent: 'space-between'
    },
    itemName: {
        fontSize: 16, 
        fontWeight: 500,
    },
    itemCategory: {
        color: 'gray'  
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
        gap: 5,
    }, 
    rightContainer: {
        flex: .3,
        alignItems: 'flex-end',
    },
    itemTotal: {
        fontSize: 16,
    }
});