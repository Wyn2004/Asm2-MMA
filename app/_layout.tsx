import { Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import "./globals.css";

export default function RootLayout() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </FavoritesProvider>
    </CartProvider>
  );
}
