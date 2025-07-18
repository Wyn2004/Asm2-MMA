import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CartItem } from "../components/CartItem";
import { PriceSummary } from "../components/PriceSummary";
import { useCart } from "../context/CartContext";
import { CartItem as CartItemType } from "../types";

export const CartScreen = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const renderCartItem = ({ item }: { item: CartItemType }) => (
    <CartItem item={item} />
  );

  const renderEmpty = () => (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center py-20">
        <Text className="text-6xl mb-4">🛒</Text>
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Your cart is empty
        </Text>
        <Text className="text-gray-500 text-center mb-6">
          Add some products to get started
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-blue-600 px-8 py-3 rounded-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-lg">
            Start Shopping
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderHeader = () => (
    <View className="bg-white shadow-md">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2"
          activeOpacity={0.7}
        >
          <Text className="text-blue-600 text-lg">← Back</Text>
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900">
          Cart ({cart.totalItems})
        </Text>

        {cart.items.length > 0 && (
          <TouchableOpacity
            onPress={handleClearCart}
            className="p-2"
            activeOpacity={0.7}
          >
            <Text className="text-red-500 font-medium">Clear</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (cart.items.length === 0) return null;

    return (
      <View>
        <PriceSummary />
        <View className="px-4 pb-6">
          <TouchableOpacity
            onPress={handleCheckout}
            className="bg-blue-600 py-4 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-bold text-lg">
              Proceed to Checkout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/")}
            className="mt-3 py-3"
            activeOpacity={0.7}
          >
            <Text className="text-blue-600 text-center font-medium">
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-gray-50">
        {renderHeader()}
        <FlatList
          data={cart.items}
          renderItem={renderCartItem}
          keyExtractor={(item, index) => `cart-${item.product.id}-${index}`}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: cart.items.length > 0 ? 16 : 0,
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};
