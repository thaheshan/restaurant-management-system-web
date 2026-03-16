import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import { useOrder } from '@contexts/OrderContext';
import { useCart } from '@contexts/CartContext';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;
  const tableId = params.tableId as string;

  const { getCurrentOrder } = useOrder();
  const { clearCart } = useCart();
  const order = getCurrentOrder(orderId);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.lg,
    },
    successIcon: {
      fontSize: 80,
      marginBottom: SPACING.lg,
      textAlign: 'center',
    },
    title: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    subtitle: {
      fontSize: FONT_SIZES.base,
      color: COLORS.text.secondary,
      textAlign: 'center',
      marginBottom: SPACING.xl,
    },
    card: {
      width: '100%',
      marginBottom: SPACING.lg,
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.md,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    cardRowLast: {
      borderBottomWidth: 0,
      marginBottom: 0,
      paddingBottom: 0,
    },
    label: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      fontWeight: FONT_WEIGHTS.medium,
    },
    value: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
    },
    orderId: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
    },
    estimatedTimeContainer: {
      backgroundColor: COLORS.primary,
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      alignItems: 'center',
      marginBottom: SPACING.xl,
    },
    estimatedTimeLabel: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.white,
      marginBottom: SPACING.sm,
    },
    estimatedTime: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.white,
    },
    buttonContainer: {
      padding: SPACING.lg,
      paddingBottom: SPACING.xl,
      gap: SPACING.md,
    },
  });

  useEffect(() => {
    // Clear cart after order is created
    clearCart();
  }, []);

  if (!order) {
    return (
      <SafeAreaContainer>
        <View style={styles.content}>
          <Text style={styles.title}>Order Not Found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaContainer>
    );
  }

  const handleTrackOrder = () => {
    router.push({
      pathname: '/(customer)/order-tracking',
      params: { orderId: order.id, tableId },
    });
  };

  return (
    <SafeAreaContainer style={styles.container} scrollable>
      <View style={styles.content}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>Thank you for your order</Text>

        {/* Order Details Card */}
        <Card style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>ORDER ID</Text>
            <Text style={styles.orderId}>{order.id}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>TABLE NUMBER</Text>
            <Text style={styles.value}>{order.tableId}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>TOTAL AMOUNT</Text>
            <Text style={styles.value}>Rs. {order.total}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>PAYMENT METHOD</Text>
            <Text style={styles.value}>
              {order.paymentMethod === 'debitCard'
                ? 'Debit Card'
                : order.paymentMethod === 'creditCard'
                  ? 'Credit Card'
                  : 'Cash'}
            </Text>
          </View>
          <View style={[styles.cardRow, styles.cardRowLast]}>
            <Text style={styles.label}>NUMBER OF ITEMS</Text>
            <Text style={styles.value}>{order.items.length}</Text>
          </View>
        </Card>

        {/* Estimated Time */}
        <View style={styles.estimatedTimeContainer}>
          <Text style={styles.estimatedTimeLabel}>ESTIMATED WAIT TIME</Text>
          <Text style={styles.estimatedTime}>{order.estimatedTime} min</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Track Your Order"
          size="large"
          onPress={handleTrackOrder}
        />
        <Button
          title="Order History"
          variant="secondary"
          size="large"
          onPress={() =>
            router.push({
              pathname: '/(customer)/order-history',
              params: { tableId },
            })
          }
        />
      </View>
    </SafeAreaContainer>
  );
}
