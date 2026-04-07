import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import { useCart } from '@contexts/CartContext';
import { useCustomerAuth } from '@contexts/CustomerAuthContext';
import { api } from '@services/api';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function OrderSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tableId = params.tableId as string;

  const { items, getSubtotal, getTaxAmount, getTotal, clearCart } = useCart();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    itemsContainer: {
      padding: SPACING.lg,
      flex: 1,
    },
    itemRow: {
      flexDirection: 'row',
      marginBottom: SPACING.md,
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      borderColor: COLORS.border,
      overflow: 'hidden',
    },
    itemImage: {
      width: 80,
      height: 80,
      backgroundColor: COLORS.gray[100],
    },
    itemContent: {
      flex: 1,
      padding: SPACING.md,
      justifyContent: 'space-between',
    },
    itemName: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
    },
    itemDetails: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      marginTop: SPACING.xs,
    },
    itemPrice: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
    },
    summaryCard: {
      backgroundColor: COLORS.surface,
      padding: SPACING.lg,
      marginHorizontal: SPACING.lg,
      marginBottom: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
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
    backButton: {
      marginTop: SPACING.md,
    },
  });

  const subtotal = getSubtotal();
  const taxAmount = getTaxAmount();
  const total = getTotal();
  const { token } = useCustomerAuth();
  const [loading, setLoading] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handlePlaceOrder = async () => {
    if (!token) {
        Alert.alert('Error', 'Please login first');
        router.push('/(auth)/login');
        return;
    }

    setLoading(true);
    try {
      const orderData = {
        restaurantId: params.restaurantId as string || '35f2c4cc-3f75-4181-88e0-6733e4aba39e',
        tableNumber: parseInt(tableId),
        items: items.map((item) => ({
          menuItemId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod: 'pending', // Payment happens later
      };

      const data = await api.placeOrder(orderData, token);
      if (data.success || data.order?.id) {
        clearCart();
        const orderId = data.order?.id || data.orderId;
        router.replace({
          pathname: '/(customer)/order-tracking',
          params: { orderId, tableId, restaurantId: params.restaurantId },
        });
      } else {
        Alert.alert('Error', data.error || 'Failed to place order');
      }
    } catch (err) {
      console.error('Place order error:', err);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.itemRow}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>Qty: {item.quantity}</Text>
        </View>
        <Text style={styles.itemPrice}>Rs. {item.price * item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Header title="Order Summary" onBackPress={handleBackPress} showBackButton />
      <SafeAreaContainer style={styles.container} scrollable>
        <View style={styles.itemsContainer}>
          <FlatList
            data={items}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Summary */}
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
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>Rs. {total}</Text>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Placing Order..." : "Place Order"}
            size="large"
            onPress={handlePlaceOrder}
            disabled={loading}
          />
          <Button
            title="Back to Cart"
            variant="secondary"
            size="large"
            onPress={handleBackPress}
            style={styles.backButton}
            disabled={loading}
          />
        </View>
      </SafeAreaContainer>
    </>
  );
}
