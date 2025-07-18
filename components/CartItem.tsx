import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";
import { CartItem as CartItemType } from "../types";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const totalPrice = product.price * quantity;

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-3 mx-4">
      <View className="flex-row">
        <Image
          source={{ uri: product.thumbnail }}
          className="w-20 h-20 rounded-lg mr-4"
          resizeMode="cover"
        />

        <View className="flex-1">
          <Text
            className="text-gray-900 font-semibold text-base mb-1"
            numberOfLines={2}
          >
            {product.title}
          </Text>

          <Text className="text-gray-500 text-sm mb-2">{product.brand}</Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-blue-600 font-bold text-lg">
              ${product.price.toFixed(2)}
            </Text>

            <TouchableOpacity
              onPress={handleRemove}
              className="p-2"
              activeOpacity={0.7}
            >
              <Text className="text-red-500 font-medium text-sm">Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleDecrement}
            className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="text-gray-500 font-bold text-lg">-</Text>
          </TouchableOpacity>

          <Text className="mx-4 text-gray-900 font-semibold text-lg">
            {quantity}
          </Text>

          <TouchableOpacity
            onPress={handleIncrement}
            className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="text-white font-bold text-lg">+</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-gray-900 font-bold text-lg">
          ${totalPrice.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};
