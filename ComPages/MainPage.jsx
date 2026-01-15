import React, { useState } from "react";
import { StyleSheet, Text, View, SectionList, TextInput, Image, TouchableOpacity, ScrollView, Animated, Dimensions, Platform, StatusBar, Modal } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

import OrderHistory from '../components/OrderHistory';
import Heart from './Heart';
import Cart from './Cart';
import Profile from './Profile';

import { CATEGORIES } from "../data/categories";
import { fruitsData } from "../data/fruits";
import { vegetablesData } from "../data/vegetables";
import { dairyData } from "../data/dairy";
import { bakeryData } from "../data/bakery";
import { snacksData } from "../data/snacks";
import { beveragesData } from "../data/beverages";
import { meatData } from "../data/meat";

const GROCERY_DATA = [
    {
        title: "Popular",
        data: [
            ...fruitsData.slice(0, 2),
            ...vegetablesData.slice(0, 2),
            ...dairyData.slice(0, 2),
        ],
    },
    {
        title: "All",
        data: [
            ...fruitsData,
            ...vegetablesData,
            ...dairyData,
            ...bakeryData,
            ...snacksData,
            ...beveragesData,
            ...meatData,
        ],
    },
    {
        title: "Fruits",
        data: fruitsData,
    },
    {
        title: "Vegetables",
        data: vegetablesData,
    },
    {
        title: "Dairy",
        data: dairyData,
    },
    {
        title: "Bakery",
        data: bakeryData,
    },
    {
        title: "Snacks",
        data: snacksData,
    },
    {
        title: "Beverages",
        data: beveragesData,
    },
    {
        title: "Meat",
        data: meatData,
    },
];

export default function MainPage() {
    const insets = useSafeAreaInsets();
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cartItemCount, setCartItemCount] = useState(0);
    const [activeTab, setActiveTab] = useState("Home");
    const [favorites, setFavorites] = useState([]);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(100)).current;

    const [address, setAddress] = useState("123 Main St, Mumbai");
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [tempAddress, setTempAddress] = useState("");

    const showToast = (message, type = "success") => {
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 100,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => setToastVisible(false));
        }, 2000);
    };

    // Subscribe to cart and favorites changes
    React.useEffect(() => {
        loadAddress();
        const unsubscribeCart = CartService.subscribe((cart) => {
            setCartItemCount(CartService.getItemCount());
        });
        const unsubscribeFav = FavoritesService.subscribe((favs) => {
            setFavorites(favs);
        });
        return () => {
            unsubscribeCart();
            unsubscribeFav();
        };
    }, []);

    const loadAddress = async () => {
        try {
            const savedAddress = await AsyncStorage.getItem('userAddress');
            if (savedAddress) {
                setAddress(savedAddress);
            }
        } catch (error) {
            console.log('Error loading address:', error);
        }
    };

    const saveAddress = async () => {
        if (!tempAddress.trim()) return;
        try {
            await AsyncStorage.setItem('userAddress', tempAddress);
            setAddress(tempAddress);
            setShowAddressModal(false);
            showToast("Address updated successfully!");
        } catch (error) {
            console.log('Error saving address:', error);
            showToast("Failed to save address", "error");
        }
    };

    const handleOpenAddressModal = () => {
        setTempAddress(address);
        setShowAddressModal(true);
    };

    const handleRepeatOrder = (items) => {
        CartService.addItems(items);
        setActiveTab("Cart"); // Go to cart to see the added items
    };

    if (activeTab === "Orders") {
        return (
            <OrderHistory
                orderService={OrderService}
                onRepeatOrder={handleRepeatOrder}
                onBack={() => setActiveTab("Home")}
            />
        );
    }

    if (activeTab === "Favorites") {
        return (
            <Heart
                favorites={favorites}
                onRemove={(item) => FavoritesService.removeItem(item)}
                onAddToCart={(item) => CartService.addItem(item)}
                onBack={() => setActiveTab("Home")}
            />
        );
    }

    if (activeTab === "Cart") {
        return (
            <Cart
                cartService={CartService}
                orderService={OrderService}
                onBack={() => setActiveTab("Home")}
                onCheckoutSuccess={() => {
                    setActiveTab("Home");
                    setShowOrderHistory(true);
                }}
            />
        );
    }

    if (activeTab === "Profile") {
        return (
            <Profile
                onBack={() => setActiveTab("Home")}
            />
        );
    }

    const filteredData = GROCERY_DATA.map((section) => {
        // Filter by selected category first
        if (selectedCategory !== "All" && section.title !== selectedCategory) {
            return null;
        }

        // Then filter by search text within the selected category's data
        const filteredItems = section.data.filter((item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );

        if (filteredItems.length === 0) return null;

        return { ...section, data: filteredItems };
    }).filter((section) => section !== null);

    const renderItem = (item) => {
        const isFavorite = favorites.some(fav => fav.name === item.name);
        return (
            <View key={item.name} style={styles.itemCard}>
                <View style={styles.cardHeader}>
                    {item.discount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{item.discount}</Text>
                        </View>
                    )}
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => {
                        const isAdded = FavoritesService.toggleFavorite(item);
                        if (isAdded) {
                            showToast("Added to favorites", "success");
                        } else {
                            showToast("Removed from favorites", "error");
                        }
                    }}>
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={20}
                            color="#FF6B6B"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.itemImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                </View>

                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.itemPrice}>{item.price}</Text>
                        <Text style={styles.itemWeight}>for {item.weight}</Text>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={() => CartService.addItem(item)}>
                        <Ionicons name="add" size={24} color="#4CAF50" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const BottomNavBar = () => {
        const tabs = [
            { name: 'Cart', icon: 'cart', id: 'Cart', badge: cartItemCount },
            { name: 'Profile', icon: 'person', id: 'Profile' },
            { name: 'Home', icon: 'home', id: 'Home' },
            { name: 'Favorites', icon: 'heart', id: 'Favorites' },
            { name: 'Orders', icon: 'receipt', id: 'Orders' },
        ];

        return (
            <View style={styles.bottomNavContainer}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.navItem, isActive && styles.activeNavItem]}
                            onPress={() => setActiveTab(tab.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.navItemContent}>
                                <Ionicons
                                    name={isActive ? tab.icon : `${tab.icon}-outline`}
                                    size={28}
                                    color={isActive ? "#4CAF50" : "#000"}
                                />
                                {tab.badge > 0 && (
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>{tab.badge}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const renderAddressModal = () => (
        <Modal
            transparent
            visible={showAddressModal}
            animationType="fade"
            onRequestClose={() => setShowAddressModal(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowAddressModal(false)}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Delivery Address</Text>
                        <TouchableOpacity onPress={() => setShowAddressModal(false)} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalBody}>
                        <Text style={styles.inputLabel}>Enter full address</Text>
                        <TextInput
                            style={styles.addressInput}
                            placeholder="e.g. 123 Main St, Apartment 4B"
                            value={tempAddress}
                            onChangeText={setTempAddress}
                            multiline
                            numberOfLines={3}
                            autoFocus
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={saveAddress}>
                        <Text style={styles.saveButtonText}>Update Delivery Location</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const ListHeader = () => (
        <View>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
            >
                {CATEGORIES.map((cat, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.categoryCard,
                            { backgroundColor: cat.color },
                            selectedCategory === cat.name && styles.selectedCategoryCard,
                        ]}
                        onPress={() => setSelectedCategory(cat.name)}
                    >
                        <View style={styles.categoryIconWrapper}>
                            <Ionicons name={cat.icon} size={32} color="#1A1A1A" />
                        </View>
                        <Text style={styles.categoryName}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View >
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            {/* Top Header */}
            <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 20) }]}>
                <View style={styles.headerLeft}>
                    <Text style={styles.deliverToLabel}>Deliver to</Text>
                    <TouchableOpacity style={styles.locationContainer} onPress={handleOpenAddressModal}>
                        <Text style={styles.locationValue} numberOfLines={1}>{address}</Text>
                        <Ionicons name="chevron-down" size={14} color="#4CAF50" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => setActiveTab("Profile")}
                >
                    <Ionicons name="person-circle-outline" size={32} color="#1A1A1A" />
                </TouchableOpacity>
            </View>

            {renderAddressModal()}


            {/* Content */}
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {selectedCategory === "All" ? (
                    <>
                        {/* Banner Carousel */}
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            style={styles.bannerScroll}
                        >
                            <View style={styles.bannerContainer}>
                                <Image
                                    source={{ uri: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMHBob3RvfGVufDB8fDB8fHww" }}
                                    style={styles.bannerImage}
                                />
                                <View style={styles.bannerOverlay}>
                                    <Text style={styles.bannerText}>Fresh Groceries</Text>
                                    <Text style={styles.bannerSubtext}>Delivered in 10 mins</Text>
                                </View>
                            </View>
                            <View style={styles.bannerContainer}>
                                <Image
                                    source={{ uri: "https://plus.unsplash.com/premium_photo-1673590981770-307f61735af8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGZvb2QlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D" }}
                                    style={styles.bannerImage}
                                />
                                <View style={styles.bannerOverlay}>
                                    <Text style={styles.bannerText}>Quality Food</Text>
                                    <Text style={styles.bannerSubtext}>Best prices guaranteed</Text>
                                </View>
                            </View>
                            <View style={styles.bannerContainer}>
                                <Image
                                    source={{ uri: "https://plus.unsplash.com/premium_photo-1671379041175-782d15092945?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJ1aXRzfGVufDB8fDB8fHww" }}
                                    style={styles.bannerImage}
                                />
                                <View style={styles.bannerOverlay}>
                                    <Text style={styles.bannerText}>Fresh Fruits</Text>
                                    <Text style={styles.bannerSubtext}>Organic & healthy</Text>
                                </View>
                            </View>
                            <View style={styles.bannerContainer}>
                                <Image
                                    source={{ uri: "https://plus.unsplash.com/premium_photo-1664640733890-17acaf0529a5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fHZlZ2V0YWJsZXN8ZW58MHx8MHx8fDA%3D" }}
                                    style={styles.bannerImage}
                                />
                                <View style={styles.bannerOverlay}>
                                    <Text style={styles.bannerText}>Farm Fresh Vegetables</Text>
                                    <Text style={styles.bannerSubtext}>Straight from the farm</Text>
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Grocery & Kitchen</Text>
                            <View style={styles.categoryGrid}>
                                {CATEGORIES.map((cat, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.gridCategoryCard}
                                        onPress={() => setSelectedCategory(cat.name)}
                                    >
                                        <View style={[styles.gridIconContainer, { backgroundColor: cat.color }]}>
                                            <Ionicons name={cat.icon} size={30} color="#1A1A1A" />
                                        </View>
                                        <Text style={styles.gridCategoryName}>{cat.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Show Popular items or other sections for "All" view if desired, 
                            or just the categories as the main entry point. 
                            Let's show "Popular" below the categories for quick access. */}
                        {GROCERY_DATA.map((section) => (
                            <View key={section.title} style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <View style={styles.gridContainer}>
                                    {section.data.map((item) => renderItem(item))}
                                </View>
                            </View>
                        ))}
                    </>
                ) : (
                    <>
                        <ListHeader />
                        {filteredData.map((section) => (
                            <View key={section.title} style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <View style={styles.gridContainer}>
                                    {section.data.map((item) => renderItem(item))}
                                </View>
                            </View>
                        ))}
                        {filteredData.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>No items found in {selectedCategory}</Text>
                                <TouchableOpacity onPress={() => setSelectedCategory("All")} style={styles.backButton}>
                                    <Text style={styles.backButtonText}>Browse all categories</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            {/* Bottom Navigation */}
            <BottomNavBar />

            {/* Toast Notification */}
            {toastVisible && (
                <Animated.View
                    style={[
                        styles.toastContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={[styles.toastIconContainer, toastType === "error" ? styles.toastError : styles.toastSuccess]}>
                        <Ionicons
                            name={toastType === "error" ? "heart-dislike" : "heart"}
                            size={20}
                            color={toastType === "error" ? "#fff" : "#FF6B6B"}
                        />
                    </View>
                    <View style={styles.toastContent}>
                        <Text style={styles.toastTitle}>
                            {toastType === "error" ? "Removed" : "Success"}
                        </Text>
                        <Text style={styles.toastText}>{toastMessage}</Text>
                    </View>
                </Animated.View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    topHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    headerLeft: {
        flex: 1,
    },
    deliverToLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    locationValue: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1A1A1A",
        marginRight: 4,
    },
    profileButton: {
        padding: 4,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    searchInner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F6F8",
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 48,
        borderWidth: 1,
        borderColor: "#EBEBEB",
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#1A1A1A",
        paddingHorizontal: 10,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Extra padding for bottom nav
    },
    sectionContainer: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 15,
    },
    categoriesScroll: {
        marginBottom: 20,
    },
    categoryCard: {
        width: 105,
        height: 120,
        marginRight: 16,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },
    selectedCategoryCard: {
        borderWidth: 2,
        borderColor: "#4CAF50",
        shadowOpacity: 0.15,
        elevation: 6,
    },
    categoryIconWrapper: {
        marginBottom: 10,
    },
    categoryImage: {
        width: 40,
        height: 40,
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1A1A1A",
        textAlign: "center",
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    itemCard: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    itemImageContainer: {
        width: "100%",
        height: 120,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    itemImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 12,
    },
    itemName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1A1A1A",
        flex: 1,
        marginRight: 4,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "800",
        color: "#1A1A1A",
    },
    itemWeight: {
        fontSize: 12,
        color: "#888",
        fontWeight: "500",
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: "#F0F9F4", // Light green background
        justifyContent: "center",
        alignItems: "center",
    },
    bottomNavContainer: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: "#fff",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    navItem: {
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
    },
    activeNavItem: {
        backgroundColor: "#E8F5E9",
        borderRadius: 30, // Circular when no text
        width: 50,
        height: 50,
        paddingHorizontal: 0,
        paddingVertical: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navItemContent: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    badgeContainer: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    categoryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    gridCategoryCard: {
        width: "23%", // 4 items per row approx
        alignItems: "center",
        marginBottom: 20,
    },
    gridIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    gridIcon: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
    gridCategoryName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
        lineHeight: 16,
    },
    emptyState: {
        alignItems: "center",
        marginTop: 50,
    },
    emptyStateText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    backButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#4CAF50",
        borderRadius: 20,
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    bannerScroll: {
        marginVertical: 20,
        marginHorizontal: -20,
        paddingLeft: 20,
    },
    bannerContainer: {
        width: 350,
        marginHorizontal: 10,
        borderRadius: 20,
        overflow: 'hidden',
        height: 180,
        backgroundColor: '#FFF0F0',
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    bannerOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    bannerText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    bannerSubtext: {
        fontSize: 14,
        color: '#E8F5E9',
        fontWeight: '600',
    },
    toastContainer: {
        position: 'absolute',
        bottom: 110,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 1000,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    toastIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    toastSuccess: {
        backgroundColor: '#FFF0F0',
    },
    toastError: {
        backgroundColor: '#FF6B6B',
    },
    toastContent: {
        flex: 1,
    },
    toastTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    toastText: {
        color: '#666',
        fontSize: 13,
        fontWeight: '500',
    },
    // Address Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 10,
    },
    addressInput: {
        backgroundColor: '#F5F6F8',
        borderRadius: 12,
        padding: 15,
        fontSize: 15,
        color: '#1A1A1A',
        minHeight: 80,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

// Cart Service - Easy integration point for cart and checkout features
class CartServiceImpl {
    constructor() {
        this.cart = [];
        this.listeners = [];
    }

    // Add items to cart (for repeat orders)
    addItems(items) {
        items.forEach(item => {
            const existingItem = this.cart.find(cartItem => cartItem.name === item.name);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                this.cart.push({ ...item });
            }
        });
        this.notifyListeners();
    }

    // Add single item to cart
    addItem(item) {
        const existingItem = this.cart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }
        this.notifyListeners();
    }

    // Decrease item quantity
    decreaseItem(item) {
        const existingItem = this.cart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                this.cart = this.cart.filter(cartItem => cartItem.name !== item.name);
            }
            this.notifyListeners();
        }
    }

    // Remove item completely
    removeItem(item) {
        this.cart = this.cart.filter(cartItem => cartItem.name !== item.name);
        this.notifyListeners();
    }

    // Get cart items
    getCart() {
        return this.cart;
    }

    // Get cart total
    getTotal() {
        return this.cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
            return total + (price * item.quantity);
        }, 0);
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.notifyListeners();
    }

    // Subscribe to cart changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners of cart changes
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.cart));
    }

    // Get cart item count
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }
}

export const CartService = new CartServiceImpl();

// Favorites Service
class FavoritesServiceImpl {
    constructor() {
        this.favorites = [];
        this.listeners = [];
    }

    toggleFavorite(item) {
        const index = this.favorites.findIndex(fav => fav.name === item.name);
        let added = false;
        if (index > -1) {
            this.favorites.splice(index, 1);
            added = false;
        } else {
            this.favorites.push(item);
            added = true;
        }
        this.notifyListeners();
        return added;
    }

    removeItem(item) {
        const index = this.favorites.findIndex(fav => fav.name === item.name);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.notifyListeners();
        }
    }

    getFavorites() {
        return this.favorites;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener([...this.favorites]));
    }
}

export const FavoritesService = new FavoritesServiceImpl();

// Order Service
class OrderServiceImpl {
    constructor() {
        this.orders = [
            {
                id: "ORD001",
                date: "2024-01-15",
                status: "Delivered",
                total: "₹48.50",
                items: [
                    { name: "Fresh Apples", price: "₹12.00", quantity: 1, image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400" },
                    { name: "Organic Milk", price: "₹6.50", quantity: 2, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400" }
                ],
                deliveryTime: "8 mins",
                deliveryAddress: "123 Main St, Apartment 4B, Mumbai",
            }
        ];
        this.listeners = [];
    }

    placeOrder(items, total, address = "123 Main St, Apartment 4B, Mumbai", payment = "Cash on Delivery") {
        const newOrder = {
            id: `ORD${Math.floor(Math.random() * 10000)}`,
            date: new Date().toISOString().split('T')[0],
            status: "Pending",
            total: `₹${total}`,
            items: [...items],
            deliveryTime: "Calculating...",
            deliveryAddress: address,
            paymentMethod: payment
        };

        this.orders.unshift(newOrder);
        this.notifyListeners();
        this.simulateOrderProgress(newOrder.id);
        return newOrder;
    }

    simulateOrderProgress(orderId) {
        const stages = ["Accepted", "Out for Delivery", "Delivered"];
        let currentStage = 0;

        const interval = setInterval(() => {
            if (currentStage >= stages.length) {
                clearInterval(interval);
                return;
            }

            this.updateStatus(orderId, stages[currentStage]);
            currentStage++;
        }, 5000); // Update every 5 seconds for demo
    }

    updateStatus(orderId, status) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            if (status === "Delivered") {
                order.deliveryTime = "Just now";
            }
            this.notifyListeners();
        }
    }

    getOrders() {
        return this.orders;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener([...this.orders]));
    }
}

export const OrderService = new OrderServiceImpl();