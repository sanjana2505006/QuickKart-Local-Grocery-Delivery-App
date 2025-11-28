import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Enhanced mock order data with different statuses
const MOCK_ORDERS = [
  {
    id: "ORD001",
    date: "2024-01-15",
    status: "Delivered",
    total: "₹48.50",
    items: [
      {
        name: "Fresh Apples",
        price: "₹12.00",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400",
      },
      {
        name: "Organic Milk",
        price: "₹6.50",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
      },
      {
        name: "Brown Bread",
        price: "₹4.50",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
      },
    ],
    deliveryTime: "8 mins",
    deliveryAddress: "123 Main St, Apartment 4B, Mumbai",
  },
  {
    id: "ORD002",
    date: "2024-01-12",
    status: "Cancelled",
    total: "₹32.00",
    items: [
      {
        name: "Bananas",
        price: "₹6.00",
        quantity: 2,
        image: "https://placehold.co/150/FFD93D/FFFFFF?text=Banana",
      },
      {
        name: "Carrots",
        price: "₹6.00",
        quantity: 1,
        image: "https://placehold.co/150/E17055/FFFFFF?text=Carrot",
      },
    ],
    deliveryTime: "12 mins",
    deliveryAddress: "123 Main St, Apartment 4B, Mumbai",
  },
  {
    id: "ORD003",
    date: "2024-01-10",
    status: "Processing",
    total: "₹75.25",
    items: [
      {
        name: "Chicken Breast",
        price: "₹25.00",
        quantity: 1,
        image: "https://placehold.co/150/FF6B6B/FFFFFF?text=Chicken",
      },
      {
        name: "Basmati Rice",
        price: "₹15.25",
        quantity: 2,
        image: "https://placehold.co/150/4ECDC4/FFFFFF?text=Rice",
      },
    ],
    deliveryTime: "15 mins",
    deliveryAddress: "123 Main St, Apartment 4B, Mumbai",
  },
];

export default function OrderHistory({ onRepeatOrder, onBack }) {
  const [orders] = useState(MOCK_ORDERS);

  const getStatusDetails = (status) => {
    switch (status) {
      case "Delivered":
        return {
          bg: "#E8F5E9",
          text: "#2E7D32",
          icon: "check-circle"
        };
      case "Cancelled":
        return {
          bg: "#FFEBEE",
          text: "#C62828",
          icon: "cancel"
        };
      case "Processing":
        return {
          bg: "#FFF3E0",
          text: "#EF6C00",
          icon: "schedule"
        };
      case "Shipped":
        return {
          bg: "#E3F2FD",
          text: "#1565C0",
          icon: "local-shipping"
        };
      default:
        return {
          bg: "#F5F5F5",
          text: "#616161",
          icon: "help"
        };
    }
  };

  const handleRepeatOrder = (order) => {
    if (order.status !== "Delivered") {
      Alert.alert(
        "Cannot Repeat Order",
        "You can only repeat delivered orders.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    Alert.alert(
      "Repeat Order",
      `Add ${order.items.length} items from order #${order.id} to cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add to Cart",
          onPress: () => {
            if (onRepeatOrder) {
              onRepeatOrder(order.items);
            }
            Alert.alert("Success", "All items have been added to your cart!");
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getOrderSummary = (items) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const itemNames = items.map(item => item.name).join(", ");
    return `${totalItems} item${totalItems > 1 ? 's' : ''}: ${itemNames}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Order History</Text>
          <Text style={styles.headerSubtitle}>{orders.length} orders placed</Text>
        </View>
      </View>

      {/* Orders List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="receipt-long" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No orders yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Your order history will appear here
            </Text>
          </View>
        ) : (
          orders.map((order) => {
            const statusDetails = getStatusDetails(order.status);
            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>Order #{order.id}</Text>
                    <Text style={styles.orderDate}>
                      {formatDate(order.date)}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusDetails.bg }]}>
                    <Icon
                      name={statusDetails.icon}
                      size={14}
                      color={statusDetails.text}
                      style={styles.statusIcon}
                    />
                    <Text style={[styles.statusText, { color: statusDetails.text }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Order Items Summary */}
                <View style={styles.orderSummary}>
                  <Text style={styles.itemsSummary} numberOfLines={2}>
                    {getOrderSummary(order.items)}
                  </Text>
                  <View style={styles.deliveryInfo}>
                    <Icon name="location-on" size={14} color="#666" />
                    <Text style={styles.deliveryText} numberOfLines={1}>
                      {order.deliveryAddress}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Order Footer */}
                <View style={styles.orderFooter}>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalAmount}>{order.total}</Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => Alert.alert("Order Details", `View details for order #${order.id}`)}
                    >
                      <Text style={styles.detailsText}>Details</Text>
                    </TouchableOpacity>

                    {order.status === "Delivered" && (
                      <TouchableOpacity
                        style={styles.repeatButton}
                        onPress={() => handleRepeatOrder(order)}
                      >
                        <Icon name="refresh" size={16} color="#FFF" />
                        <Text style={styles.repeatText}>Repeat</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  orderDate: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },
  orderSummary: {
    marginVertical: 4,
  },
  itemsSummary: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F8F9FA",
  },
  detailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  repeatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  repeatText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 6,
  },
  bottomSpacer: {
    height: 20,
  },
});
