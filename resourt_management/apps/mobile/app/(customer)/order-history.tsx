import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import { useOrder } from '@contexts/OrderContext';
import { useCart } from '@contexts/CartContext';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function OrderHistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tableId = params.tableId as string;

  const { getOrderHistory, currentOrder } = useOrder();
  const { setTableId } = useCart();

  const orders = getOrderHistory(tableId);
  const allOrders = currentOrder ? [currentOrder, ...orders] : orders;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    emptyState: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xxl,
      flex: 1,
    },
    emptyText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.text.secondary,
      marginBottom: SPACING.lg,
    },
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
    orderStatus: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.md,
      overflow: 'hidden',
      color: COLORS.white,
    },
    served: {
      backgroundColor: COLORS.success,
    },
    pending: {
      backgroundColor: COLORS.warning,
    },
    itemsContainer: {
      marginBottom: SPACING.md,
    },
    itemRow: {
      flexDirection: 'row',
      marginBottom: SPACING.sm,
      alignItems: 'center',
    },
    itemImage: {
      width: 40,
      height: 40,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: COLORS.gray[100],
      marginRight: SPACING.md,
    },
    itemName: {
      flex: 1,
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
    },
    itemQty: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
      marginRight: SPACING.sm,
    },
    orderFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    totalText: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
    },
    reorderButton: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
    },
    reorderButtonText: {
      color: COLORS.primary,
      fontWeight: FONT_WEIGHTS.semibold,
      fontSize: FONT_SIZES.sm,
    },
    buttonContainer: {
      padding: SPACING.lg,
      paddingBottom: SPACING.xl,
      gap: SPACING.md,
    },
  });

  const handleReorder = (orderId: string) => {
    const order = allOrders.find((o) => o.id === orderId);
    if (order) {
      // Add all items from previous order to cart
      order.items.forEach((item) => {
        // In a real app, we'd add these to cart
      });
      router.back();
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleNewOrder = () => {
    // Clear and go back to QR scanner
    router.push('/');
  };

  const renderOrderCard = ({ item }: { item: any }) => (
    <Card style={styles.orderCard}>
      {/* Header */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{item.id}</Text>
        <Text style={[styles.orderStatus, item.status === 'served' ? styles.served : styles.pending]}>
          {item.status === 'served' ? 'Completed' : 'In Progress'}
        </Text>
      </View>

      {/* Items */}
      <View style={styles.itemsContainer}>
        {item.items.slice(0, 3).map((subItem: any, idx: number) => (
          <View key={idx} style={styles.itemRow}>
            <Image source={{ uri: subItem.image }} style={styles.itemImage} />
            <Text style={styles.itemName}>{subItem.name}</Text>
            <Text style={styles.itemQty}>x{subItem.quantity}</Text>
          </View>
        ))}
        {item.items.length > 3 && (
          <Text style={{ ...styles.itemName, fontStyle: 'italic' }}>
            +{item.items.length - 3} more items
          </Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>Rs. {item.total}</Text>
        <TouchableOpacity
          style={styles.reorderButton}
          onPress={() => handleReorder(item.id)}
        >
          <Text style={styles.reorderButtonText}>Reorder</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <>
      <Header title="Order History" showBackButton onBackPress={handleBackPress} />
      <SafeAreaContainer style={styles.container} scrollable>
        {allOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Button title="Place New Order" onPress={handleNewOrder} />
          </View>
        ) : (
          <View style={styles.content}>
            <FlatList
              data={allOrders}
              renderItem={renderOrderCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </SafeAreaContainer>

      {/* Bottom Actions */}
      <View style={styles.buttonContainer}>
        <Button
          title="Place New Order"
          size="large"
          onPress={handleNewOrder}
        />
        {allOrders.length > 0 && (
          <Button
            title="Back"
            variant="secondary"
            size="large"
            onPress={handleBackPress}
          />
        )}
      </View>
    </>
  );
}
