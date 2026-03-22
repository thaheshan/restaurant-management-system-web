import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@components/layout/Header";
import SafeAreaContainer from "@components/layout/SafeAreaContainer";
import Button from "@components/ui/Button";
import { useCustomerAuth } from "@contexts/CustomerAuthContext";
import { api } from "@services/api";
import { COLORS } from "@constants/colors";
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from "@constants/spacing";

const STATUS_STEPS = [
  { id: "order_placed", label: "Order Placed", icon: "📋" },
  { id: "start_prep", label: "Start Prep", icon: "👨‍🍳" },
  { id: "in_progress", label: "In Progress", icon: "🍳" },
  { id: "served", label: "Served", icon: "✅" },
];

const getStepIndex = (status: string) => {
  const map: Record<string, number> = {
    order_placed: 0,
    start_prep: 1,
    in_progress: 2,
    served: 3,
  };
  return map[status] ?? 0;
};

export default function OrderTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;
  const tableId = params.tableId as string;
  const restaurantId = params.restaurantId as string;

  const { token } = useCustomerAuth();
  const [status, setStatus] = useState("order_placed");
  const [loading, setLoading] = useState(true);
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<any>(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            return 0;
          }
          setMinutes((m) => m - 1);
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [minutes]);

  // Fetch order status
  const fetchOrderStatus = async () => {
    if (!orderId || !token) return;
    try {
      const data = await api.getOrderStatus(orderId, token);
      console.log("Order status response:", data);
      if (data.success && data.order) {
        setStatus(data.order.order_status);
      }
    } catch (err) {
      console.error("Fetch order status error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Poll every 5 seconds
  useEffect(() => {
    fetchOrderStatus();
    intervalRef.current = setInterval(fetchOrderStatus, 5000);
    return () => clearInterval(intervalRef.current);
  }, [orderId, token]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const currentStepIndex = getStepIndex(status);

  if (loading) {
    return (
      <>
        <Header title="Order Status" showBackButton onBackPress={() => router.back()} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </>
    );
  }

  return (
    <>
      <Header title="Order Status" showBackButton onBackPress={() => router.back()} />
      <SafeAreaContainer scrollable>

        {/* Timer */}
        <View style={{
          backgroundColor: COLORS.primary,
          margin: SPACING.lg,
          borderRadius: BORDER_RADIUS.xl,
          padding: SPACING.xl,
          alignItems: "center",
        }}>
          <Text style={{
            fontSize: FONT_SIZES.sm,
            color: "rgba(255,255,255,0.8)",
            marginBottom: SPACING.xs,
          }}>
            Estimated waiting time
          </Text>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
            <Text style={{ fontSize: 32, fontWeight: FONT_WEIGHTS.bold, color: COLORS.white }}>
              {pad(minutes)}
            </Text>
            <Text style={{ fontSize: FONT_SIZES.sm, color: "rgba(255,255,255,0.7)" }}>Min</Text>
            <Text style={{ fontSize: 32, fontWeight: FONT_WEIGHTS.bold, color: COLORS.white }}>:</Text>
            <Text style={{ fontSize: 32, fontWeight: FONT_WEIGHTS.bold, color: COLORS.white }}>
              {pad(seconds)}
            </Text>
            <Text style={{ fontSize: FONT_SIZES.sm, color: "rgba(255,255,255,0.7)" }}>Sec</Text>
          </View>
        </View>

        {/* Status Tracker */}
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: SPACING.lg,
          marginBottom: SPACING.xl,
        }}>
          {STATUS_STEPS.map((step, index) => (
            <View key={step.id} style={{ alignItems: "center", flex: 1 }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
                position: "relative",
              }}>
                {index > 0 && (
                  <View style={{
                    position: "absolute",
                    left: 0,
                    right: "50%",
                    height: 3,
                    backgroundColor: index <= currentStepIndex
                      ? COLORS.primary : COLORS.gray[200],
                  }} />
                )}
                <View style={{
                  width: 36, height: 36,
                  borderRadius: 18,
                  backgroundColor: index <= currentStepIndex
                    ? COLORS.primary : COLORS.white,
                  borderWidth: 3,
                  borderColor: index <= currentStepIndex
                    ? COLORS.primary : COLORS.gray[200],
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}>
                  <Text style={{
                    color: index <= currentStepIndex ? COLORS.white : COLORS.gray[400],
                    fontSize: 12,
                    fontWeight: FONT_WEIGHTS.bold,
                  }}>
                    {index <= currentStepIndex ? "✓" : (index + 1).toString()}
                  </Text>
                </View>
                {index < STATUS_STEPS.length - 1 && (
                  <View style={{
                    position: "absolute",
                    left: "50%",
                    right: 0,
                    height: 3,
                    backgroundColor: index < currentStepIndex
                      ? COLORS.primary : COLORS.gray[200],
                  }} />
                )}
              </View>
              <Text style={{
                fontSize: FONT_SIZES.xs,
                color: index <= currentStepIndex
                  ? COLORS.text.primary : COLORS.text.secondary,
                fontWeight: index <= currentStepIndex
                  ? FONT_WEIGHTS.semibold : FONT_WEIGHTS.regular,
                textAlign: "center",
                marginTop: SPACING.xs,
              }}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Current Status */}
        <View style={{
          marginHorizontal: SPACING.lg,
          padding: SPACING.md,
          backgroundColor: status === "served"
            ? "rgba(76,175,80,0.1)" : "rgba(43,124,79,0.1)",
          borderRadius: BORDER_RADIUS.lg,
          marginBottom: SPACING.lg,
          alignItems: "center",
        }}>
          <Text style={{
            fontSize: FONT_SIZES.base,
            fontWeight: FONT_WEIGHTS.semibold,
            color: COLORS.primary,
          }}>
            {status === "order_placed" && "⏳ Your order has been placed!"}
            {status === "start_prep" && "👨‍🍳 Kitchen is preparing your order!"}
            {status === "in_progress" && "🍳 Your food is being cooked!"}
            {status === "served" && "✅ Your order is ready!"}
          </Text>
          <Text style={{
            fontSize: FONT_SIZES.xs,
            color: COLORS.text.secondary,
            marginTop: 4,
          }}>
            Auto-updating every 5 seconds
          </Text>
        </View>

        {/* Illustration */}
        <View style={{ alignItems: "center", marginBottom: SPACING.xl }}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&h=400&fit=crop",
            }}
            style={{
              width: "90%",
              aspectRatio: 16 / 9,
              borderRadius: BORDER_RADIUS.xl,
            }}
          />
        </View>

        {/* Order Info */}
        <View style={{
          marginHorizontal: SPACING.lg,
          padding: SPACING.md,
          backgroundColor: COLORS.surface,
          borderRadius: BORDER_RADIUS.lg,
          marginBottom: SPACING.lg,
        }}>
          <Text style={{
            fontSize: FONT_SIZES.sm,
            color: COLORS.text.secondary,
            textAlign: "center",
          }}>
            Order ID: {orderId?.slice(0, 8)}... | Table: {tableId}
          </Text>
        </View>

        {/* Buttons */}
{/* Buttons */}
<View style={{
  paddingHorizontal: SPACING.lg,
  paddingBottom: SPACING.xl,
  gap: SPACING.md,
}}>
  {status === "served" ? (
    <>
      <Button
        title="✅ Order Complete - View History"
        size="large"
        onPress={() => router.push({
          pathname: "/(customer)/order-history",
          params: { tableId, restaurantId },
        })}
      />
      <Button
        title="🍽 Order More Items"
        variant="secondary"
        size="large"
        onPress={() => router.push({
          pathname: "/(customer)/menu-categories",
          params: { tableId, restaurantId },
        })}
      />
    </>
  ) : (
    <>
      <Button
        title="🍽 Order More Items"
        size="large"
        onPress={() => router.push({
          pathname: "/(customer)/menu-categories",
          params: { tableId, restaurantId },
        })}
      />
      <Button
        title="🔄 Refresh Status"
        variant="secondary"
        size="large"
        onPress={fetchOrderStatus}
      />
    </>
  )}
  <Button
    title="Order History"
    variant="secondary"
    size="large"
    onPress={() => router.push({
      pathname: "/(customer)/order-history",
      params: { tableId, restaurantId },
    })}
  />
</View>
      </SafeAreaContainer>
    </>
  );
}