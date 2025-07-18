import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface PlaceOrderButtonProps {
  isProcessing: boolean;
  handlePlaceOrder: () => void;
  getTotalPrice: () => number;
}

export const PlaceOrderButton: React.FC<PlaceOrderButtonProps> = ({
  isProcessing,
  handlePlaceOrder,
  getTotalPrice,
}) => {
  return (
    <View className="p-4 bg-white border-t border-gray-200">
      <TouchableOpacity
        className={`py-4 rounded-lg items-center ${
          isProcessing ? "bg-gray-400" : "bg-green-600"
        }`}
        onPress={handlePlaceOrder}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-lg font-bold">
            Place Order - ${getTotalPrice().toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
