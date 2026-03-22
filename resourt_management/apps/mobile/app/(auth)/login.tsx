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
  const { login, verifyOtp, otpSent } = useCustomerAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone.trim() || phone.trim().length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      await login(phone.trim());
      Alert.alert("OTP Sent", "Check your backend console for the OTP code");
    } catch (error) {
      Alert.alert("Failed", error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(phone.trim(), otp.trim());
      router.replace("/(customer)/home");
    } catch (error) {
      Alert.alert("Invalid OTP", error instanceof Error ? error.message : "OTP verification failed");
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
              {otpSent
                ? "Enter the OTP sent to your phone"
                : "Enter your phone number to receive an OTP"}
            </Text>
          </View>

          {/* Phone Input */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
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
              value={phone}
              onChangeText={setPhone}
              editable={!loading && !otpSent}
            />
          </View>

          {/* OTP Input - shown after OTP sent */}
          {otpSent && (
            <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
              <Text style={{
                fontSize: FONT_SIZES.sm,
                fontWeight: FONT_WEIGHTS.semibold,
                color: COLORS.text.primary,
                marginBottom: SPACING.sm,
              }}>
                OTP Code
              </Text>
              <TextField
                placeholder="Enter OTP from backend console"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                editable={!loading}
              />
              <Text style={{
                fontSize: FONT_SIZES.xs,
                color: COLORS.text.secondary,
                marginTop: SPACING.xs,
              }}>
                Check your backend terminal for the OTP code
              </Text>
            </View>
          )}

          {/* Button */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            {!otpSent ? (
              <Button
                title={loading ? "Sending OTP..." : "Send OTP"}
                onPress={handleSendOtp}
                disabled={loading}
              />
            ) : (
              <>
                <Button
                  title={loading ? "Verifying..." : "Verify OTP"}
                  onPress={handleVerifyOtp}
                  disabled={loading}
                />
                <TouchableOpacity
                  onPress={() => {
                    setOtp("");
                    handleSendOtp();
                  }}
                  style={{ marginTop: SPACING.md, alignItems: "center" }}
                >
                  <Text style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.primary,
                    fontWeight: FONT_WEIGHTS.semibold,
                  }}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </>
            )}
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
