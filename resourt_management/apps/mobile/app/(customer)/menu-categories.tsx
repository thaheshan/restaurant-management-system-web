import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import SafeAreaContainer from "@components/layout/SafeAreaContainer";
import Header from "@components/layout/Header";
import { api } from "@services/api";
import { useCart } from "@contexts/CartContext";
import { useCustomerAuth } from "@contexts/CustomerAuthContext";
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
  drinks: "https://images.unsplash.com/photo-1608037545488-c52646db42da?w=400",
  fastfood: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  maincourse: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
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

  const { items: cartItems } = useCart();
  const { logout } = useCustomerAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (restaurantId) fetchCategories();
  }, [restaurantId]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories(restaurantId);
      if (data.success && data.categories) {
        setCategories(data.categories);
      } else {
        setError("Failed to load menu");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

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

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const RightIcons = () => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm }}>
      {/* Order History */}
      <TouchableOpacity
        onPress={() => router.push({
          pathname: "/(customer)/order-history",
          params: { tableId, restaurantId },
        })}
        style={{
          width: 36, height: 36,
          borderRadius: 18,
          backgroundColor: "rgba(255,255,255,0.2)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>📋</Text>
      </TouchableOpacity>

      {/* Cart with badge */}
      <TouchableOpacity
        onPress={() => router.push({
          pathname: "/(customer)/cart",
          params: { tableId, restaurantId },
        })}
        style={{
          width: 36, height: 36,
          borderRadius: 18,
          backgroundColor: "rgba(255,255,255,0.2)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>🛒</Text>
        {cartCount > 0 && (
          <View style={{
            position: "absolute",
            top: -2, right: -2,
            width: 16, height: 16,
            borderRadius: 8,
            backgroundColor: "#FF5722",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Text style={{ fontSize: 9, color: "#fff", fontWeight: "700" }}>
              {cartCount > 9 ? "9+" : cartCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          width: 36, height: 36,
          borderRadius: 18,
          backgroundColor: "rgba(255,255,255,0.2)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>🚪</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <>
        <Header
          title="DineSmart"
          subtitle={`Table ${tableId}`}
          rightIcon={<RightIcons />}
        />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </>
    );
  }

  return (
    <>
      <Header
        title="DineSmart"
        subtitle={`Table ${tableId}`}
        rightIcon={<RightIcons />}
      />
      <SafeAreaContainer scrollable style={{ backgroundColor: COLORS.surface }}>
        <Text style={{
          fontSize: FONT_SIZES.sm,
          color: COLORS.text.secondary,
          textAlign: "center",
          padding: SPACING.md,
        }}>
          Select a category to browse menu
        </Text>

        {error ? (
          <Text style={{ color: COLORS.error, textAlign: "center", padding: SPACING.lg }}>
            {error}
          </Text>
        ) : null}

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={{ padding: SPACING.md }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
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
              }}
              onPress={() => handleCategoryPress(item)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: item.image_url || getCategoryImage(item.name) }}
                style={{ width: "100%", height: ITEM_WIDTH }}
              />
              <View style={{ padding: SPACING.md, alignItems: "center" }}>
                <Text style={{
                  fontSize: FONT_SIZES.base,
                  fontWeight: FONT_WEIGHTS.bold,
                  color: COLORS.text.primary,
                  textAlign: "center",
                }}>
                  {item.name.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaContainer>
    </>
  );
}