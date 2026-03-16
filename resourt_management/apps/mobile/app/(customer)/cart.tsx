import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import CartItemRow from '@components/cards/CartItemRow';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import { useCart } from '@contexts/CartContext';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function CartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tableId = params.tableId as string;

  const { items, removeItem, updateQuantity, getSubtotal, getTaxAmount, getTotal } = useCart();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    itemsContainer: {
      flex: 1,
      padding: SPACING.lg,
    },
    emptyState: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xxl,
    },
    emptyText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.text.secondary,
      textAlign: 'center',
      marginBottom: SPACING.lg,
    },
    summaryCard: {
      backgroundColor: COLORS.surface,
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      marginHorizontal: SPACING.lg,
      marginBottom: SPACING.lg,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    summaryLabel: {
      fontSize: FONT_SIZES.base,
      color: COLORS.text.secondary,
    },
    summaryValue: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
    },
    totalValue: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
    },
    buttonContainer: {
      padding: SPACING.lg,
      paddingBottom: SPACING.xl,
    },
    continueShopping: {
      marginTop: SPACING.md,
    },
  });

  const subtotal = getSubtotal();
  const taxAmount = getTaxAmount();
  const total = getTotal();

  const handleBackPress = () => {
    router.back();
  };

  const handleProceed = () => {
    router.push({
      pathname: '/(customer)/order-summary',
      params: { tableId },
    });
  };

  if (items.length === 0) {
    return (
      <>
        <Header title="Shopping Cart" onBackPress={handleBackPress} showBackButton />
        <SafeAreaContainer style={styles.container}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Button title="Continue Shopping" onPress={() => router.back()} />
          </View>
        </SafeAreaContainer>
      </>
    );
  }

  return (
    <>
      <Header title="Shopping Cart" onBackPress={handleBackPress} showBackButton />
      <SafeAreaContainer style={styles.container}>
        <View style={styles.itemsContainer}>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <CartItemRow
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rs. {subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (10%)</Text>
            <Text style={styles.summaryValue}>Rs. {taxAmount}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs. {total}</Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Proceed to Payment"
            size="large"
            onPress={handleProceed}
          />
          <Button
            title="Continue Shopping"
            variant="secondary"
            size="large"
            onPress={handleBackPress}
            style={styles.continueShopping}
          />
        </View>
      </SafeAreaContainer>
    </>
  );
}
