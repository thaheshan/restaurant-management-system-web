import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Card from '@components/ui/Card';
import { useOrder } from '@contexts/OrderContext';
import type { OrderStatus } from '@/types';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function OrdersManagementScreen() {
  const router = useRouter();
  const { currentOrder } = useOrder();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(currentOrder?.status || null);

  const STATUS_OPTIONS: OrderStatus[] = ['placed', 'prep', 'in-progress', 'served'];

  const styles = StyleSheet.create({
    content: {
      padding: SPACING.lg,
      flex: 1,
    },
    orderCard: {
      marginBottom: SPACING.md,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.md,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    orderId: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
    },
    tableInfo: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
    },
    itemsList: {
      marginBottom: SPACING.md,
    },
    itemText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      marginBottom: SPACING.xs,
    },
    statusButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SPACING.sm,
      marginTop: SPACING.md,
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    statusButton: {
      flex: 1,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.xs,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusButtonActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    statusButtonText: {
      fontSize: FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
    },
    statusButtonTextActive: {
      color: COLORS.white,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.text.secondary,
    },
  });

  if (!currentOrder) {
    return (
      <>
        <Header title="Orders Management" onBackPress={() => router.back()} showBackButton />
        <SafeAreaContainer>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No active orders</Text>
          </View>
        </SafeAreaContainer>
      </>
    );
  }

  return (
    <>
      <Header title="Orders Management" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer scrollable>
        <View style={styles.content}>
          <Card style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>{currentOrder.id}</Text>
                <Text style={styles.tableInfo}>Table {currentOrder.tableId}</Text>
              </View>
              <Text style={{ fontSize: 20 }}>
                {currentOrder.status === 'placed' && '🆕'}
                {currentOrder.status === 'prep' && '👨‍🍳'}
                {currentOrder.status === 'in-progress' && '⏳'}
                {currentOrder.status === 'served' && '✓'}
              </Text>
            </View>

            {/* Items */}
            <View style={styles.itemsList}>
              {currentOrder.items.map((item, idx) => (
                <Text key={idx} style={styles.itemText}>
                  • {item.name} (x{item.quantity}) - Rs. {item.price * item.quantity}
                </Text>
              ))}
            </View>

            {/* Status Controls */}
            <View style={styles.statusButtons}>
              {STATUS_OPTIONS.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    selectedStatus === status && styles.statusButtonActive,
                  ]}
                  onPress={() => setSelectedStatus(status)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      selectedStatus === status && styles.statusButtonTextActive,
                    ]}
                  >
                    {status === 'placed' ? 'Placed' : status === 'prep' ? 'Prep' : status === 'in-progress' ? 'In Progress' : 'Served'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </View>
      </SafeAreaContainer>
    </>
  );
}
