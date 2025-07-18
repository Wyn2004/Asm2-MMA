import { useCallback, useEffect, useState } from "react";
import { ApiService } from "../services/api";
import { LoadingState } from "../types";

interface UseCategoriesParams {
  useCache?: boolean;
  autoFetch?: boolean;
}

interface UseCategoriesReturn extends LoadingState {
  categories: string[];
  refresh: () => void;
  clearCache: () => void;
}

export const useCategories = ({
  useCache = true,
  autoFetch = true,
}: UseCategoriesParams = {}): UseCategoriesReturn => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const categoriesData = await ApiService.getCategories(useCache);
      setCategories(categoriesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [useCache]);

  const refresh = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  const clearCache = useCallback(async () => {
    await ApiService.clearCache();
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [fetchCategories, autoFetch]);

  return {
    categories,
    isLoading,
    error,
    refresh,
    clearCache,
  };
};
