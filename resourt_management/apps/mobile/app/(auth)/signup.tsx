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
  const { signup, verifyOtp, otpSent } = useCustomerAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    setLoading(true);
    try {
      await signup(
        formData.phone.trim(),
        formData.name.trim(),
        formData.email.trim() || undefined
      );
      Alert.alert("OTP Sent", "Check your backend console for the OTP code");
    } catch (error) {
      Alert.alert("Signup Failed", error instanceof Error ? error.message : "Unknown error");
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
      await verifyOtp(formData.phone.trim(), otp.trim());
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
              {otpSent ? "Verify OTP" : "Create Account"}
            </Text>
            <Text style={{
              fontSize: FONT_SIZES.sm,
              color: COLORS.text.secondary,
              lineHeight: 20,
            }}>
              {otpSent
                ? "Enter the OTP from your backend console"
                : "Sign up to start ordering delicious food"}
            </Text>
          </View>

          {/* Form - hidden after OTP sent */}
          {!otpSent && (
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
          )}

          {/* OTP Input */}
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
                autoFocus
              />
              <Text style={{
                fontSize: FONT_SIZES.xs,
                color: COLORS.text.secondary,
                marginTop: SPACING.xs,
              }}>
                Check your backend terminal for the OTP
              </Text>
            </View>
          )}

          {/* Button */}
          <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
            {!otpSent ? (
              <Button
                title={loading ? "Creating Account..." : "Sign Up"}
                onPress={handleSignup}
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
                  onPress={() => handleSignup()}
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
