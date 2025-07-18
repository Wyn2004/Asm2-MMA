import { Product, ProductsResponse } from "../types";

const BASE_URL = "https://dummyjson.com";

export class ApiService {
  static async getProducts(
    limit: number = 20,
    skip: number = 0,
    search?: string,
    category?: string
  ): Promise<ProductsResponse> {
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
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  static async getProduct(id: number): Promise<Product> {
    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/products/categories`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
}
