import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import SafeAreaContainer from "@components/layout/SafeAreaContainer";
import Header from "@components/layout/Header";
import QuantitySelector from "@components/ui/QuantitySelector";
import Button from "@components/ui/Button";
import { ShoppingBag, ShoppingCart, Info, X, PlusCircle } from 'lucide-react-native';
import { api } from "@services/api";
import { useCart } from "@contexts/CartContext";
import { COLORS } from "@constants/colors";
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from "@constants/spacing";

export default function MenuItemsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryId = params.category as string;
  const categoryName = params.categoryName as string;
  const tableId = params.tableId as string;
  const restaurantId = params.restaurantId as string;

  const { addItem } = useCart();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [categoryId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.getCategoryItems(categoryId);
      console.log("Items response:", data);
      if (data.items) {
        setItems(data.items);
      } else {
        setError("Failed to load items");
      }
    } catch (err) {
      console.error("Fetch items error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setQuantity(1);
    setModalVisible(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    addItem({
      id: selectedItem.id,
      name: selectedItem.name,
      price: parseFloat(selectedItem.price),
      quantity,
      image: selectedItem.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
      category: categoryName || "Uncategorized",
    });
    Alert.alert("Added!", `${selectedItem.name} x${quantity} added to cart`);
    setModalVisible(false);
  };

  const handleViewCart = () => {
    router.push({
      pathname: "/(customer)/cart",
      params: { tableId, restaurantId },
    });
  };

  if (loading) {
    return (
      <>
        <Header title={categoryName || "Menu"} showBackButton onBackPress={() => router.back()} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </>
    );
  }

  return (
    <>
      <Header
        title={categoryName || "Menu"}
        showBackButton
        onBackPress={() => router.back()}
        rightIcon={
          <TouchableOpacity onPress={handleViewCart} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={24} color={COLORS.white} />
          </TouchableOpacity>
        }
      />
      <SafeAreaContainer scrollable>
        <View style={{ padding: SPACING.lg }}>
          <Text style={{
            fontSize: FONT_SIZES.xl,
            fontWeight: FONT_WEIGHTS.bold,
            color: COLORS.text.primary,
            textDecorationLine: "underline",
            marginBottom: SPACING.lg,
          }}>
            {categoryName ? categoryName.charAt(0) + categoryName.slice(1).toLowerCase() : "Menu"}
          </Text>

          {error ? (
            <Text style={{ color: COLORS.error, textAlign: "center" }}>{error}</Text>
          ) : items.length === 0 ? (
            <Text style={{ color: COLORS.text.secondary, textAlign: "center" }}>
              No items in this category yet.
            </Text>
          ) : (
            <View style={{ gap: SPACING.lg }}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => item.is_available !== false && handleItemPress(item)}
                  activeOpacity={item.is_available !== false ? 0.9 : 1}
                  style={{
                    backgroundColor: COLORS.white,
                    borderRadius: BORDER_RADIUS.lg,
                    padding: SPACING.lg,
                    opacity: item.is_available !== false ? 1 : 0.6,
                    shadowColor: COLORS.black,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.06,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs }}>
                    <Text style={{
                      fontSize: FONT_SIZES.lg,
                      fontWeight: FONT_WEIGHTS.bold,
                      color: COLORS.text.primary,
                      flex: 1,
                    }}>
                      {item.name}
                    </Text>
                    {item.is_available === false && (
                      <View style={{ backgroundColor: COLORS.gray[200], paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.text.secondary }}>SOLD OUT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.text.secondary,
                    lineHeight: 20,
                    marginBottom: SPACING.sm,
                  }}>
                    {item.description}
                  </Text>
                  <Text style={{
                    fontSize: FONT_SIZES.base,
                    fontWeight: FONT_WEIGHTS.semibold,
                    color: COLORS.text.primary,
                    marginBottom: SPACING.md,
                  }}>
                    Rs. {parseFloat(item.price).toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: item.is_available !== false ? COLORS.primary : COLORS.gray[300],
                      paddingVertical: SPACING.sm,
                      paddingHorizontal: SPACING.lg,
                      borderRadius: BORDER_RADIUS.md,
                      alignSelf: "flex-start",
                      marginBottom: SPACING.md,
                    }}
                    onPress={() => item.is_available !== false && handleItemPress(item)}
                    disabled={item.is_available === false}
                  >
                    <PlusCircle size={16} color={COLORS.white} style={{ marginRight: SPACING.xs }} />
                    <Text style={{
                      color: COLORS.white,
                      fontSize: FONT_SIZES.sm,
                      fontWeight: FONT_WEIGHTS.semibold,
                    }}>
                      {item.is_available !== false ? "Add to Cart" : "Unavailable"}
                    </Text>
                  </TouchableOpacity>
                  <Image
                    source={{
                      uri: item.image_url ||
                        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
                    }}
                    style={{
                      width: "100%",
                      aspectRatio: 4 / 3,
                      borderRadius: BORDER_RADIUS.md,
                      backgroundColor: COLORS.gray[100],
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </SafeAreaContainer>

      {/* Item Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}>
          <View style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: BORDER_RADIUS.xl,
            borderTopRightRadius: BORDER_RADIUS.xl,
            padding: SPACING.lg,
            maxHeight: "80%",
          }}>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: SPACING.lg,
                top: SPACING.lg,
                width: 36, height: 36,
                borderRadius: 18,
                backgroundColor: COLORS.gray[100],
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
              }}
              onPress={() => setModalVisible(false)}
            >
              <X size={20} color={COLORS.text.primary} />
            </TouchableOpacity>

            {selectedItem && (
              <>
                <Text style={{
                  fontSize: FONT_SIZES.lg,
                  fontWeight: FONT_WEIGHTS.bold,
                  color: COLORS.text.primary,
                  marginBottom: SPACING.md,
                  paddingRight: SPACING.xl,
                }}>
                  {selectedItem.name}
                </Text>
                <Text style={{
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.text.secondary,
                  marginBottom: SPACING.md,
                }}>
                  {selectedItem.description}
                </Text>
                {selectedItem.ingredients && (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.md }}>
                    <Info size={16} color={COLORS.text.secondary} style={{ marginTop: 2, marginRight: SPACING.xs }} />
                    <Text style={{
                      fontSize: FONT_SIZES.sm,
                      color: COLORS.text.secondary,
                      flex: 1,
                    }}>
                      {selectedItem.ingredients}
                    </Text>
                  </View>
                )}
                <Text style={{
                  fontSize: FONT_SIZES.sm,
                  fontWeight: FONT_WEIGHTS.semibold,
                  color: COLORS.text.primary,
                  marginBottom: SPACING.sm,
                }}>
                  Quantity:
                </Text>
                <QuantitySelector
                  quantity={quantity}
                  onIncrement={() => setQuantity((q) => Math.min(q + 1, 10))}
                  onDecrement={() => setQuantity((q) => Math.max(q - 1, 1))}
                />
                <View style={{
                  marginTop: SPACING.lg,
                  paddingTop: SPACING.md,
                  borderTopWidth: 1,
                  borderTopColor: COLORS.border,
                }}>
                  <Text style={{
                    fontSize: FONT_SIZES.xl,
                    fontWeight: FONT_WEIGHTS.bold,
                    color: COLORS.primary,
                    marginBottom: SPACING.lg,
                  }}>
                    Rs. {(parseFloat(selectedItem.price) * quantity).toLocaleString()}
                  </Text>
                  <Button 
                    title={selectedItem.is_available !== false ? "Add to Cart" : "Currently Unavailable"} 
                    onPress={handleAddToCart} 
                    disabled={selectedItem.is_available === false}
                    size="large" 
                    style={{ backgroundColor: selectedItem.is_available !== false ? COLORS.primary : COLORS.gray[400] }}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}