import React from 'react';
import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="menu-categories" />
      <Stack.Screen name="menu-items/[category]" />
      <Stack.Screen name="product-detail/[id]" />
      <Stack.Screen name="cart" />
      <Stack.Screen name="order-summary" />
      <Stack.Screen name="payment-method" />
      <Stack.Screen name="order-confirmation" />
      <Stack.Screen name="order-tracking" />
      <Stack.Screen name="order-history" />
    </Stack>
  );
}
