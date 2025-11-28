import React, { useState } from "react";
import { StyleSheet, Text, View, SectionList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GROCERY_DATA = [
  {
    title: "Fruits",
    data: ["Apples", "Bananas", "Oranges", "Grapes", "Mangoes"],
  },
  {
    title: "Vegetables",
    data: ["Carrots", "Broccoli", "Spinach", "Potatoes", "Onions"],
  },
  {
    title: "Dairy",
    data: ["Milk", "Cheese", "Yogurt", "Butter", "Cream"],
  },
  {
    title: "Snacks",
    data: ["Chips", "Cookies", "Popcorn", "Nuts", "Chocolate"],
  },
];

const GroceryList = () => {
  const [searchText, setSearchText] = useState("");

  const filteredData = GROCERY_DATA.map((section) => {
    const filteredItems = section.data.filter((item) =>
      item.toLowerCase().includes(searchText.toLowerCase())
    );
    return { ...section, data: filteredItems };
  }).filter((section) => section.data.length > 0);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <SectionList
        sections={filteredData}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item}</Text>
          </View>
        )}
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
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    // Ensure it's visible
    zIndex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  item: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    color: "#34495e",
  },
});

export default GroceryList;
