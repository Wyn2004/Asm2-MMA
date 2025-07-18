import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Cart, CartItem, Product } from "../types";

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartItemQuantity: (productId: number) => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: "SET_CART"; payload: Cart }
  | { type: "ADD_TO_CART"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: { productId: number } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: number; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean };

const cartReducer = (
  state: { cart: Cart; isLoading: boolean },
  action: CartAction
) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "ADD_TO_CART": {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.cart.items.findIndex(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.cart.items, { product, quantity }];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const newCart = {
        items: newItems,
        totalItems,
        totalPrice,
      };

      return {
        ...state,
        cart: newCart,
      };
    }

    case "REMOVE_FROM_CART": {
      const newItems = state.cart.items.filter(
        (item) => item.product.id !== action.payload.productId
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const newCart = {
        items: newItems,
        totalItems,
        totalPrice,
      };

      return {
        ...state,
        cart: newCart,
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_FROM_CART",
          payload: { productId },
        });
      }

      const newItems = state.cart.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const newCart = {
        items: newItems,
        totalItems,
        totalPrice,
      };

      return {
        ...state,
        cart: newCart,
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      };

    default:
      return state;
  }
};

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const CART_STORAGE_KEY = "user_cart";

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: initialCart,
    isLoading: true,
  });

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const cart = JSON.parse(storedCart);
        dispatch({ type: "SET_CART", payload: cart });
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const saveCart = async (cart: Cart) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, quantity } });

    // Calculate new cart state for saving
    const existingItemIndex = state.cart.items.findIndex(
      (item) => item.product.id === product.id
    );

    let newItems: CartItem[];
    if (existingItemIndex >= 0) {
      newItems = state.cart.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [...state.cart.items, { product, quantity }];
    }

    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = newItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newCart = {
      items: newItems,
      totalItems,
      totalPrice,
    };

    await saveCart(newCart);
  };

  const removeFromCart = async (productId: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId } });

    const newItems = state.cart.items.filter(
      (item) => item.product.id !== productId
    );

    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = newItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newCart = {
      items: newItems,
      totalItems,
      totalPrice,
    };

    await saveCart(newCart);
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const newItems = state.cart.items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );

    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = newItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newCart = {
      items: newItems,
      totalItems,
      totalPrice,
    };

    await saveCart(newCart);
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });
    await saveCart(initialCart);
  };

  const getCartItemQuantity = (productId: number): number => {
    const item = state.cart.items.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemQuantity,
    isLoading: state.isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
