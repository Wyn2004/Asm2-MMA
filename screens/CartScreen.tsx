import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartItem } from "../components/CartItem";
import { PriceSummary } from "../components/PriceSummary";
import { useCart } from "../context/CartContext";

export const CartScreen = () => {
  const router = useRouter();
  const { cart, clearCart, isLoading } = useCart();

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearCart,
        },
      ]
    );
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Show loading indicator if cart is still loading
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-md">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Text className="text-blue-600 text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Cart</Text>
          <View className="w-12" />
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-500">Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cart.items.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-md">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Text className="text-blue-600 text-base">← Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Cart</Text>
          <View className="w-12" />
        </View>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-2xl mb-2">🛒</Text>
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Your cart is empty
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            Add some products to your cart to see them here
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-md">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Text className="text-blue-600 text-base">← Back</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">
          Cart ({cart.totalItems})
        </Text>
        <TouchableOpacity onPress={handleClearCart} className="p-2">
          <Text className="text-red-500 text-base">Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart.items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      />

      <PriceSummary />

      <View className="p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleCheckout}
          className="bg-blue-600 py-4 rounded-lg"
        >
          <Text className="text-white text-center font-bold text-lg">
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
