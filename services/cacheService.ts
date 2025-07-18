import AsyncStorage from "@react-native-async-storage/async-storage";

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // in milliseconds
}

export class CacheService {
  private static readonly CACHE_PREFIX = "app_cache_";
  private static readonly DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutes

  static async set<T>(
    key: string,
    data: T,
    expiresIn: number = this.DEFAULT_EXPIRY
  ): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn,
      };

      await AsyncStorage.setItem(
        `${this.CACHE_PREFIX}${key}`,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await AsyncStorage.getItem(
        `${this.CACHE_PREFIX}${key}`
      );

      if (!cachedData) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cachedData);
      const now = Date.now();

      // Check if cache has expired
      if (now - cacheItem.timestamp > cacheItem.expiresIn) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error("Error getting cache:", error);
      return null;
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.CACHE_PREFIX}${key}`);
    } catch (error) {
      console.error("Error removing cache:", error);
    }
  }

  static async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key: string) =>
        key.startsWith(this.CACHE_PREFIX)
      );
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  static async isExpired(key: string): Promise<boolean> {
    try {
      const cachedData = await AsyncStorage.getItem(
        `${this.CACHE_PREFIX}${key}`
      );

      if (!cachedData) {
        return true;
      }

      const cacheItem: CacheItem<any> = JSON.parse(cachedData);
      const now = Date.now();

      return now - cacheItem.timestamp > cacheItem.expiresIn;
    } catch (error) {
      console.error("Error checking cache expiry:", error);
      return true;
    }
  }
}
