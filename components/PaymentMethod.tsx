import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  cardInfo: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
  handleCardInputChange: (field: string, value: string) => void;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  setPaymentMethod,
  cardInfo,
  handleCardInputChange,
}) => {
  return (
    <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-sm">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Payment Method
      </Text>

      <View className="flex-row mb-4">
        <TouchableOpacity
          className={`flex-1 py-3 px-4 border border-gray-300 rounded-lg mr-2 items-center ${
            paymentMethod === "credit_card" ? "border-blue-600 bg-blue-50" : ""
          }`}
          onPress={() => setPaymentMethod("credit_card")}
        >
          <Text
            className={`text-sm ${
              paymentMethod === "credit_card"
                ? "text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Credit Card
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 px-4 border border-gray-300 rounded-lg items-center ${
            paymentMethod === "cash" ? "border-blue-600 bg-blue-50" : ""
          }`}
          onPress={() => setPaymentMethod("cash")}
        >
          <Text
            className={`text-sm ${
              paymentMethod === "cash"
                ? "text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Cash on Delivery
          </Text>
        </TouchableOpacity>
      </View>

      {paymentMethod === "credit_card" && (
        <View className="mt-4">
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-base mb-3 bg-white"
            placeholder="Card Number"
            value={cardInfo.cardNumber}
            onChangeText={(value) => handleCardInputChange("cardNumber", value)}
            keyboardType="numeric"
            maxLength={16}
          />

          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-base mb-3 bg-white"
            placeholder="Cardholder Name"
            value={cardInfo.cardholderName}
            onChangeText={(value) =>
              handleCardInputChange("cardholderName", value)
            }
          />

          <View className="flex-row justify-between">
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white w-[48%]"
              placeholder="MM/YY"
              value={cardInfo.expiryDate}
              onChangeText={(value) =>
                handleCardInputChange("expiryDate", value)
              }
              maxLength={5}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-base bg-white w-[48%]"
              placeholder="CVV"
              value={cardInfo.cvv}
              onChangeText={(value) => handleCardInputChange("cvv", value)}
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>
        </View>
      )}
    </View>
  );
};
