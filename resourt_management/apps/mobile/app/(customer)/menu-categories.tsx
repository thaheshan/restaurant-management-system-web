import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@components/layout/Header";
import SafeAreaContainer from "@components/layout/SafeAreaContainer";
import { api } from "@services/api";
import { COLORS } from "@constants/colors";
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from "@constants/spacing";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.md) / 2;

const CATEGORY_IMAGES: Record<string, string> = {
  default: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
  rice: "https://images.unsplash.com/photo-1609501676725-7186f017a4b5?w=400",
  pasta: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  sushi: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
  dessert: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
  beverages: "https://images.unsplash.com/photo-1608037545488-c52646db42da?w=400",
  seafood: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400",
  meat: "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
};

const getCategoryImage = (name: string) => {
  const key = name.toLowerCase().replace(/\s/g, "");
  return CATEGORY_IMAGES[key] || CATEGORY_IMAGES.default;
};

export default function MenuCategoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tableId = params.tableId as string;
  const restaurantId = params.restaurantId as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restaurantName, setRestaurantName] = useState("DineSmart");

  useEffect(() => {
    fetchCategories();
  }, [restaurantId]);

  const fetchCategories = async () => {
    if (!restaurantId) {
      setError("No restaurant ID found");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await api.getCategories(restaurantId);
      console.log("Categories:", data);
      if (data.success && data.categories) {
        setCategories(data.categories);
      } else {
        setError("Failed to load menu");
      }
    } catch (err) {
      console.error("Fetch categories error:", err);
      setError("Network error — check backend is running");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    categoryCard: {
      width: ITEM_WIDTH,
      margin: SPACING.md / 2,
      borderRadius: BORDER_RADIUS.lg,
      overflow: "hidden",
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.border,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageContainer: {
      width: "100%",
      height: ITEM_WIDTH,
      backgroundColor: COLORS.gray[100],
      overflow: "hidden",
    },
    image: { width: "100%", height: "100%" },
    nameContainer: {
      padding: SPACING.md,
      alignItems: "center",
      justifyContent: "center",
    },
    categoryName: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
      textAlign: "center",
    },
    tableIdText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      marginBottom: SPACING.md,
      textAlign: "center",
    },
    errorText: {
      color: "red",
      textAlign: "center",
      padding: SPACING.lg,
    },
    emptyText: {
      color: COLORS.text.secondary,
      textAlign: "center",
      padding: SPACING.lg,
    },
  });

  const handleCategoryPress = (category: any) => {
    router.push({
      pathname: "/(customer)/menu-items/[category]",
      params: {
        category: category.id,
        categoryName: category.name,
        tableId,
        restaurantId,
      },
    });
  };

  const renderCategoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image_url || getCategoryImage(item.name) }}
          style={styles.image}
        />
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.categoryName}>{item.name.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header title={restaurantName} subtitle={`Table ${tableId}`} />
      <SafeAreaContainer scrollable style={{ backgroundColor: COLORS.surface }}>
        <Text style={styles.tableIdText}>
          Select a category to browse menu
        </Text>

        {loading && (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        )}

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        {!loading && !error && categories.length === 0 && (
          <Text style={styles.emptyText}>
            No categories found. Add categories from the web dashboard.
          </Text>
        )}

        {!loading && categories.length > 0 && (
          <FlatList
            data={categories}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
        )}
      </SafeAreaContainer>
    </>
  );
}
