import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { CategoryFilter } from "../components/CategoryFilter";
import { Header } from "../components/Header";
import { ProductList } from "../components/ProductList";
import { SearchBar } from "../components/SearchBar";
import { useCart } from "../context/CartContext";
import { ApiService } from "../services/api";
import { Product } from "../types";

export const SimpleProductList: React.FC = () => {
  const { cart, addToCart, isLoading: cartLoading } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const loadCategories = async () => {
    try {
      const categoriesData = await ApiService.getCategories();
      const normalizedCategories = categoriesData.map((category: any) =>
        typeof category === "string"
          ? category
          : (category?.slug || category?.name || String(category)).toLowerCase()
      );
      setCategories(normalizedCategories);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadProducts = async (
    reset: boolean = true,
    search?: string,
    category?: string
  ) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const skip = reset ? 0 : products.length;
      const limit = 20;

      const response = await ApiService.getProducts(
        limit,
        skip,
        search,
        category
      );

      if (reset) {
        setProducts(response.products);
      } else {
        setProducts((prev) => [...prev, ...response.products]);
      }

      setHasMore(response.products.length === limit);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load products";
      setError(errorMessage);
      if (reset) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory("");
    loadProducts(true, query);
  };

  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        setSelectedCategory("");
        loadProducts(true);
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("");
    loadProducts(true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
    loadProducts(true, undefined, category);
  };

  const handleEndReached = () => {
    if (!loadingMore && hasMore && !loading) {
      loadProducts(false, searchQuery, selectedCategory);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  // Show loading indicator if cart is still loading
  if (cartLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-500">Loading...</Text>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Text className="text-red-500 text-center text-lg mb-4">{error}</Text>
        <TouchableOpacity
          onPress={() => loadProducts()}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header totalItems={cart.totalItems} />
      <SearchBar
        searchQuery={searchQuery}
        handleSearchInputChange={handleSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
      />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
      />
      {loading && products.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-500">Loading products...</Text>
        </View>
      ) : (
        <ProductList
          products={products}
          loadingMore={loadingMore}
          handleEndReached={handleEndReached}
          addToCart={handleAddToCart}
        />
      )}
    </View>
  );
};
