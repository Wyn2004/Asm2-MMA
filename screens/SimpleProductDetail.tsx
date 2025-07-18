import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { useProduct } from "../hooks/useProduct";

const { width } = Dimensions.get("window");

export const SimpleProductDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const productId = parseInt(id as string);

  const { product, isLoading, error } = useProduct(productId);
  const { addToCart, getCartItemQuantity } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const cartQuantity = product ? getCartItemQuantity(product.id) : 0;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-500">Loading product...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 text-center mb-4">
          {error || "Product not found"}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-600 px-6 py-3 rounded-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-md">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2"
            activeOpacity={0.7}
          >
            <Text className="text-blue-600 text-lg">← Back</Text>
          </TouchableOpacity>
          <Text
            className="flex-1 text-lg font-semibold text-gray-900 text-center"
            numberOfLines={1}
          >
            {product.title}
          </Text>
          <View className="w-12" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image Gallery */}
          <View className="bg-gray-50">
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width
                );
                setSelectedImageIndex(index);
              }}
            >
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={{ width, height: width }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            {/* Image Indicators */}
            {images.length > 1 && (
              <View className="flex-row justify-center py-3">
                {images.map((_, index) => (
                  <View
                    key={index}
                    className={`w-2 h-2 rounded-full mx-1 ${
                      index === selectedImageIndex
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Product Info */}
          <View className="p-4">
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  {product.title}
                </Text>
                <Text className="text-base text-gray-500 mb-2">
                  {product.brand}
                </Text>
              </View>

              {product.discountPercentage > 0 && (
                <View className="bg-red-500 rounded-full px-3 py-1">
                  <Text className="text-white text-sm font-bold">
                    -{Math.round(product.discountPercentage)}%
                  </Text>
                </View>
              )}
            </View>

            {/* Rating */}
            <View className="flex-row items-center mb-4">
              <Text className="text-yellow-400 text-lg">★</Text>
              <Text className="text-gray-500 ml-1">
                {product.rating.toFixed(1)} ({product.stock} in stock)
              </Text>
            </View>

            {/* Price */}
            <View className="flex-row items-center mb-6">
              <Text className="text-3xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </Text>
              {product.discountPercentage > 0 && (
                <Text className="text-lg text-gray-400 line-through ml-3">
                  $
                  {(
                    product.price /
                    (1 - product.discountPercentage / 100)
                  ).toFixed(2)}
                </Text>
              )}
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </Text>
              <Text className="text-gray-500 leading-6">
                {product.description}
              </Text>
            </View>

            {/* Quantity Selector */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-semibold text-gray-900">
                Quantity
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={decrementQuantity}
                  className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-500 font-bold text-xl">-</Text>
                </TouchableOpacity>

                <Text className="mx-6 text-xl font-semibold text-gray-900">
                  {quantity}
                </Text>

                <TouchableOpacity
                  onPress={incrementQuantity}
                  className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-white font-bold text-xl">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Add to Cart Button */}
        <View className="p-4 bg-white border-t border-gray-200">
          <TouchableOpacity
            onPress={handleAddToCart}
            className={`py-4 rounded-lg ${
              cartQuantity > 0 ? "bg-green-600" : "bg-blue-600"
            }`}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-bold text-lg">
              {cartQuantity > 0
                ? `Update Cart (${cartQuantity} in cart)`
                : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
