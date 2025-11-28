import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartService } from '../services/CartService';

export default function CartScreen({ onClose }) {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const unsub = CartService.subscribe(cart => {
            setItems([...cart]);
            setTotal(CartService.getTotal());
        });
        return unsub;
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.itemRow}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
            </View>
            <View style={styles.qtyContainer}>
                <TouchableOpacity onPress={() => CartService.updateQuantity(item.name, (item.quantity||0) - 1)} style={styles.qtyBtn}>
                    <Ionicons name="remove" size={18} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity || 0}</Text>
                <TouchableOpacity onPress={() => CartService.updateQuantity(item.name, (item.quantity||0) + 1)} style={[styles.qtyBtn, {backgroundColor: '#4CAF50'}]}>
                    <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => CartService.removeItem(item.name)} style={styles.removeBtn}>
                <Ionicons name="trash" size={18} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.title}>Your Cart</Text>
                <View style={{width:40}} />
            </View>

            {items.length === 0 ? (
                <View style={styles.empty}><Text style={styles.emptyText}>Your cart is empty</Text></View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(it) => it.name}
                    renderItem={renderItem}
                    contentContainerStyle={{padding:16}}
                />
            )}

            <View style={styles.footer}>
                <View>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
                </View>
                <View style={styles.footerButtons}>
                    <TouchableOpacity onPress={() => CartService.clearCart()} style={styles.clearBtn}>
                        <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.checkoutBtn} onPress={() => { /* placeholder */ }}>
                        <Text style={styles.checkoutText}>Checkout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex:1, backgroundColor:'#f8f9fa'},
    header: {height:64, flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:12, backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#eee'},
    closeBtn:{padding:6},
    title:{fontSize:20, fontWeight:'700', color:'#1A1A1A'},
    empty:{flex:1, alignItems:'center', justifyContent:'center'},
    emptyText:{color:'#888', fontSize:16},
    itemRow:{flexDirection:'row', alignItems:'center', backgroundColor:'#fff', padding:12, borderRadius:12, marginBottom:12, elevation:2},
    image:{width:56, height:56, borderRadius:8, marginRight:12},
    info:{flex:1},
    name:{fontSize:16, fontWeight:'700', color:'#1A1A1A'},
    price:{color:'#777', marginTop:4},
    qtyContainer:{flexDirection:'row', alignItems:'center', marginRight:8},
    qtyBtn:{width:32, height:32, borderRadius:8, backgroundColor:'#888', alignItems:'center', justifyContent:'center'},
    qtyText:{minWidth:28, textAlign:'center', fontWeight:'700'},
    removeBtn:{width:36, height:36, borderRadius:8, backgroundColor:'#E74C3C', alignItems:'center', justifyContent:'center'},
    footer:{padding:16, borderTopWidth:1, borderTopColor:'#eee', backgroundColor:'#fff', flexDirection:'row', alignItems:'center', justifyContent:'space-between'},
    totalLabel:{color:'#777'},
    totalValue:{fontSize:20, fontWeight:'900'},
    footerButtons:{flexDirection:'row', alignItems:'center'},
    clearBtn:{paddingVertical:8, paddingHorizontal:12, borderRadius:8, marginRight:8, backgroundColor:'#F5F5F5'},
    clearText:{color:'#333', fontWeight:'700'},
    checkoutBtn:{paddingVertical:10, paddingHorizontal:16, borderRadius:12, backgroundColor:'#1A1A1A'},
    checkoutText:{color:'#fff', fontWeight:'800'},
});
