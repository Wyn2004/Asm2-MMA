import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomerInfo } from "../components/CustomerInfo";
import { Header } from "../components/HeaderCheckout";
import { OrderSummary } from "../components/OrderSummary";
import { PaymentMethod } from "../components/PaymentMethod";
import { PlaceOrderButton } from "../components/PlaceOrderButton";
import { useCart } from "../context/CartContext";

export const CheckoutScreen = () => {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const { name, email, phone, address, city, zipCode } = customerInfo;

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !zipCode.trim()
    ) {
      Alert.alert("Error", "Please fill in all customer information fields");
      return false;
    }

    if (paymentMethod === "credit_card") {
      const { cardNumber, expiryDate, cvv, cardholderName } = cardInfo;
      if (
        !cardNumber.trim() ||
        !expiryDate.trim() ||
        !cvv.trim() ||
        !cardholderName.trim()
      ) {
        Alert.alert("Error", "Please fill in all card information fields");
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Order Placed Successfully!",
        `Thank you ${customerInfo.name}! Your order has been placed and will be delivered to ${customerInfo.address}.`,
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.replace("/");
            },
          },
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-500 mb-5">Your cart is empty</Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-gray-100">
        <Header onBack={() => router.back()} />
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <OrderSummary items={cart.items} getTotalPrice={getTotalPrice} />
          <CustomerInfo
            customerInfo={customerInfo}
            handleInputChange={handleInputChange}
          />
          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cardInfo={cardInfo}
            handleCardInputChange={handleCardInputChange}
          />
        </ScrollView>
        <PlaceOrderButton
          isProcessing={isProcessing}
          handlePlaceOrder={handlePlaceOrder}
          getTotalPrice={getTotalPrice}
        />
      </View>
    </SafeAreaView>
  );
};
