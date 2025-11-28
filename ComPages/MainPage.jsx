import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import OrderHistory from '../components/OrderHistory';

const GROCERY_DATA = [
    {
        title: "Popular",
        data: [
            {
                name: "Avocado",
                price: "₹120",
                weight: "each",
                image: "https://placehold.co/150/90EE90/FFFFFF?text=Avocado",
            },
            {
                name: "Bananas",
                price: "₹60",
                weight: "dozen",
                image: "https://placehold.co/150/FFD93D/FFFFFF?text=Banana",
            },
            {
                name: "Milk",
                price: "₹70",
                weight: "1 L",
                image: "https://placehold.co/150/74B9FF/FFFFFF?text=Milk",
            },
            {
                name: "Bread",
                price: "₹50",
                weight: "loaf",
                image: "https://placehold.co/150/F5CBA7/FFFFFF?text=Bread",
            },
        ],
    },
    {
        title: "Fruits",
        data: [
            {
                name: "Apples",
                price: "₹180",
                weight: "1 kg",
                image: "https://placehold.co/150/FF6B6B/FFFFFF?text=Apple",
            },
            {
                name: "Oranges",
                price: "₹150",
                weight: "1 kg",
                image: "https://placehold.co/150/FF9F43/FFFFFF?text=Orange",
            },
            {
                name: "Grapes",
                price: "₹120",
                weight: "500g",
                image: "https://placehold.co/150/6C5CE7/FFFFFF?text=Grape",
            },
            {
                name: "Berries",
                price: "₹300",
                weight: "pack",
                image: "https://placehold.co/150/E84393/FFFFFF?text=Berry",
            },
        ],
    },
    {
        title: "Vegetables",
        data: [
            {
                name: "Carrots",
                price: "₹60",
                weight: "1 kg",
                image: "https://placehold.co/150/E17055/FFFFFF?text=Carrot",
            },
            {
                name: "Broccoli",
                price: "₹80",
                weight: "head",
                image: "https://placehold.co/150/00B894/FFFFFF?text=Broccoli",
            },
            {
                name: "Spinach",
                price: "₹40",
                weight: "bunch",
                image: "https://placehold.co/150/55EFC4/FFFFFF?text=Spinach",
            },
            {
                name: "Potatoes",
                price: "₹50",
                weight: "1 kg",
                image: "https://placehold.co/150/B2BEC3/FFFFFF?text=Potato",
            },
        ],
    },
    {
        title: "Dairy & Eggs",
        data: [
            {
                name: "Milk",
                price: "₹70",
                weight: "1 L",
                image: "https://placehold.co/150/74B9FF/FFFFFF?text=Milk",
            },
            {
                name: "Cheese",
                price: "₹250",
                weight: "block",
                image: "https://placehold.co/150/FAB1A0/FFFFFF?text=Cheese",
            },
            {
                name: "Yogurt",
                price: "₹40",
                weight: "cup",
                image: "https://placehold.co/150/A29BFE/FFFFFF?text=Yogurt",
            },
            {
                name: "Eggs",
                price: "₹90",
                weight: "dozen",
                image: "https://placehold.co/150/FFEAA7/FFFFFF?text=Eggs",
            },
        ],
    },
    {
        title: "Bakery",
        data: [
            {
                name: "Bread",
                price: "₹50",
                weight: "loaf",
                image: "https://placehold.co/150/F5CBA7/FFFFFF?text=Bread",
            },
            {
                name: "Bagels",
                price: "₹150",
                weight: "6 pack",
                image: "https://placehold.co/150/E67E22/FFFFFF?text=Bagel",
            },
            {
                name: "Croissants",
                price: "₹200",
                weight: "4 pack",
                image: "https://placehold.co/150/D35400/FFFFFF?text=Croissant",
            },
        ],
    },
    {
        title: "Snacks",
        data: [
            {
                name: "Chips",
                price: "₹40",
                weight: "bag",
                image: "https://placehold.co/150/FF7675/FFFFFF?text=Chips",
            },
            {
                name: "Popcorn",
                price: "₹60",
                weight: "bag",
                image: "https://placehold.co/150/FDCB6E/FFFFFF?text=Popcorn",
            },
            {
                name: "Cookies",
                price: "₹100",
                weight: "pack",
                image: "https://placehold.co/150/6C5CE7/FFFFFF?text=Cookie",
            },
        ],
    },
    {
        title: "Beverages",
        data: [
            {
                name: "Orange Juice",
                price: "₹150",
                weight: "1 L",
                image: "https://placehold.co/150/FFA502/FFFFFF?text=Juice",
            },
            {
                name: "Soda",
                price: "₹90",
                weight: "2 L",
                image: "https://placehold.co/150/FF6348/FFFFFF?text=Soda",
            },
            {
                name: "Water",
                price: "₹40",
                weight: "1 L",
                image: "https://placehold.co/150/74B9FF/FFFFFF?text=Water",
            },
        ],
    },
];

const CATEGORIES = [
    {
        name: "All",
        image: "https://placehold.co/100/95a5a6/FFFFFF?text=All",
        color: "#F2F3F4",
    },
    {
        name: "Popular",
        image: "https://placehold.co/100/f39c12/FFFFFF?text=Pop",
        color: "#FEF5E7",
    },
    {
        name: "Fruits",
        image: "https://placehold.co/100/e74c3c/FFFFFF?text=F",
        color: "#FDEDEC",
    },
    {
        name: "Vegetables",
        image: "https://placehold.co/100/2ecc71/FFFFFF?text=V",
        color: "#E8F8F5",
    },
    {
        name: "Dairy & Eggs",
        image: "https://placehold.co/100/3498db/FFFFFF?text=D",
        color: "#EBF5FB",
    },
    {
        name: "Bakery",
        image: "https://placehold.co/100/f1c40f/FFFFFF?text=B",
        color: "#FEF9E7",
    },
    {
        name: "Snacks",
        image: "https://placehold.co/100/9b59b6/FFFFFF?text=S",
        color: "#F4ECF7",
    },
    {
        name: "Beverages",
        image: "https://placehold.co/100/34495e/FFFFFF?text=Dr",
        color: "#EBEDEF",
    },
];

export default function MainPage() {
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showOrderHistory, setShowOrderHistory] = useState(false);

    const handleRepeatOrder = (items) => {
        CartService.addItems(items);
    };

    if (showOrderHistory) {
        return (
            <OrderHistory
                onRepeatOrder={handleRepeatOrder}
                onBack={() => setShowOrderHistory(false)}
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

    const renderItem = (item) => (
        <View key={item.name} style={styles.itemCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <TouchableOpacity>
                    <Ionicons name="heart-outline" size={20} color="#FF6B6B" />
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

    const BottomNavBar = () => (
        <View style={styles.bottomNavContainer}>
            <TouchableOpacity style={styles.navItem}>
                <Ionicons name="cart-outline" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
                <Ionicons name="person-outline" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
                <Ionicons name="home" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
                <Ionicons name="heart-outline" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
                <Ionicons name="menu-outline" size={24} color="#1A1A1A" />
            </TouchableOpacity>
        </View>
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
                        <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                        <Text style={styles.categoryName}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View >
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header */}
            <View style={styles.topHeader}>
                <Text style={styles.topHeaderTitle}>Grocery Shopping</Text>
                <TouchableOpacity
                    style={styles.ordersButton}
                    onPress={() => setShowOrderHistory(true)}
                >
                    <Ionicons name="receipt-outline" size={24} color="#2c3e50" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search items..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {selectedCategory === "All" ? (
                    <>
                        {/* Banner */}
                        <View style={styles.bannerContainer}>
                            <Image
                                source={{ uri: "https://img.freepik.com/free-photo/shopping-basket-with-grocery-products_23-2148102377.jpg" }}
                                style={styles.bannerImage}
                            />
                            <View style={styles.bannerOverlay}>
                                <Text style={styles.bannerText}>Fresh Groceries</Text>
                                <Text style={styles.bannerSubtext}>Delivered in 10 mins</Text>
                            </View>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Grocery & Kitchen</Text>
                            <View style={styles.categoryGrid}>
                                {CATEGORIES.filter(c => c.name !== "All").map((cat, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.gridCategoryCard}
                                        onPress={() => setSelectedCategory(cat.name)}
                                    >
                                        <View style={[styles.gridIconContainer, { backgroundColor: cat.color }]}>
                                            <Image source={{ uri: cat.image }} style={styles.gridIcon} />
                                        </View>
                                        <Text style={styles.gridCategoryName}>{cat.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Show Popular items or other sections for "All" view if desired, 
                            or just the categories as the main entry point. 
                            Let's show "Popular" below the categories for quick access. */}
                        {GROCERY_DATA.filter(s => s.title === "Popular").map((section) => (
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
            <BottomNavBar />
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    topHeaderTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1A1A1A",
        letterSpacing: -0.5,
    },
    ordersButton: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: "#F5F5F5",
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 10,
    },
    searchInput: {
        height: 50,
        backgroundColor: "#F3F4F6",
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        color: "#1A1A1A",
        borderWidth: 0,
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
        width: 80,
        height: 90,
        marginRight: 12,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedCategoryCard: {
        borderWidth: 2,
        borderColor: "#4CAF50",
    },
    categoryImage: {
        width: 40,
        height: 40,
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 11,
        fontWeight: "600",
        color: "#333",
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
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    itemImage: {
        width: "80%",
        height: "80%",
        resizeMode: "contain",
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
    bannerContainer: {
        marginVertical: 20,
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
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
    },
    bannerText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    bannerSubtext: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '600',
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

    // Get cart items
    getCart() {
        return this.cart;
    }

    // Get cart total
    getTotal() {
        return this.cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
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