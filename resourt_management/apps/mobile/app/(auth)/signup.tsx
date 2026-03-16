import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCustomerAuth } from '@contexts/CustomerAuthContext';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import TextField from '@components/ui/TextField';
import Button from '@components/ui/Button';
import { COLORS } from '@constants/colors';
import { SPACING } from '@constants/spacing';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useCustomerAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      await signup(formData.phone.trim(), formData.name.trim(), formData.email.trim() || undefined);
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(customer)/home');
    } catch (error) {
      Alert.alert('Signup Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.back();
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

          {/* Welcome Section */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: COLORS.text.primary,
                marginBottom: SPACING.sm,
              }}
            >
              Create Account
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.text.secondary,
                lineHeight: 20,
              }}
            >
              Sign up to start ordering delicious food from your favorite restaurants
            </Text>
          </View>

          {/* Form Section */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            {/* Name Field */}
            <View style={{ marginBottom: SPACING.md }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: COLORS.text.primary,
                  marginBottom: SPACING.sm,
                }}
              >
                Full Name
              </Text>
              <TextField
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                editable={!loading}
              />
            </View>

            {/* Phone Field */}
            <View style={{ marginBottom: SPACING.md }}>
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
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                editable={!loading}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.text.tertiary,
                  marginTop: SPACING.xs,
                }}
              >
                This will be used to identify your orders
              </Text>
            </View>

            {/* Email Field */}
            <View style={{ marginBottom: SPACING.lg }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: COLORS.text.primary,
                  marginBottom: SPACING.sm,
                }}
              >
                Email (Optional)
              </Text>
              <TextField
                placeholder="Enter your email"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                editable={!loading}
              />
            </View>
          </View>

          {/* Signup Button */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            <Button
              title={loading ? 'Creating Account...' : 'Sign Up'}
              onPress={handleSignup}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            />
          </View>

          {/* Login Link */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: SPACING.xs,
            }}
          >
            <Text style={{ fontSize: 14, color: COLORS.text.secondary }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: '600' }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
}