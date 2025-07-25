import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useFavorites } from "../context/FavoritesContext";

interface HeaderProps {
  totalItems: number;
}

export const Header: React.FC<HeaderProps> = ({ totalItems }) => {
  const router = useRouter();
  const { favorites } = useFavorites();

  return (
    <View className="bg-white flex-row justify-between items-center px-4 py-3 shadow-md">
      <Text className="text-xl font-bold text-gray-900">Products</Text>

      <View className="flex-row items-center space-x-3">
        {/* Favorites Button */}
        <TouchableOpacity
          className="relative p-2"
          onPress={() => router.push("/favorites")}
        >
          <Text className="text-2xl">❤️</Text>
          {favorites.length > 0 && (
            <View className="absolute top-0 right-0 bg-red-500 rounded-full min-w-5 h-5 justify-center items-center">
              <Text className="text-white text-xs font-bold">
                {favorites.length > 99 ? "99+" : favorites.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Cart Button */}
        <TouchableOpacity
          className="relative p-2"
          onPress={() => router.push("/cart")}
        >
          <Text className="text-2xl">🛒</Text>
          {totalItems > 0 && (
            <View className="absolute top-0 right-0 bg-red-500 rounded-full min-w-5 h-5 justify-center items-center">
              <Text className="text-white text-xs font-bold">
                {totalItems > 99 ? "99+" : totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
