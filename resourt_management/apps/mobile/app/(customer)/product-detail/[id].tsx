import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Button from '@components/ui/Button';
import QuantitySelector from '@components/ui/QuantitySelector';
import Card from '@components/ui/Card';
import { MenuItem, CartItem } from '@/types';
import { MENU_ITEMS } from '@services/mockData';
import { useCart } from '@contexts/CartContext';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addItem } = useCart();

  const productId = params.id as string;
  const tableId = params.tableId as string;

  const [quantity, setQuantity] = useState(1);

  const product: MenuItem | undefined = useMemo(() => {
    for (const category in MENU_ITEMS) {
      const item = MENU_ITEMS[category].find((item) => item.id === productId);
      if (item) return item;
    }
    return undefined;
  }, [productId]);

  const styles = StyleSheet.create({
    productImage: {
      width: '100%',
      height: 300,
      backgroundColor: COLORS.gray[100],
    },
    contentContainer: {
      padding: SPACING.lg,
    },
    nameText: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
      marginBottom: SPACING.sm,
    },
    descriptionText: {
      fontSize: FONT_SIZES.base,
      color: COLORS.text.secondary,
      lineHeight: 22,
      marginBottom: SPACING.lg,
    },
    sectionLabel: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
      marginTop: SPACING.lg,
      marginBottom: SPACING.md,
    },
    ingredientItem: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      marginLeft: SPACING.md,
      marginBottom: SPACING.xs,
    },
    quantityLabel: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
      marginBottom: SPACING.md,
    },
    quantitySelector: {
      width: 120,
      marginBottom: SPACING.lg,
    },
    priceCard: {
      backgroundColor: COLORS.surface,
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.lg,
    },
    priceLabel: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      marginBottom: SPACING.xs,
    },
    priceText: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
    },
    totalText: {
      fontSize: FONT_SIZES.base,
      color: COLORS.text.secondary,
      marginTop: SPACING.md,
    },
  });

  if (!product) {
    return (
      <>
        <Header title="Product" onBackPress={() => router.back()} showBackButton />
        <SafeAreaContainer>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text style={{ color: COLORS.text.secondary }}>Product not found</Text>
            <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: SPACING.lg }} />
          </View>
        </SafeAreaContainer>
      </>
    );
  }

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      category: product.category,
    };

    addItem(cartItem);
    Alert.alert(
      'Added to Cart',
      `${product.name} (x${quantity}) has been added to your cart`,
      [
        {
          text: 'Continue Shopping',
          onPress: () => router.back(),
        },
        {
          text: 'View Cart',
          onPress: () =>
            router.push({
              pathname: '/(customer)/cart',
              params: { tableId },
            }),
        },
      ]
    );
  };

  const totalPrice = product.price * quantity;

  return (
    <>
      <Header title="Product Details" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer scrollable>
        <Image source={{ uri: product.image }} style={styles.productImage} />

        <View style={styles.contentContainer}>
          <Text style={styles.nameText}>{product.name}</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>

          {product.ingredients && product.ingredients.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Ingredients</Text>
              {product.ingredients.map((ingredient, idx) => (
                <Text key={idx} style={styles.ingredientItem}>
                  • {ingredient}
                </Text>
              ))}
            </>
          )}

          <Text style={styles.sectionLabel}>Quantity</Text>
          <QuantitySelector
            quantity={quantity}
            onIncrement={() => setQuantity((q) => Math.min(q + 1, 10))}
            onDecrement={() => setQuantity((q) => Math.max(q - 1, 1))}
            style={styles.quantitySelector}
          />

          <Card style={styles.priceCard}>
            <Text style={styles.priceLabel}>Unit Price</Text>
            <Text style={styles.priceText}>Rs. {product.price}</Text>
            {quantity > 1 && (
              <Text style={styles.totalText}>
                Total: Rs. {totalPrice} (x{quantity})
              </Text>
            )}
          </Card>

          <Button
            title="Add to Cart"
            size="large"
            onPress={handleAddToCart}
          />
        </View>
      </SafeAreaContainer>
    </>
  );
}