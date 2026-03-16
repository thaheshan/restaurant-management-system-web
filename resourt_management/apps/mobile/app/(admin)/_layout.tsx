import React from 'react';
import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'default',
      }}
    >
      <Stack.Screen name="admin-login" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="orders-management" />
      <Stack.Screen name="inventory" />
      <Stack.Screen name="hygiene-compliance" />
      <Stack.Screen name="expiry-alerts" />
      <Stack.Screen name="staff-profile" />
    </Stack>
  );
}