import { useCallback, useEffect, useState } from "react";
import { ApiService } from "../services/api";
import { LoadingState, Product } from "../types";

interface UseProductReturn extends LoadingState {
  product: Product | null;
  refresh: () => void;
}

export const useProduct = (productId: number): UseProductReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      setError(null);

      const productData = await ApiService.getProduct(productId);
      setProduct(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  const refresh = useCallback(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refresh,
  };
};
