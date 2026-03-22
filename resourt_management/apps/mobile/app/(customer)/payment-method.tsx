import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Button from '@components/ui/Button';
import TextField from '@components/ui/TextField';
import Card from '@components/ui/Card';
import { useCart } from '@contexts/CartContext';
import { useCustomerAuth } from '@contexts/CustomerAuthContext';
import { api } from '@services/api';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

const PAYMENT_OPTIONS = [
  { id: 'cash', name: 'Cash in Hand', description: 'Pay when your food arrives', icon: '💵' },
  { id: 'debitCard', name: 'Debit Card', description: 'Fast and secure online payment', icon: '💳' },
  { id: 'creditCard', name: 'Credit Card', description: 'Visa, Mastercard, AMEX', icon: '💰' },
];

export default function PaymentMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tableId = params.tableId as string;
  const restaurantId = params.restaurantId as string;

  const { items, getTotal, clearCart } = useCart();
  const { token } = useCustomerAuth();

  const [selectedPayment, setSelectedPayment] = useState('debitCard');
  const [promoCode, setPromoCode] = useState('');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = getTotal();

  const handleConfirmPayment = async () => {
    if (!items.length) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }
    if (!token) {
      Alert.alert('Error', 'Please login first');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        restaurantId,
        tableNumber: parseInt(tableId),
        items: items.map((item) => ({
          menuItemId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod: selectedPayment,
        promoCode: promoCode || undefined,
      };

      console.log('Placing order:', orderData);
      const data = await api.placeOrder(orderData, token);
      console.log('Order placed response:', data);

      if (data.success || data.order?.id || data.orderId) {
        clearCart();
        const orderId = data.order?.id || data.orderId || 'new-order';
        router.push({
          pathname: '/(customer)/order-tracking',
          params: { orderId, tableId, restaurantId },
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

  return (
    <>
      <Header title="Payment Method" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer scrollable>
        <View style={{ padding: SPACING.lg }}>
          {/* Total */}
          <Card style={{
            backgroundColor: COLORS.surface,
            padding: SPACING.lg,
            borderRadius: BORDER_RADIUS.lg,
            marginBottom: SPACING.lg,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.text.secondary, marginBottom: SPACING.sm }}>
              ORDER TOTAL
            </Text>
            <Text style={{ fontSize: FONT_SIZES.xxl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary }}>
              Rs. {total.toLocaleString()}
            </Text>
          </Card>

          {/* Payment Methods */}
          <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text.primary, marginBottom: SPACING.md }}>
            Select Payment Method
          </Text>

          {PAYMENT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={{
                borderWidth: 2,
                borderColor: selectedPayment === option.id ? COLORS.primary : COLORS.border,
                backgroundColor: selectedPayment === option.id ? 'rgba(43,124,79,0.05)' : COLORS.white,
                borderRadius: BORDER_RADIUS.lg,
                padding: SPACING.md,
                marginBottom: SPACING.md,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => setSelectedPayment(option.id)}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 24, marginRight: SPACING.md }}>{option.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.semibold, color: COLORS.text.primary }}>
                  {option.name}
                </Text>
                <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.text.secondary }}>
                  {option.description}
                </Text>
              </View>
              <View style={{
                width: 24, height: 24, borderRadius: 12,
                borderWidth: 2,
                borderColor: selectedPayment === option.id ? COLORS.primary : COLORS.border,
                backgroundColor: selectedPayment === option.id ? COLORS.primary : COLORS.white,
                justifyContent: 'center', alignItems: 'center',
              }}>
                {selectedPayment === option.id && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.white }} />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Promo Code */}
          <TouchableOpacity
            style={{
              flexDirection: 'row', alignItems: 'center',
              marginBottom: SPACING.lg, padding: SPACING.md,
              backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg,
            }}
            onPress={() => setShowPromoModal(true)}
          >
            <Text style={{ fontSize: 18, marginRight: SPACING.md }}>🎟️</Text>
            <Text style={{ flex: 1, fontSize: FONT_SIZES.base, color: COLORS.text.primary }}>
              {promoCode ? `Promo: ${promoCode}` : 'Apply Promo Code'}
            </Text>
            <Text style={{ fontSize: 18, color: COLORS.text.secondary }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={{ padding: SPACING.lg, paddingBottom: SPACING.xl }}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <>
              <Button title="Confirm & Pay" size="large" onPress={handleConfirmPayment} />
              <Button
                title="Back"
                variant="secondary"
                size="large"
                onPress={() => router.back()}
                style={{ marginTop: SPACING.md }}
              />
            </>
          )}
        </View>
      </SafeAreaContainer>

      {/* Promo Modal */}
      <Modal visible={showPromoModal} transparent animationType="slide" onRequestClose={() => setShowPromoModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: COLORS.white, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, paddingBottom: SPACING.xl }}>
            <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text.primary, marginBottom: SPACING.lg }}>
              Apply Promo Code
            </Text>
            <TextField placeholder="Enter promo code" value={promoCode} onChangeText={setPromoCode} label="Promo Code" />
            <Button title="Apply" size="large" onPress={() => setShowPromoModal(false)} style={{ marginBottom: SPACING.md }} />
            <Button title="Cancel" variant="secondary" size="large" onPress={() => setShowPromoModal(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}