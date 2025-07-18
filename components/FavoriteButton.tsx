import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFavorites } from "../context/FavoritesContext";
import { Product } from "../types";

interface FavoriteButtonProps {
  product: Product;
  size?: "small" | "medium" | "large";
  showText?: boolean;
  style?: any;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  product,
  size = "medium",
  showText = false,
  style,
}) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isProductFavorite = isFavorite(product.id);

  const handlePress = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const getSize = () => {
    switch (size) {
      case "small":
        return styles.small;
      case "large":
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getSize(),
        isProductFavorite && styles.favorited,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.icon, isProductFavorite && styles.favoritedIcon]}>
        {isProductFavorite ? "❤️" : "🤍"}
      </Text>
      {showText && (
        <Text style={[styles.text, isProductFavorite && styles.favoritedText]}>
          {isProductFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  favorited: {
    backgroundColor: "#ffe6e6",
    borderColor: "#ff6b6b",
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    fontSize: 16,
  },
  favoritedIcon: {
    fontSize: 16,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  favoritedText: {
    color: "#ff6b6b",
  },
});
