import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCustomerAuth } from '@contexts/CustomerAuthContext';
import { SafeAreaContainer } from '@components/layout/SafeAreaContainer';
import { TextField } from '@components/ui/TextField';
import { Button } from '@components/ui/Button';
import { colors } from '@constants/colors';
import { spacing } from '@constants/spacing';

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
      // Navigate to home screen
      router.replace('/(customer)/home');
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header with Logo */}
          <View
            style={{
              backgroundColor: colors.primary,
              paddingVertical: spacing.xl,
              paddingHorizontal: spacing.md,
              marginBottom: spacing.xl,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                color: colors.white,
                textAlign: 'center',
              }}
            >
              DineSmart
            </Text>
          </View>

          {/* Welcome Section */}
          <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.textPrimary,
                marginBottom: spacing.sm,
              }}
            >
              Welcome Back!
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                lineHeight: 20,
              }}
            >
              Enter your phone number to access your account and place orders
            </Text>
          </View>

          {/* Form Section */}
          <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: spacing.sm,
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
            <Text
              style={{
                fontSize: 12,
                color: colors.textTertiary,
                marginTop: spacing.xs,
              }}
            >
              We'll use this to verify your account
            </Text>
          </View>

          {/* Login Button */}
          <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
            <Button
              title={loading ? 'Logging in...' : 'Login'}
              onPress={handleLogin}
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading && <ActivityIndicator color={colors.white} style={{ marginRight: spacing.sm }} />}
            </Button>
          </View>

          {/* Signup Link */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: spacing.xs,
            }}
          >
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>
              Don't have an account?
            </Text>
            <Button
              title="Sign Up"
              onPress={navigateToSignup}
              variant="text"
              style={{
                paddingHorizontal: 0,
              }}
            />
          </View>

          {/* Demo Credentials */}
          <View
            style={{
              marginTop: spacing.xl,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              backgroundColor: colors.lightBackground,
              borderRadius: 8,
              marginHorizontal: spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.textTertiary,
                marginBottom: spacing.xs,
              }}
            >
              Demo Credentials:
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
              Phone: 9876543210
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
              (or 9123456789)
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
}
