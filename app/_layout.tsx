import { Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";
import "./globals.css";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
