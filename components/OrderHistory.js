import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native";
import { MaterialIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrderHistory({ orderService, onRepeatOrder, onBack }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

export default function OrderHistory({ onRepeatOrder, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  React.useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersJson = await AsyncStorage.getItem('userOrders');
      if (ordersJson) {
        const loadedOrders = JSON.parse(ordersJson);
        setOrders(loadedOrders);
      }
    } catch (error) {
      console.log('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

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
      case "Pending":
        return {
          bg: "#FFF3E0",
          text: "#EF6C00",
          icon: "schedule"
        };
      case "Accepted":
        return {
          bg: "#E3F2FD",
          text: "#1565C0",
          icon: "thumb-up"
        };
      case "Out for Delivery":
      case "Shipped":
        return {
          bg: "#F3E5F5",
          text: "#7B1FA2",
          icon: "local-shipping"
        };
      default:
        return {
          bg: "#F5F5F5",
          text: "#616161",
          icon: "shopping-basket"
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
      `Add ${order.items.length} items from order #${order.id} to cart?\n\nItems: ${order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add All Items",
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

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <View style={styles.detailsOverlay}>
        <View style={styles.detailsContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedOrder(null)}
          >
            <Icon name="close" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.detailsMainTitle}>Order Details</Text>
          <Text style={styles.detailsOrderId}>Order #{selectedOrder.id}</Text>

          <ScrollView style={styles.detailsScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.detailsSectionTitle}>Items</Text>
            {selectedOrder.items.map((item, index) => (
              <View key={index} style={styles.detailsItem}>
                <Image source={{ uri: item.image }} style={styles.detailsItemImage} />
                <View style={styles.detailsItemInfo}>
                  <Text style={styles.detailsItemName}>{item.name}</Text>
                  <Text style={styles.detailsItemWeight}>{item.weight || '1 unit'}</Text>
                </View>
                <View style={styles.detailsItemPriceContainer}>
                  <Text style={styles.detailsItemQty}>x{item.quantity}</Text>
                  <Text style={styles.detailsItemPrice}>{item.price}</Text>
                </View>
              </View>
            ))}

            <View style={styles.detailsDivider} />

            <Text style={styles.detailsSectionTitle}>Delivery Address</Text>
            <View style={styles.detailsAddressContainer}>
              <Icon name="location-on" size={18} color="#4CAF50" />
              <Text style={styles.detailsAddressText}>{selectedOrder.deliveryAddress}</Text>
            </View>

            <View style={styles.detailsDivider} />

            <View style={styles.detailsTotalRow}>
              <Text style={styles.detailsTotalLabel}>Total Amount</Text>
              <Text style={styles.detailsTotalValue}>{selectedOrder.total}</Text>
            </View>
          </ScrollView>

          {selectedOrder.status === "Delivered" && (
            <TouchableOpacity
              style={styles.detailsRepeatButton}
              onPress={() => {
                handleRepeatOrder(selectedOrder);
                setSelectedOrder(null);
              }}
            >
              <Icon name="refresh" size={20} color="#FFF" />
              <Text style={styles.detailsRepeatText}>Order Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#1A1A1A" />
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
            <Icon name="shopping-bag" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No orders yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Your order history will appear here
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
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
                    <MaterialIcons
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
                  <View style={styles.orderMeta}>
                    <View style={styles.deliveryInfo}>
                      <MaterialIcons name="location-on" size={14} color="#666" />
                      <Text style={styles.deliveryText} numberOfLines={1}>
                        {order.deliveryAddress}
                      </Text>
                    </View>
                    {order.paymentMethod && (
                      <View style={styles.paymentInfo}>
                        <MaterialIcons name="payment" size={14} color="#666" />
                        <Text style={styles.paymentText}>{order.paymentMethod}</Text>
                      </View>
                    )}
                    {order.deliveryTime && order.deliveryTime !== "Calculating..." && (
                      <View style={styles.timeInfo}>
                        <MaterialIcons name="schedule" size={14} color="#4CAF50" />
                        <Text style={styles.timeText}>Delivered in {order.deliveryTime}</Text>
                      </View>
                    )}
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
                      onPress={() => setSelectedOrder(order)}
                    >
                      <Text style={styles.detailsText}>Details</Text>
                    </TouchableOpacity>

                    {order.status === "Delivered" && (
                      <TouchableOpacity
                        style={styles.repeatButton}
                        onPress={() => handleRepeatOrder(order)}
                      >
                        <MaterialIcons name="refresh" size={16} color="#FFF" />
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
      {renderOrderDetails()}
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
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: "#1A1A1A",
  },
  filterContainer: {
    flexDirection: "row",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: "#4CAF50",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  activeFilterText: {
    color: "#fff",
  },
  clearFiltersButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  clearFiltersText: {
    color: "#fff",
    fontWeight: "600",
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
  orderMeta: {
    gap: 6,
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
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  paymentText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
  },
  timeText: {
    fontSize: 13,
    color: "#4CAF50",
    marginLeft: 6,
    fontWeight: "600",
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
  detailsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    height: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  detailsMainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 8,
  },
  detailsOrderId: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  detailsScroll: {
    flex: 1,
  },
  detailsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    marginTop: 8,
  },
  detailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 16,
  },
  detailsItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  detailsItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  detailsItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  detailsItemWeight: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  detailsItemPriceContainer: {
    alignItems: 'flex-end',
  },
  detailsItemQty: {
    fontSize: 12,
    color: '#888',
  },
  detailsItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 2,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 20,
  },
  detailsAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F4',
    padding: 16,
    borderRadius: 16,
  },
  detailsAddressText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  detailsTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  detailsTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
  },
  detailsTotalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  detailsRepeatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 10,
  },
  detailsRepeatText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});
