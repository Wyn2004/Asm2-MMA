import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  searchQuery: string;
  handleSearchInputChange: (query: string) => void;
  handleClearSearch: () => void;
  handleSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  handleSearchInputChange,
  handleClearSearch,
  handleSearch,
}) => {
  return (
    <View className="flex-row items-center bg-white rounded-lg shadow-sm mx-4 mb-4 p-3 mt-4">
      <TextInput
        className="flex-1 text-gray-900 text-base"
        placeholder="Search products..."
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={handleSearchInputChange}
        onSubmitEditing={() => handleSearch(searchQuery)}
        returnKeyType="search"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={handleClearSearch}
          className="ml-2 p-1"
          activeOpacity={0.7}
        >
          <Text className="text-gray-400 text-lg">✕</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => handleSearch(searchQuery)}
        className="ml-2 bg-blue-600 rounded-lg px-4 py-2"
        activeOpacity={0.8}
      >
        <Text className="text-white font-medium">Search</Text>
      </TouchableOpacity>
    </View>
  );
};
