import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface CategoryFilterProps {
  categories: (string | { slug?: string; name?: string })[];
  selectedCategory: string;
  handleCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  handleCategoryChange,
}) => {
  return (
    <View className="bg-white py-3 border-b border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <TouchableOpacity
          className={`rounded-full px-4 py-2 mr-2 ${
            selectedCategory === "" ? "bg-blue-600" : "bg-gray-100"
          }`}
          onPress={() => handleCategoryChange("")}
          activeOpacity={0.7}
        >
          <Text
            className={`text-sm font-medium ${
              selectedCategory === "" ? "text-white" : "text-gray-500"
            }`}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map((category, index) => {
          const categoryName =
            typeof category === "string"
              ? category.toLowerCase()
              : (
                  category?.slug ||
                  category?.name ||
                  String(category)
                ).toLowerCase();
          const isSelected = selectedCategory === categoryName;
          return (
            <TouchableOpacity
              key={`category-${index}-${categoryName}`}
              className={`rounded-full px-4 py-2 mr-2 ${
                isSelected ? "bg-blue-600" : "bg-gray-100"
              }`}
              onPress={() => handleCategoryChange(categoryName)}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-white" : "text-gray-500"
                }`}
              >
                {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
