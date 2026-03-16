import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useCustomerAuth } from '@contexts/CustomerAuthContext';

export default function EntryPoint() {
  const router = useRouter();
  const { isLoggedIn } = useCustomerAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace('/(customer)/home');
      } else {
        router.replace('/(auth)/login');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
      <ActivityIndicator size="large" color="#2B7C4F" />
    </View>
  );
}