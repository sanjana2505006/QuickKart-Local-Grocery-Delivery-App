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
import CartScreen from '../components/CartScreen';
import { CartService } from '../services/CartService';

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
    const [showCart, setShowCart] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    React.useEffect(() => {
        const unsub = CartService.subscribe(() => {
            setCartCount(CartService.getItemCount());
        });
        return unsub;
    }, []);

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

    if (showCart) {
        return <CartScreen onClose={() => setShowCart(false)} />;
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

    const renderItem = ({ item }) => (
        <View style={styles.itemCard}>
            <View style={styles.itemImageContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
            </View>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemWeight}>{item.weight}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => CartService.addItem(item)}>
                        <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const ListHeader = () => (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Grocery Shopping</Text>
                <View style={styles.searchBar}>
                    <Ionicons
                        name="search"
                        size={20}
                        color="#888"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholderTextColor="#888"
                    />
                </View>
            </View>

            <View style={styles.bannerContainer}>
                <View style={styles.bannerContent}>
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerTitle}>20% OFF</Text>
                        <Text style={styles.bannerSubtitle}>on your first order</Text>
                        <TouchableOpacity style={styles.bannerButton}>
                            <Text style={styles.bannerButtonText}>Shop Now</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: "https://placehold.co/200/F1C40F/FFFFFF?text=Veg" }}
                        style={styles.bannerImage}
                    />
                </View>
            </View>

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
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header */}
            <View style={styles.topHeader}>
                <Text style={styles.topHeaderTitle}>Grocery Shopping</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity
                        style={styles.ordersButton}
                        onPress={() => setShowOrderHistory(true)}
                    >
                        <Ionicons name="receipt-outline" size={24} color="#2c3e50" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.ordersButton, {marginLeft:10}]} onPress={() => setShowCart(true)}>
                        <Ionicons name="cart-outline" size={24} color="#2c3e50" />
                        {cartCount > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{cartCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
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

            {/* Section List */}
            <SectionList
                sections={filteredData}
                keyExtractor={(item, index) => item + index}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{title}</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
            />
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
        position: 'relative',
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
        paddingBottom: 40,
    },
    header: {
        backgroundColor: "#FAFAFA",
        paddingVertical: 15,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1A1A1A",
    },
    headerContainer: {
        marginBottom: 10,
    },
    searchBar: {
        display: 'none', // Hidden as we moved it to top
    },
    bannerContainer: {
        marginTop: 20,
        marginBottom: 25,
        borderRadius: 24,
        backgroundColor: "#FFF9C4", // Light yellow/beige
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#FBC02D",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    bannerContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 24,
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 28,
        fontWeight: "900",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    bannerSubtitle: {
        fontSize: 15,
        color: "#555",
        marginBottom: 16,
        fontWeight: "500",
    },
    bannerButton: {
        backgroundColor: "#1A1A1A",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignSelf: "flex-start",
    },
    bannerButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13,
    },
    bannerImage: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 15,
    },
    categoriesScroll: {
        marginBottom: 10,
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
    cartBadge: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: '#E74C3C',
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
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
    itemCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    itemImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    itemImage: {
        width: 60,
        height: 60,
        resizeMode: "contain",
    },
    itemInfo: {
        flex: 1,
        justifyContent: "center",
    },
    itemName: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    itemWeight: {
        fontSize: 13,
        color: "#888",
        marginBottom: 8,
        fontWeight: "500",
    },
    priceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1A1A1A",
    },
    addButton: {
        backgroundColor: "#4CAF50",
        width: 40,
        height: 40,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
});
 