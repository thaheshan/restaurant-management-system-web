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
import { 
  Banknote, 
  CreditCard, 
  Wallet, 
  Ticket, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react-native';
import { useCart } from '@contexts/CartContext';
import { useCustomerAuth } from '@contexts/CustomerAuthContext';
import { api } from '@services/api';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

const PAYMENT_OPTIONS = [
  { id: 'cash', name: 'Cash in Hand', description: 'Pay when your food arrives', Icon: Banknote },
  { id: 'debitCard', name: 'Debit Card', description: 'Fast and secure online payment', Icon: CreditCard },
  { id: 'creditCard', name: 'Credit Card', description: 'Visa, Mastercard, AMEX', Icon: Wallet },
];

export default function PaymentMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tableId = params.tableId as string;
  const restaurantId = params.restaurantId as string;
  const total = params.total as string || "0";

  const { token } = useCustomerAuth();
  const orderId = params.orderId as string;

  const [selectedPayment, setSelectedPayment] = useState('debitCard');
  const [promoCode, setPromoCode] = useState('');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = async () => {
    if (!orderId) {
      Alert.alert('Error', 'No order found to pay for');
      return;
    }
    if (!token) {
      Alert.alert('Error', 'Please login first');
      return;
    }

    setLoading(true);
    try {
      console.log('Updating payment for order:', orderId, selectedPayment);
      const data = await api.updatePayment(orderId, selectedPayment, token);
      console.log('Payment update response:', data);

      if (data.success) {
        Alert.alert('Payment Successful', 'Thank you for your payment!');
        router.replace({
          pathname: '/(customer)/order-tracking',
          params: { orderId, tableId, restaurantId },
        });
      } else {
        Alert.alert('Error', data.error || 'Failed to process payment');
      }
    } catch (err) {
      console.error('Payment update error:', err);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
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
              <option.Icon size={24} color={selectedPayment === option.id ? COLORS.primary : COLORS.gray[400]} style={{ marginRight: SPACING.md }} />
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
              borderWidth: 1, borderColor: COLORS.border,
            }}
            onPress={() => setShowPromoModal(true)}
          >
            <Ticket size={24} color={COLORS.primary} style={{ marginRight: SPACING.md }} />
            <Text style={{ flex: 1, fontSize: FONT_SIZES.base, color: COLORS.text.primary, fontWeight: FONT_WEIGHTS.semibold }}>
              {promoCode ? `Promo Applied: ${promoCode}` : 'Have a Promo Code?'}
            </Text>
            <ChevronRight size={20} color={COLORS.text.secondary} />
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