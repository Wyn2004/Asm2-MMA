import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { Product } from "../types";

export const FavoritesScreen: React.FC = () => {
  const router = useRouter();
  const { favorites, removeFromFavorites, clearFavorites, isLoading } =
    useFavorites();
  const { addToCart } = useCart();

  const handleRemoveFromFavorites = (
    productId: number,
    productTitle: string
  ) => {
    Alert.alert(
      "Remove from Favorites",
      `Are you sure you want to remove "${productTitle}" from your favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromFavorites(productId),
        },
      ]
    );
  };

  const handleClearAllFavorites = () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all items from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: clearFavorites,
        },
      ]
    );
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Alert.alert(
      "Added to Cart",
      `${product.title} has been added to your cart.`
    );
  };

  const renderFavoriteItem = ({ item }: { item: Product }) => (
    <View style={styles.favoriteItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.productRating}>⭐ {item.rating.toFixed(1)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromFavorites(item.id, item.title)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Favorites</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Favorites</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Start adding products to your favorites to see them here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            My Favorites ({favorites.length})
          </Text>
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={handleClearAllFavorites}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 80, // Same width as back button to center the title
  },
  clearAllButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearAllText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
  },
  favoriteItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 4,
  },
  productRating: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  addToCartButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  removeButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
