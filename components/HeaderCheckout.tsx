import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-md">
      <TouchableOpacity onPress={onBack} className="p-2">
        <Text className="text-blue-600 text-base">← Back</Text>
      </TouchableOpacity>
      <Text className="text-lg font-semibold text-gray-900 ">Checkout</Text>
      <View className="w-12" />
    </View>
  );
};
