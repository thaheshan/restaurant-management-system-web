import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useCustomerAuth } from "@contexts/CustomerAuthContext";
import SafeAreaContainer from "@components/layout/SafeAreaContainer";
import TextField from "@components/ui/TextField";
import Button from "@components/ui/Button";
import { COLORS } from "@constants/colors";
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from "@constants/spacing";

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useCustomerAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(
        formData.email.trim(),
        formData.name.trim(),
        formData.phone.trim(),
        formData.password
      );
      router.replace("/(customer)/home");
    } catch (error) {
      Alert.alert("Signup Failed", error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{
            backgroundColor: COLORS.primary,
            paddingVertical: SPACING.xl,
            paddingHorizontal: SPACING.md,
            marginBottom: SPACING.xl,
          }}>
            <Text style={{
              fontSize: 32,
              fontWeight: "700",
              color: COLORS.white,
              textAlign: "center",
            }}>
              DineSmart
            </Text>
          </View>

          {/* Title */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            <Text style={{
              fontSize: 24,
              fontWeight: "700",
              color: COLORS.text.primary,
              marginBottom: SPACING.sm,
            }}>
              Create Account
            </Text>
            <Text style={{
              fontSize: FONT_SIZES.sm,
              color: COLORS.text.secondary,
              lineHeight: 20,
            }}>
              Sign up to start ordering delicious food
            </Text>
          </View>

          {/* Form */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            <View style={{ marginBottom: SPACING.md }}>
              <Text style={{
                fontSize: FONT_SIZES.sm,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.text.primary,
                marginBottom: SPACING.sm,
              }}>
                Full Name
              </Text>
              <TextField
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                editable={!loading}
              />
            </View>

            <View style={{ marginBottom: SPACING.md }}>
              <Text style={{
                fontSize: FONT_SIZES.sm,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.text.primary,
                marginBottom: SPACING.sm,
              }}>
                Email Address
              </Text>
              <TextField
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                editable={!loading}
              />
            </View>

            <View style={{ marginBottom: SPACING.md }}>
              <Text style={{
                fontSize: FONT_SIZES.sm,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.text.primary,
                marginBottom: SPACING.sm,
              }}>
                Phone Number
              </Text>
              <TextField
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                editable={!loading}
              />
            </View>

            <View style={{ marginBottom: SPACING.lg }}>
              <Text style={{
                fontSize: FONT_SIZES.sm,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.text.primary,
                marginBottom: SPACING.sm,
              }}>
                Password
              </Text>
              <TextField
                placeholder="Create a password"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                editable={!loading}
              />
            </View>
          </View>

          {/* Button */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            <Button
              title={loading ? "Creating Account..." : "Sign Up"}
              onPress={handleSignup}
              disabled={loading}
            />
          </View>

          {/* Login Link */}
          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: SPACING.xs,
          }}>
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.text.secondary }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.primary,
                fontWeight: FONT_WEIGHTS.semibold,
              }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
}

