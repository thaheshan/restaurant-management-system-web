import React, { useEffect, useState } from 'react';
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
import StatusTracker from '@components/cards/StatusTracker';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import { useOrder } from '@contexts/OrderContext';
import { OrderStatus } from '@types/index';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function OrderTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;
  const tableId = params.tableId as string;

  const { getCurrentOrder, updateOrderStatus } = useOrder();
  const order = getCurrentOrder(orderId);

  const [status, setStatus] = useState<OrderStatus>(order?.status || 'placed');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    timerCard: {
      backgroundColor: COLORS.primary,
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      margin: SPACING.lg,
      alignItems: 'center',
      marginBottom: SPACING.xl,
    },
    timerLabel: {
      fontSize: FONT_SIZES.sm,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: SPACING.sm,
    },
    timerValue: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.white,
    },
    content: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.lg,
      flex: 1,
    },
    statusTracker: {
      marginBottom: SPACING.xl,
    },
    itemsLabel: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
      marginBottom: SPACING.md,
    },
    orderItem: {
      flexDirection: 'row',
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      borderColor: COLORS.border,
      overflow: 'hidden',
      marginBottom: SPACING.md,
      alignItems: 'center',
    },
    itemImage: {
      width: 70,
      height: 70,
      backgroundColor: COLORS.gray[100],
    },
    itemContent: {
      flex: 1,
      padding: SPACING.md,
    },
    itemName: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
      marginBottom: SPACING.xs,
    },
    itemQty: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
    },
    illustrationContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.xl,
      marginBottom: SPACING.lg,
    },
    illustration: {
      fontSize: 80,
      marginBottom: SPACING.lg,
    },
    illustrationText: {
      fontSize: FONT_SIZES.base,
      color: COLORS.text.secondary,
      textAlign: 'center',
    },
    buttonContainer: {
      padding: SPACING.lg,
      paddingBottom: SPACING.xl,
      gap: SPACING.md,
    },
  });

  if (!order) {
    return (
      <>
        <Header title="Order Tracking" showBackButton onBackPress={() => router.back()} />
        <SafeAreaContainer>
          <View style={styles.content}>
            <Text style={styles.itemsLabel}>Order not found</Text>
            <Button title="Go Back" onPress={() => router.back()} />
          </View>
        </SafeAreaContainer>
      </>
    );
  }

  // Simulate status updates for demo
  useEffect(() => {
    const statusSequence: OrderStatus[] = ['placed', 'prep', 'in-progress', 'served'];
    const currentIndex = statusSequence.indexOf(status);

    const timer = setTimeout(() => {
      if (currentIndex < statusSequence.length - 1) {
        const nextStatus = statusSequence[currentIndex + 1];
        setStatus(nextStatus);
        updateOrderStatus(orderId, nextStatus);
      }
    }, 5000); // Change status every 5 seconds for demo

    return () => clearTimeout(timer);
  }, [status]);

  const handleProceedToBill = () => {
    if (status === 'served') {
      router.push({
        pathname: '/(customer)/order-history',
        params: { tableId },
      });
    } else {
      Alert.alert('Order Not Ready', 'Your order is still being prepared. Please wait.');
    }
  };

  const minRemaining = Math.max(order.estimatedTime - Math.floor(Math.random() * 15), 0);

  return (
    <>
      <Header title="Order Status" showBackButton onBackPress={() => router.back()} />
      <SafeAreaContainer style={styles.container} scrollable>
        {/* Estimated Time */}
        <Card style={styles.timerCard}>
          <Text style={styles.timerLabel}>Estimated Wait Time</Text>
          <Text style={styles.timerValue}>{minRemaining} min</Text>
        </Card>

        <View style={styles.content}>
          {/* Status Tracker */}
          <StatusTracker currentStatus={status} style={styles.statusTracker} />

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Text style={styles.illustration}>👨‍🍳</Text>
            <Text style={styles.illustrationText}>Your delicious food is being prepared</Text>
          </View>

          {/* Order Items */}
          <Text style={styles.itemsLabel}>Your Order</Text>
          <FlatList
            data={order.items}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {status === 'served' ? (
            <>
              <Button
                title="View Bill"
                size="large"
                onPress={handleProceedToBill}
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
            </>
          ) : (
            <Button
              title="Preparing... (Status auto-updates)"
              size="large"
              disabled
            />
          )}
        </View>
      </SafeAreaContainer>
    </>
  );
}
