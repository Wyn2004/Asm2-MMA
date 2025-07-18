import React from "react";
import { Text, TextInput, View } from "react-native";

interface CustomerInfoProps {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export const CustomerInfo: React.FC<CustomerInfoProps> = ({
  customerInfo,
  handleInputChange,
}) => {
  return (
    <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-sm">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Customer Information
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2.5 text-base mb-3 bg-white"
        placeholder="Full Name"
        value={customerInfo.name}
        onChangeText={(value) => handleInputChange("name", value)}
      />

      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2.5 text-base mb-3 bg-white"
        placeholder="Email"
        value={customerInfo.email}
        onChangeText={(value) => handleInputChange("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2.5 text-base mb-3 bg-white"
        placeholder="Phone Number"
        value={customerInfo.phone}
        onChangeText={(value) => handleInputChange("phone", value)}
        keyboardType="phone-pad"
      />

      <TextInput
        className="border border-gray-300 rounded-lg px-3 py-2.5 text-base mb-3 bg-white"
        placeholder="Address"
        value={customerInfo.address}
        onChangeText={(value) => handleInputChange("address", value)}
      />

      <View className="flex-row justify-between">
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white w-[48%]"
          placeholder="City"
          value={customerInfo.city}
          onChangeText={(value) => handleInputChange("city", value)}
        />
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white w-[48%]"
          placeholder="ZIP Code"
          value={customerInfo.zipCode}
          onChangeText={(value) => handleInputChange("zipCode", value)}
        />
      </View>
    </View>
  );
};
