import { Product, ProductsResponse } from "../types";
import { CacheService } from "./cacheService";

const BASE_URL = "https://dummyjson.com";

export class ApiService {
  private static readonly CACHE_EXPIRY = {
    PRODUCTS: 5 * 60 * 1000, // 5 minutes
    PRODUCT: 10 * 60 * 1000, // 10 minutes
    CATEGORIES: 30 * 60 * 1000, // 30 minutes
  };

  static async getProducts(
    limit: number = 20,
    skip: number = 0,
    search?: string,
    category?: string,
    useCache: boolean = true
  ): Promise<ProductsResponse> {
    const cacheKey = `products_${limit}_${skip}_${search || "all"}_${
      category || "all"
    }`;

    // Try to get from cache first
    if (useCache) {
      const cachedData = await CacheService.get<ProductsResponse>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      let url = `${BASE_URL}/products`;

      if (search) {
        url = `${BASE_URL}/products/search`;
      } else if (category) {
        url = `${BASE_URL}/products/category/${category}`;
      }

      const params = new URLSearchParams({
        limit: limit.toString(),
        skip: skip.toString(),
      });

      if (search) {
        params.append("q", search);
      }

      const response = await fetch(`${url}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      if (useCache) {
        await CacheService.set(cacheKey, data, this.CACHE_EXPIRY.PRODUCTS);
      }

      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  static async getProduct(
    id: number,
    useCache: boolean = true
  ): Promise<Product> {
    const cacheKey = `product_${id}`;

    // Try to get from cache first
    if (useCache) {
      const cachedData = await CacheService.get<Product>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      if (useCache) {
        await CacheService.set(cacheKey, data, this.CACHE_EXPIRY.PRODUCT);
      }

      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  static async getCategories(useCache: boolean = true): Promise<string[]> {
    const cacheKey = "categories";

    // Try to get from cache first
    if (useCache) {
      const cachedData = await CacheService.get<string[]>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      const response = await fetch(`${BASE_URL}/products/categories`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the result
      if (useCache) {
        await CacheService.set(cacheKey, data, this.CACHE_EXPIRY.CATEGORIES);
      }

      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  static async clearCache(): Promise<void> {
    await CacheService.clear();
  }

  static async invalidateProductCache(productId?: number): Promise<void> {
    if (productId) {
      await CacheService.remove(`product_${productId}`);
    } else {
      // Clear all product-related caches
      const keys = ["products", "product", "categories"];
      for (const key of keys) {
        await CacheService.remove(key);
      }
    }
  }
}
