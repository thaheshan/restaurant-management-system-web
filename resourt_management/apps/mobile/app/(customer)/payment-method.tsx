import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Button from '@components/ui/Button';
import TextField from '@components/ui/TextField';
import Card from '@components/ui/Card';
import type { PaymentOption } from '@/types';
import { useCart } from '@contexts/CartContext';
import { useOrder } from '@contexts/OrderContext';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'cash',
    name: 'Cash in Hand',
    description: 'Pay when your food arrives',
    icon: '💵',
  },
  {
    id: 'debitCard',
    name: 'Debit Card',
    description: 'Fast and secure online payment',
    icon: '💳',
  },
  {
    id: 'creditCard',
    name: 'Credit Card',
    description: 'Visa, Mastercard, AMEX',
    icon: '💰',
  },
];

export default function PaymentMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tableId = params.tableId as string;

  const { items, getTotal } = useCart();
  const { createOrder } = useOrder();

  const [selectedPayment, setSelectedPayment] = useState<string>('debitCard');
  const [promoCode, setPromoCode] = useState('');
  const [showPromoModal, setShowPromoModal] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: SPACING.lg,
      flex: 1,
    },
    orderTotalCard: {
      backgroundColor: COLORS.surface,
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.lg,
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      marginBottom: SPACING.sm,
    },
    totalAmount: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
    },
    sectionLabel: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
      marginBottom: SPACING.md,
    },
    sectionSubtitle: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      marginBottom: SPACING.md,
    },
    paymentOption: {
      borderWidth: 2,
      borderColor: COLORS.border,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    paymentOptionSelected: {
      borderColor: COLORS.primary,
      backgroundColor: 'rgba(43, 124, 79, 0.05)',
    },
    paymentIcon: {
      fontSize: 24,
      marginRight: SPACING.md,
    },
    paymentContent: {
      flex: 1,
    },
    paymentName: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
      marginBottom: SPACING.xs,
    },
    paymentDescription: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
    },
    radioButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: COLORS.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonSelected: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.primary,
    },
    radioButtonInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: COLORS.white,
    },
    promoSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.lg,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      backgroundColor: COLORS.surface,
      borderRadius: BORDER_RADIUS.lg,
    },
    promoIcon: {
      fontSize: 18,
      marginRight: SPACING.md,
    },
    promoText: {
      flex: 1,
      fontSize: FONT_SIZES.base,
      color: COLORS.text.primary,
      fontWeight: FONT_WEIGHTS.medium,
    },
    buttonContainer: {
      padding: SPACING.lg,
      paddingBottom: SPACING.xl,
    },
    backButton: {
      marginTop: SPACING.md,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: COLORS.white,
      borderTopLeftRadius: BORDER_RADIUS.xl,
      borderTopRightRadius: BORDER_RADIUS.xl,
      padding: SPACING.lg,
      paddingBottom: SPACING.xl,
    },
    modalTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
      marginBottom: SPACING.lg,
    },
  });

  const handleConfirmPayment = () => {
    const order = createOrder(tableId, items, selectedPayment as any);
    router.push({
      pathname: '/(customer)/order-confirmation',
      params: { orderId: order.id, tableId },
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderPaymentOption = (option: PaymentOption) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.paymentOption,
        selectedPayment === option.id && styles.paymentOptionSelected,
      ]}
      onPress={() => setSelectedPayment(option.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.paymentIcon}>{option.icon}</Text>
      <View style={styles.paymentContent}>
        <Text style={styles.paymentName}>{option.name}</Text>
        <Text style={styles.paymentDescription}>{option.description}</Text>
      </View>
      <View
        style={[
          styles.radioButton,
          selectedPayment === option.id && styles.radioButtonSelected,
        ]}
      >
        {selectedPayment === option.id && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );

  const total = getTotal();

  return (
    <>
      <Header title="Payment Method" onBackPress={handleBackPress} showBackButton />
      <SafeAreaContainer style={styles.container} scrollable>
        <View style={styles.content}>
          {/* Order Total */}
          <Card style={styles.orderTotalCard}>
            <Text style={styles.totalLabel}>ORDER TOTAL</Text>
            <Text style={styles.totalAmount}>Rs. {total}</Text>
          </Card>

          {/* Payment Methods */}
          <Text style={styles.sectionLabel}>Select Payment Method</Text>
          <Text style={styles.sectionSubtitle}>Choose how you'd like to pay for your order</Text>

          {PAYMENT_OPTIONS.map(renderPaymentOption)}

          {/* Promo Code */}
          <TouchableOpacity
            style={styles.promoSection}
            onPress={() => setShowPromoModal(true)}
          >
            <Text style={styles.promoIcon}>🎟️</Text>
            <Text style={styles.promoText}>Apply Promo Code</Text>
            <Text style={{ fontSize: 18, color: COLORS.text.secondary }}>›</Text>
          </TouchableOpacity>

          {promoCode && (
            <Text style={{ ...styles.sectionSubtitle, marginBottom: SPACING.md }}>
              Promo code applied: {promoCode}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Confirm & Pay"
            size="large"
            onPress={handleConfirmPayment}
          />
          <Button
            title="Back"
            variant="secondary"
            size="large"
            onPress={handleBackPress}
            style={styles.backButton}
          />
        </View>
      </SafeAreaContainer>

      {/* Promo Code Modal */}
      <Modal
        visible={showPromoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPromoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply Promo Code</Text>
            <TextField
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
              label="Promo Code"
            />
            <Button
              title="Apply"
              size="large"
              onPress={() => setShowPromoModal(false)}
              style={{ marginBottom: SPACING.md }}
            />
            <Button
              title="Cancel"
              variant="secondary"
              size="large"
              onPress={() => setShowPromoModal(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}