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
  const { cart, addToCart } = useCart();
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
    search?: string,
    category?: string,
    append: boolean = false
  ) => {
    try {
      if (!append) {
        if (products.length === 0) {
          setLoading(true);
        }
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const skip = append ? products.length : 0;
      const response = await ApiService.getProducts(20, skip, search, category);

      if (append) {
        setProducts((prev) => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
      }

      setHasMore(response.products.length === 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      loadProducts(query.trim(), selectedCategory);
    } else {
      loadProducts(undefined, selectedCategory);
    }
  };

  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }

    const newTimeout = setTimeout(() => {
      if (query.trim()) {
        loadProducts(query.trim(), selectedCategory);
      } else if (query === "") {
        loadProducts(undefined, selectedCategory);
      }
    }, 300);

    setSearchTimeout(newTimeout);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    loadProducts(undefined, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    const normalizedCategory = category.toLowerCase();
    setSelectedCategory(normalizedCategory);
    loadProducts(searchQuery || undefined, normalizedCategory);
  };

  const loadMoreProducts = () => {
    if (!loadingMore && hasMore && !loading) {
      loadProducts(searchQuery || undefined, selectedCategory, true);
    }
  };

  const handleEndReached = () => {
    loadMoreProducts();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-3 text-base text-gray-500">
          Loading products...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-red-500 text-center mb-4 text-base">{error}</Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-lg"
          onPress={() => loadProducts()}
        >
          <Text className="text-white font-semibold text-base">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Header totalItems={cart.totalItems} />
      <SearchBar
        searchQuery={searchQuery}
        handleSearchInputChange={handleSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
      />
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
        />
      )}
      <ProductList
        products={products}
        loadingMore={loadingMore}
        handleEndReached={handleEndReached}
        addToCart={addToCart}
      />
    </View>
  );
};
