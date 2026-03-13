import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useCustomerAuth } from '@contexts/CustomerAuthContext';
import { colors } from '@constants/colors';

export default function EntryPoint() {
  const router = useRouter();
  const { isLoggedIn } = useCustomerAuth();

  useEffect(() => {
    // Navigation is handled by root layout's conditional rendering
    // This effect ensures we're redirected properly based on auth state
    if (isLoggedIn) {
      router.replace('/(customer)/home');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn, router]);

  // Show loading screen while determining auth state and redirecting
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
