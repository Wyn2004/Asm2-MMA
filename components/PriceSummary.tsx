import React from "react";
import { Text, View } from "react-native";
import { useCart } from "../context/CartContext";

export const PriceSummary: React.FC = () => {
  const { cart } = useCart();

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mx-4 mb-4">
      <Text className="text-gray-900 font-bold text-lg mb-4">
        Order Summary
      </Text>

      <View className="space-y-2">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-500 text-base">
            Subtotal ({cart.totalItems} items)
          </Text>
          <Text className="text-gray-900 font-medium text-base">
            ${subtotal.toFixed(2)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-500 text-base">Shipping</Text>
          <Text className="text-gray-900 font-medium text-base">
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-500 text-base">Tax</Text>
          <Text className="text-gray-900 font-medium text-base">
            ${tax.toFixed(2)}
          </Text>
        </View>

        <View className="border-t border-gray-200 pt-2 mt-2">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-900 font-bold text-lg">Total</Text>
            <Text className="text-blue-600 font-bold text-xl">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {subtotal < 50 && (
        <Text className="text-gray-500 text-sm mt-3 text-center">
          Add ${(50 - subtotal).toFixed(2)} more for free shipping!
        </Text>
      )}
    </View>
  );
};
