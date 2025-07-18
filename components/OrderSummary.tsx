import React from "react";
import { Text, View } from "react-native";
import { CartItem } from "../types";

interface OrderSummaryProps {
  items: CartItem[];
  getTotalPrice: () => number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  getTotalPrice,
}) => {
  return (
    <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-sm">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </Text>
      {items.map((item) => (
        <View
          key={item.product.id}
          className="flex-row justify-between items-center py-2 border-b border-gray-200"
        >
          <Text className="flex-1 text-sm text-gray-900">
            {item.product.title}
          </Text>
          <Text className="text-sm text-gray-500 mx-2">
            ${item.product.price.toFixed(2)} × {item.quantity}
          </Text>
          <Text className="text-sm font-semibold text-gray-900">
            ${(item.product.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}
      <View className="flex-row justify-between items-center pt-4 mt-2 border-t-2 border-gray-200">
        <Text className="text-lg font-semibold text-gray-900">Total:</Text>
        <Text className="text-xl font-bold text-blue-600">
          ${getTotalPrice().toFixed(2)}
        </Text>
      </View>
    </View>
  );
};
