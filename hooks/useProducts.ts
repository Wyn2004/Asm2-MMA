import { useCallback, useEffect, useState } from "react";
import { ApiService } from "../services/api";
import { LoadingState, Product, ProductsResponse } from "../types";

interface UseProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  useCache?: boolean;
  autoFetch?: boolean;
}

interface UseProductsReturn extends LoadingState {
  products: Product[];
  totalProducts: number;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
  clearCache: () => void;
}

export const useProducts = ({
  limit = 20,
  skip = 0,
  search,
  category,
  useCache = true,
  autoFetch = true,
}: UseProductsParams = {}): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSkip, setCurrentSkip] = useState(skip);

  const fetchProducts = useCallback(
    async (skipValue: number = 0, append: boolean = false) => {
      try {
        setIsLoading(true);
        setError(null);

        const response: ProductsResponse = await ApiService.getProducts(
          limit,
          skipValue,
          search,
          category,
          useCache
        );

        if (append) {
          setProducts((prev) => [...prev, ...response.products]);
        } else {
          setProducts(response.products);
        }

        setTotalProducts(response.total);
        setCurrentSkip(skipValue);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
        if (!append) {
          setProducts([]);
          setTotalProducts(0);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [limit, search, category, useCache]
  );

  const refresh = useCallback(() => {
    setCurrentSkip(0);
    fetchProducts(0, false);
  }, [fetchProducts]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    const nextSkip = currentSkip + limit;
    setCurrentSkip(nextSkip);
    fetchProducts(nextSkip, true);
  }, [fetchProducts, currentSkip, limit, isLoading]);

  const clearCache = useCallback(async () => {
    await ApiService.clearCache();
    refresh();
  }, [refresh]);

  const hasMore = products.length < totalProducts;

  useEffect(() => {
    if (autoFetch) {
      fetchProducts(0, false);
    }
  }, [fetchProducts, autoFetch]);

  return {
    products,
    totalProducts,
    hasMore,
    isLoading,
    error,
    refresh,
    loadMore,
    clearCache,
  };
};
