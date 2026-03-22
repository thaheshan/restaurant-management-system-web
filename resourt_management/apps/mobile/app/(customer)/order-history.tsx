import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import { useCustomerAuth } from '@contexts/CustomerAuthContext';
import { api } from '@services/api';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

const STATUS_COLORS: Record<string, string> = {
  order_placed: '#2196F3',
  start_prep: '#FF9800',
  in_progress: '#FF6F00',
  served: '#4CAF50',
};

const STATUS_LABELS: Record<string, string> = {
  order_placed: 'Order Placed',
  start_prep: 'Start Prep',
  in_progress: 'In Progress',
  served: 'Served',
};

export default function OrderHistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tableId = params.tableId as string;
  const restaurantId = params.restaurantId as string;

  const { token } = useCustomerAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await api.getMyOrders(token);
      console.log('My orders:', data);
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = () => {
    if (restaurantId && tableId) {
      router.push({
        pathname: '/(customer)/menu-categories',
        params: { tableId, restaurantId },
      });
    } else {
      router.push('/(customer)/home');
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Order History" showBackButton onBackPress={() => router.back()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </>
    );
  }

  return (
    <>
      <Header title="Order History" showBackButton onBackPress={() => router.back()} />
      <SafeAreaContainer scrollable>
        {orders.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl }}>
            <Text style={{ fontSize: 48, marginBottom: SPACING.lg }}>📋</Text>
            <Text style={{ fontSize: FONT_SIZES.lg, color: COLORS.text.secondary, marginBottom: SPACING.lg }}>
              No orders yet
            </Text>
            <Button title="Place New Order" onPress={handleNewOrder} />
          </View>
        ) : (
          <View style={{ padding: SPACING.lg }}>
            {orders.map((order) => (
              <Card key={order.id} style={{ marginBottom: SPACING.md, padding: SPACING.lg }}>
                {/* Header */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: SPACING.md,
                  paddingBottom: SPACING.md,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.border,
                }}>
                  <View>
                    <Text style={{
                      fontSize: FONT_SIZES.base,
                      fontWeight: FONT_WEIGHTS.bold,
                      color: COLORS.primary,
                    }}>
                      #{order.id.slice(0, 8)}
                    </Text>
                    <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.text.secondary }}>
                      Table {order.table_number} • {new Date(order.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={{
                    paddingHorizontal: SPACING.sm,
                    paddingVertical: SPACING.xs,
                    borderRadius: BORDER_RADIUS.md,
                    backgroundColor: `${STATUS_COLORS[order.order_status] || '#999'}20`,
                  }}>
                    <Text style={{
                      fontSize: FONT_SIZES.xs,
                      fontWeight: FONT_WEIGHTS.semibold,
                      color: STATUS_COLORS[order.order_status] || '#999',
                    }}>
                      {STATUS_LABELS[order.order_status] || order.order_status}
                    </Text>
                  </View>
                </View>

                {/* Items */}
                <View style={{ marginBottom: SPACING.md }}>
                  {(Array.isArray(order.items) ? order.items : [])
                    .filter((item: any) => item.name)
                    .slice(0, 3)
                    .map((item: any, idx: number) => (
                      <Text key={idx} style={{
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.text.secondary,
                        marginBottom: SPACING.xs,
                      }}>
                        • {item.name} x{item.quantity}
                      </Text>
                    ))}
                </View>

                {/* Footer */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: SPACING.md,
                  borderTopWidth: 1,
                  borderTopColor: COLORS.border,
                }}>
                  <Text style={{
                    fontSize: FONT_SIZES.base,
                    fontWeight: FONT_WEIGHTS.bold,
                    color: COLORS.primary,
                  }}>
                    Rs. {isNaN(parseFloat(order.grand_total)) ? '0' : parseFloat(order.grand_total).toLocaleString()}
                  </Text>
                  {order.order_status !== 'served' && (
                    <TouchableOpacity onPress={() => router.push({
                      pathname: '/(customer)/order-tracking',
                      params: { orderId: order.id, tableId, restaurantId },
                    })}>
                      <Text style={{
                        fontSize: FONT_SIZES.sm,
                        color: COLORS.primary,
                        fontWeight: FONT_WEIGHTS.semibold,
                      }}>
                        Track Order →
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Bottom Buttons */}
        <View style={{ padding: SPACING.lg, paddingBottom: SPACING.xl, gap: SPACING.md }}>
          <Button title="🍽 Place New Order" size="large" onPress={handleNewOrder} />
          <Button
            title="Back"
            variant="secondary"
            size="large"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaContainer>
    </>
  );
}