import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ onBack, onLogout }) {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
    const [userData, setUserData] = React.useState({ name: 'User', email: 'user@example.com' });
    const [orderCount, setOrderCount] = React.useState(0);
    const [addressCount, setAddressCount] = React.useState(0);

    React.useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const name = await AsyncStorage.getItem('userName');
            const email = await AsyncStorage.getItem('userEmail');
            const ordersJson = await AsyncStorage.getItem('userOrders');
            const addressesJson = await AsyncStorage.getItem('userAddresses');

            if (name || email) {
                setUserData({
                    name: name || 'User',
                    email: email || 'user@example.com'
                });
            }

            if (ordersJson) {
                const orders = JSON.parse(ordersJson);
                setOrderCount(orders.length);
            }

            if (addressesJson) {
                const addresses = JSON.parse(addressesJson);
                setAddressCount(addresses.length);
            }
        } catch (error) {
            console.log('Error loading user data:', error);
        }
    };

    const handleLogout = async () => {
        try {
            // Optional: Clear user data on logout if desired
            // await AsyncStorage.clear(); 
            if (onLogout) {
                onLogout();
            }
        } catch (error) {
            console.log('Error logging out:', error);
        }
    };

    const MenuOption = ({ icon, title, subtitle, onPress, showArrow = true, color = "#1A1A1A" }) => (
        <TouchableOpacity style={styles.menuOption} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            {showArrow && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* User Info Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarIconContainer}>
                            <Ionicons name="person" size={50} color="#4CAF50" />
                        </View>
                        <View style={styles.cameraButton}>
                            <Ionicons name="camera" size={14} color="#fff" />
                        </View>
                    </View>
                    <Text style={styles.userName}>{userData.name}</Text>
                    <Text style={styles.userEmail}>{userData.email}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{orderCount}</Text>
                            <Text style={styles.statLabel}>Orders</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{addressCount}</Text>
                            <Text style={styles.statLabel}>Addresses</Text>
                        </View>
                    </View>
                </View>

                {/* Account Settings */}
                <Text style={styles.sectionHeader}>Account</Text>
                <View style={styles.sectionContainer}>
                    <MenuOption
                        icon="person-outline"
                        title="Personal Information"
                        subtitle="Name, Email, Phone"
                        color="#4CAF50"
                    />
                    <MenuOption
                        icon="location-outline"
                        title="Saved Addresses"
                        subtitle="Home, Office"
                        color="#2196F3"
                    />
                    <MenuOption
                        icon="card-outline"
                        title="Payment Methods"
                        subtitle="Visa **42"
                        color="#9C27B0"
                    />
                </View>

                {/* General Settings */}
                <Text style={styles.sectionHeader}>General</Text>
                <View style={styles.sectionContainer}>
                    <View style={styles.menuOption}>
                        <View style={[styles.iconContainer, { backgroundColor: "#FF980015" }]}>
                            <Ionicons name="notifications-outline" size={22} color="#FF9800" />
                        </View>
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuTitle}>Notifications</Text>
                        </View>
                        <Switch
                            value={isNotificationsEnabled}
                            onValueChange={setIsNotificationsEnabled}
                            trackColor={{ false: "#767577", true: "#4CAF50" }}
                            thumbColor={"#fff"}
                        />
                    </View>
                    <MenuOption
                        icon="language-outline"
                        title="Language"
                        subtitle="English (US)"
                        color="#009688"
                    />
                    <MenuOption
                        icon="help-circle-outline"
                        title="Help Center"
                        color="#607D8B"
                    />
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#fff",
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1A1A1A",
    },
    editButton: {
        padding: 8,
    },
    editButtonText: {
        color: "#4CAF50",
        fontSize: 16,
        fontWeight: "600",
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileCard: {
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 5,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },
    avatarIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    cameraButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#4CAF50",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#fff",
    },
    userName: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: "#888",
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#888",
        fontWeight: "500",
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: "#eee",
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1A1A1A",
        marginLeft: 20,
        marginBottom: 12,
        marginTop: 8,
    },
    sectionContainer: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 8,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    menuOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 12,
        color: "#999",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 20,
        marginTop: 10,
        padding: 16,
        backgroundColor: "#FFF0F0",
        borderRadius: 16,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FF6B6B",
        marginLeft: 8,
    },
    versionText: {
        textAlign: "center",
        color: "#ccc",
        fontSize: 12,
        marginTop: 24,
    },
});
