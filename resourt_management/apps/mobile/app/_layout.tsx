import React from 'react';
import { Stack } from 'expo-router';
import { CartProvider } from '@contexts/CartContext';
import { AdminAuthProvider } from '@contexts/AdminAuthContext';
import { OrderProvider } from '@contexts/OrderContext';
import { CustomerAuthProvider } from '@contexts/CustomerAuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootLayoutContent() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ gestureEnabled: false, animation: 'none' }} />
      <Stack.Screen name="(customer)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
     <SafeAreaProvider>
    <CustomerAuthProvider>
      <CartProvider>
        <AdminAuthProvider>
          <OrderProvider>
            <RootLayoutContent />
          </OrderProvider>
        </AdminAuthProvider>
      </CartProvider>
    </CustomerAuthProvider>
    </SafeAreaProvider>
  );
}
