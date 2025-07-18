import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Product } from "../types";
import { FavoriteButton } from "./FavoriteButton";

interface ProductListProps {
  products: Product[];
  loadingMore: boolean;
  handleEndReached: () => void;
  addToCart: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  loadingMore,
  handleEndReached,
  addToCart,
}) => {
  const router = useRouter();

  const renderProduct = ({ item }: { item: Product; index: number }) => (
    <TouchableOpacity
      className="bg-white rounded-lg m-2 p-3 flex-1 max-w-[45%] shadow-sm"
      onPress={() => router.push(`/product/${item.id}`)}
      activeOpacity={0.7}
    >
      {/* Product Image with Favorite Button */}
      <View className="relative">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-32 rounded-lg mb-2"
          resizeMode="cover"
        />
        {/* Favorite Button positioned on top right of image */}
        <View className="absolute top-2 right-2">
          <FavoriteButton
            product={item}
            size="small"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: 15,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          />
        </View>
      </View>

      <Text
        className="text-sm font-semibold text-gray-900 mb-1"
        numberOfLines={2}
      >
        {item.title}
      </Text>
      <Text className="text-base font-bold text-blue-600 mb-2">
        ${item.price.toFixed(2)}
      </Text>
      <TouchableOpacity
        className="bg-blue-600 rounded-md py-2 px-3"
        onPress={(e) => {
          e.stopPropagation();
          addToCart(item);
        }}
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-semibold text-xs">
          Add to Cart
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item, index) => `simple-${item.id}-${index}`}
      numColumns={2}
      contentContainerStyle={{ padding: 8 }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
      ListFooterComponent={() =>
        loadingMore ? (
          <View className="flex-row justify-center items-center py-5">
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text className="ml-2 text-sm text-gray-500">Loading more...</Text>
          </View>
        ) : null
      }
    />
  );
};
