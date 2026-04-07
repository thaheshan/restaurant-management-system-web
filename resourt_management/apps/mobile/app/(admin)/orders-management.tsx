import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import { useOrder } from '@contexts/OrderContext';
import { OrderStatus } from '@/types';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Check, 
  Info, 
  ClipboardList 
} from 'lucide-react-native';

export default function OrdersManagementScreen() {
  const router = useRouter();
  const { currentOrder } = useOrder();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(currentOrder?.status || null);

  const STATUS_OPTIONS: OrderStatus[] = ['placed', 'prep', 'in-progress', 'served'];

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return { label: 'New', Icon: Sparkles, variant: 'info' as const };
      case 'prep': return { label: 'Prep', Icon: Flame, variant: 'warning' as const };
      case 'in-progress': return { label: 'Active', Icon: Clock, variant: 'warning' as const };
      case 'served': return { label: 'Served', Icon: Check, variant: 'success' as const };
      default: return { label: status, Icon: Info, variant: 'neutral' as const };
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f7f9',
    },
    content: {
      padding: SPACING.lg,
      flex: 1,
    },
    orderCard: {
      padding: SPACING.lg,
      marginBottom: SPACING.xl,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingBottom: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray[100],
      marginBottom: SPACING.lg,
    },
    orderId: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
    },
    tableLabel: {
      fontSize: 14,
      color: COLORS.text.secondary,
      marginTop: 2,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: COLORS.text.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: SPACING.md,
    },
    itemsContainer: {
      backgroundColor: COLORS.gray[50],
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.xl,
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
      borderBottomWidth: 0.5,
      borderBottomColor: COLORS.gray[200],
    },
    itemName: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      color: COLORS.text.primary,
      flex: 1,
    },
    itemQty: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.secondary,
      marginRight: SPACING.md,
    },
    itemPrice: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
    },
    statusGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: SPACING.sm,
    },
    statusToggle: {
      width: '48%',
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.gray[200],
      padding: SPACING.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    statusToggleActive: {
      backgroundColor: COLORS.status.info + '10',
      borderColor: COLORS.status.info,
    },
    toggleText: {
      fontSize: 13,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.secondary,
      marginLeft: SPACING.sm,
    },
    toggleTextActive: {
      color: COLORS.status.info,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 100,
    },
    emptyText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.text.secondary,
      marginTop: SPACING.md,
      fontWeight: FONT_WEIGHTS.medium,
    },
  });

  if (!currentOrder) {
    return (
      <>
        <Header title="Order Status" onBackPress={() => router.back()} showBackButton />
        <SafeAreaContainer style={styles.container}>
          <View style={styles.emptyState}>
            <ClipboardList size={64} color={COLORS.gray[300]} strokeWidth={1} />
            <Text style={styles.emptyText}>No Active Orders</Text>
            <Text style={{ color: COLORS.gray[400], fontSize: 14 }}>System is up to date.</Text>
          </View>
        </SafeAreaContainer>
      </>
    );
  }

  return (
    <>
      <Header title="Orders Management" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer style={styles.container} scrollable>
        <View style={styles.content}>
          <Card style={styles.orderCard} shadow>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>{currentOrder.id}</Text>
                <Text style={styles.tableLabel}>TABLE {currentOrder.tableId}</Text>
              </View>
              <Badge 
                label={getStatusInfo(currentOrder.status).label} 
                variant={getStatusInfo(currentOrder.status).variant} 
              />
            </View>

            <Text style={styles.sectionTitle}>Order Items</Text>
            <View style={styles.itemsContainer}>
              {currentOrder.items.map((item, idx) => (
                <View key={idx} style={[styles.itemRow, idx === currentOrder.items.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.itemQty}>x{item.quantity}</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>Rs. {item.price * item.quantity}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Update Status</Text>
            <View style={styles.statusGrid}>
              {STATUS_OPTIONS.map((status) => {
                const info = getStatusInfo(status);
                const isActive = selectedStatus === status;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[styles.statusToggle, isActive && styles.statusToggleActive]}
                    onPress={() => setSelectedStatus(status)}
                    activeOpacity={0.7}
                  >
                    <info.Icon 
                      size={14} 
                      color={isActive ? COLORS.status.info : COLORS.text.secondary} 
                      strokeWidth={2.5}
                    />
                    <Text style={[styles.toggleText, isActive && styles.toggleTextActive]}>
                      {info.label.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </View>
      </SafeAreaContainer>
    </>
  );
}
