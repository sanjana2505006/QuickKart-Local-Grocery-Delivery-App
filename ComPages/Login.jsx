import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";

export default function Login({ onCreateAccount }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState(""); // "error" or "success"

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    };

    const showAlert = (message, type = "error") => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertVisible(true);
    };

    const handleLogin = () => {
        // Email validation
        if (!validateEmail(email)) {
            showAlert("Please enter a valid email address", "error");
            return;
        }

        // Phone validation
        if (!validatePhone(phone)) {
            showAlert("Please enter a valid 10-digit phone number", "error");
            return;
        }

        // Name validation
        if (name.trim().length < 2) {
            showAlert("Please enter a valid name (at least 2 characters)", "error");
            return;
        }

        console.log('Login successful with:', { name, email, phone });
        // Navigate to MainPage after successful account creation
        if (onCreateAccount) {
            onCreateAccount();
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join us and get your groceries delivered fast</Text>
            </View>

            {/* Input Fields */}
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Enter your phone (10 digits)"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    maxLength={10}
                />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.guestButton} onPress={() => { if (onCreateAccount) onCreateAccount(); }}>
                <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    By creating an account, you agree to our{' '}
                    <Text style={styles.link}>Terms of Service</Text> and{' '}
                    <Text style={styles.link}>Privacy Policy</Text>
                </Text>
            </View>

            {/* Custom Alert Modal */}
            <Modal
                visible={alertVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setAlertVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[
                        styles.alertBox,
                        alertType === "error" ? styles.errorAlert : styles.successAlert
                    ]}>
                        <Text style={styles.alertTitle}>
                            {alertType === "error" ? "Error" : "Success"}
                        </Text>
                        <Text style={styles.alertMessage}>{alertMessage}</Text>
                        <TouchableOpacity
                            style={[
                                styles.alertButton,
                                alertType === "error" ? styles.errorButton : styles.successButton
                            ]}
                            onPress={() => setAlertVisible(false)}
                        >
                            <Text style={styles.alertButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    header: {
        marginBottom: 40,
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        lineHeight: 22,
    },
    formContainer: {
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    loginButton: {
        backgroundColor: "#4CAF50",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    loginButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    footer: {
        alignItems: "center",
    },
    footerText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
    },
    link: {
        color: "#4CAF50",
        fontWeight: "600",
    },
    // Custom Alert Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alertBox: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    errorAlert: {
        borderLeftWidth: 6,
        borderLeftColor: '#ff4444',
    },
    successAlert: {
        borderLeftWidth: 6,
        borderLeftColor: '#4CAF50',
    },
    alertTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
    },
    alertMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    alertButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
        minWidth: 100,
    },
    errorButton: {
        backgroundColor: '#ff4444',
    },
    successButton: {
        backgroundColor: '#4CAF50',
    },
    alertButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    guestButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#4CAF50',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    guestButtonText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: '700',
    },
});