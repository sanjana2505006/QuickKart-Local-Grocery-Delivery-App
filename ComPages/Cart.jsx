import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Cart({ cartService, orderService, onBack, onCheckoutSuccess }) {
    const [cartItems, setCartItems] = useState(cartService.getCart());
    const [total, setTotal] = useState(cartService.getTotal());

    useEffect(() => {
        const unsubscribe = cartService.subscribe((items) => {
            setCartItems(items);
            setTotal(cartService.getTotal());
        });
        return unsubscribe;
    }, [cartService]);

    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        Alert.alert(
            "Confirm Order",
            `Place order for ₹${total.toFixed(2)}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Place Order",
                    onPress: () => {
                        if (orderService) {
                            orderService.placeOrder(cartItems, total.toFixed(2));
                            cartService.clearCart();
                            Alert.alert("Success", "Order placed successfully!");
                            if (onCheckoutSuccess) {
                                onCheckoutSuccess();
                            }
                        }
                    }
                }
            ]
        );
    };

    if (cartItems.length === 0) {
        return (
            <SafeAreaView style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={80} color="#ccc" />
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <Text style={styles.emptySubText}>Looks like you haven't added anything to your cart yet</Text>
                <TouchableOpacity style={styles.shopButton} onPress={onBack}>
                    <Text style={styles.shopButtonText}>Start Shopping</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <TouchableOpacity onPress={() => cartService.clearCart()} style={styles.clearButton}>
                    <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
                {cartItems.map((item) => (
                    <View key={item.name} style={styles.cartItem}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                        </View>
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.itemWeight}>{item.weight}</Text>
                            <Text style={styles.itemPrice}>{item.price}</Text>
                        </View>
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => cartService.removeItem(item)}
                            >
                                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                            </TouchableOpacity>
                            <View style={styles.quantityControls}>
                                <TouchableOpacity
                                    style={styles.qtyButton}
                                    onPress={() => cartService.decreaseItem(item)}
                                >
                                    <Ionicons name="remove" size={18} color="#1A1A1A" />
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{item.quantity}</Text>
                                <TouchableOpacity
                                    style={[styles.qtyButton, styles.qtyButtonAdd]}
                                    onPress={() => cartService.addItem(item)}
                                >
                                    <Ionicons name="add" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    emptyText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
    },
    shopButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    shopButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
    },
    clearButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#FFF0F0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    cartList: {
        flex: 1,
        padding: 20,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 15,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    itemImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    itemWeight: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#4CAF50',
    },
    actionsContainer: {
        alignItems: 'flex-end',
    },
    deleteButton: {
        padding: 8,
        marginBottom: 8,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 4,
    },
    qtyButton: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    qtyButtonAdd: {
        backgroundColor: '#4CAF50',
    },
    qtyText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: 18,
        color: '#888',
        fontWeight: '600',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    checkoutButton: {
        backgroundColor: '#1A1A1A',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
