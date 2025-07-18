import { useCallback, useEffect, useState } from "react";
import { ApiService } from "../services/api";
import { LoadingState, Product } from "../types";

interface UseProductParams {
  useCache?: boolean;
  autoFetch?: boolean;
}

interface UseProductReturn extends LoadingState {
  product: Product | null;
  refresh: () => void;
  clearCache: () => void;
}

export const useProduct = (
  productId: number,
  { useCache = true, autoFetch = true }: UseProductParams = {}
): UseProductReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      setError(null);

      const productData = await ApiService.getProduct(productId, useCache);
      setProduct(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId, useCache]);

  const refresh = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  const clearCache = useCallback(async () => {
    await ApiService.invalidateProductCache(productId);
    refresh();
  }, [productId, refresh]);

  useEffect(() => {
    if (autoFetch) {
      fetchProduct();
    }
  }, [fetchProduct, autoFetch]);

  return {
    product,
    isLoading,
    error,
    refresh,
    clearCache,
  };
};
