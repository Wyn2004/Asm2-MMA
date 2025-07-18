import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Product } from "../types";

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

type FavoritesAction =
  | { type: "SET_FAVORITES"; payload: Product[] }
  | { type: "ADD_FAVORITE"; payload: Product }
  | { type: "REMOVE_FAVORITE"; payload: number }
  | { type: "CLEAR_FAVORITES" }
  | { type: "SET_LOADING"; payload: boolean };

const favoritesReducer = (
  state: { favorites: Product[]; isLoading: boolean },
  action: FavoritesAction
) => {
  switch (action.type) {
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "ADD_FAVORITE": {
      const exists = state.favorites.some(
        (item) => item.id === action.payload.id
      );
      if (exists) return state;
      return { ...state, favorites: [...state.favorites, action.payload] };
    }

    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((item) => item.id !== action.payload),
      };

    case "CLEAR_FAVORITES":
      return { ...state, favorites: [] };

    default:
      return state;
  }
};

const FAVORITES_STORAGE_KEY = "user_favorites";

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(favoritesReducer, {
    favorites: [],
    isLoading: true,
  });

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        dispatch({ type: "SET_FAVORITES", payload: favorites });
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const saveFavorites = async (favorites: Product[]) => {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const addToFavorites = async (product: Product) => {
    // Check if already exists
    const exists = state.favorites.some((item) => item.id === product.id);
    if (exists) return;

    dispatch({ type: "ADD_FAVORITE", payload: product });
    const newFavorites = [...state.favorites, product];
    await saveFavorites(newFavorites);
  };

  const removeFromFavorites = async (productId: number) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: productId });
    const newFavorites = state.favorites.filter(
      (item) => item.id !== productId
    );
    await saveFavorites(newFavorites);
  };

  const isFavorite = (productId: number): boolean => {
    return state.favorites.some((item) => item.id === productId);
  };

  const clearFavorites = async () => {
    dispatch({ type: "CLEAR_FAVORITES" });
    await saveFavorites([]);
  };

  const value: FavoritesContextType = {
    favorites: state.favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    isLoading: state.isLoading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
