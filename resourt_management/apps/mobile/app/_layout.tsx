import React from 'react';
import { Stack } from 'expo-router';
import { CartProvider } from '@contexts/CartContext';
import { AdminAuthProvider } from '@contexts/AdminAuthContext';
import { OrderProvider } from '@contexts/OrderContext';
import { CustomerAuthProvider, useCustomerAuth } from '@contexts/CustomerAuthContext';

function RootLayoutContent() {
  const { isLoggedIn } = useCustomerAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      {!isLoggedIn ? (
        // Auth Stack - shown when user is not logged in
        <Stack.Group screenOptions={{ animationEnabled: false }}>
          <Stack.Screen 
            name="(auth)" 
            options={{
              gestureEnabled: false,
            }}
          />
        </Stack.Group>
      ) : (
        // App Stack - shown when user is logged in
        <>
          <Stack.Group screenOptions={{ animationEnabled: true }}>
            <Stack.Screen name="(customer)" />
          </Stack.Group>

          <Stack.Group screenOptions={{ animationEnabled: true }}>
            <Stack.Screen name="(admin)" />
          </Stack.Group>
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <CustomerAuthProvider>
      <CartProvider>
        <AdminAuthProvider>
          <OrderProvider>
            <RootLayoutContent />
          </OrderProvider>
        </AdminAuthProvider>
      </CartProvider>
    </CustomerAuthProvider>
  );
}
