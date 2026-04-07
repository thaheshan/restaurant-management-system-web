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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(customer)/home");
    } catch (error) {
      Alert.alert("Login Failed", error instanceof Error ? error.message : "Invalid credentials");
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
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

          {/* Welcome Text */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            <Text style={{
              fontSize: 24,
              fontWeight: "700",
              color: COLORS.text.primary,
              marginBottom: SPACING.sm,
            }}>
              Welcome Back!
            </Text>
            <Text style={{
              fontSize: FONT_SIZES.sm,
              color: COLORS.text.secondary,
              lineHeight: 20,
            }}>
              Log in to your account with email and password
            </Text>
          </View>

          {/* Email Input */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.md }}>
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
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            <Text style={{
              fontSize: FONT_SIZES.sm,
              fontWeight: FONT_WEIGHTS.semibold,
              color: COLORS.text.primary,
              marginBottom: SPACING.sm,
            }}>
              Password
            </Text>
            <TextField
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          {/* Button */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            <Button
              title={loading ? "Logging in..." : "Login"}
              onPress={handleLogin}
              disabled={loading}
            />
          </View>

          {/* Sign Up Link */}
          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.text.secondary }}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.primary,
                fontWeight: FONT_WEIGHTS.semibold,
              }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
}

