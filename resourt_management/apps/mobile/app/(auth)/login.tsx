import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCustomerAuth } from '@contexts/CustomerAuthContext';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import TextField from '@components/ui/TextField';
import Button from '@components/ui/Button';
import { COLORS } from '@constants/colors';
import { SPACING } from '@constants/spacing';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useCustomerAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    setLoading(true);
    try {
      await login(phone.trim());
      router.replace('/(customer)/home');
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: SPACING.xl,
              paddingHorizontal: SPACING.md,
              marginBottom: SPACING.xl,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                color: COLORS.white,
                textAlign: 'center',
              }}
            >
              DineSmart
            </Text>
          </View>

          {/* Welcome Text */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: COLORS.text.primary,
                marginBottom: SPACING.sm,
              }}
            >
              Welcome Back!
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.text.secondary,
                lineHeight: 20,
              }}
            >
              Enter your phone number to access your account
            </Text>
          </View>

          {/* Phone Input */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: COLORS.text.primary,
                marginBottom: SPACING.sm,
              }}
            >
              Phone Number
            </Text>
            <TextField
              placeholder="Enter 10-digit phone number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={!loading}
            />
          </View>

          {/* Login Button */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            <Button
              title={loading ? 'Logging in...' : 'Login'}
              onPress={handleLogin}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            />
          </View>

          {/* Sign Up Link */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, color: COLORS.text.secondary }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text
                style={{
                  fontSize: 14,
                  color: COLORS.primary,
                  fontWeight: '600',
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
}