import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import TextField from '@components/ui/TextField';
import Button from '@components/ui/Button';
import { useAdminAuth } from '@contexts/AdminAuthContext';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState('admin@dinesmart.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      justifyContent: 'center',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
    },
    content: {
      backgroundColor: COLORS.white,
      margin: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.xl,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    header: {
      alignItems: 'center',
      marginBottom: SPACING.xl,
    },
    logo: {
      fontSize: 48,
      marginBottom: SPACING.md,
    },
    title: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
      marginBottom: SPACING.sm,
    },
    subtitle: {
      fontSize: FONT_SIZES.base,
      color: COLORS.text.secondary,
      textAlign: 'center',
    },
    formContainer: {
      marginBottom: SPACING.xl,
    },
    credentialsInfo: {
      backgroundColor: COLORS.surface,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      marginBottom: SPACING.lg,
    },
    credentialsLabel: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.text.secondary,
      marginBottom: SPACING.xs,
      textTransform: 'uppercase',
      fontWeight: FONT_WEIGHTS.bold,
    },
    credentialsText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.primary,
      fontFamily: 'monospace',
      marginBottom: SPACING.xs,
    },
    buttonContainer: {
      marginTop: SPACING.lg,
    },
    backButton: {
      marginTop: SPACING.md,
    },
    backButtonText: {
      textAlign: 'center',
      color: COLORS.primary,
      fontWeight: FONT_WEIGHTS.semibold,
      fontSize: FONT_SIZES.base,
    },
  });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(admin)/dashboard');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMenu = () => {
    router.replace('/');
  };

  return (
    <SafeAreaContainer style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop',
        }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>🍳</Text>
              <Text style={styles.title}>Admin Login</Text>
              <Text style={styles.subtitle}>Restaurant Management</Text>
            </View>

            {/* Demo Credentials Info */}
            <View style={styles.credentialsInfo}>
              <Text style={styles.credentialsLabel}>Demo Credentials</Text>
              <Text style={styles.credentialsText}>Email: admin@dinesmart.com</Text>
              <Text style={styles.credentialsText}>Password: admin123</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <TextField
                label="Email"
                placeholder="admin@dinesmart.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: '' });
                }}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextField
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: '' });
                }}
                error={errors.password}
                secureTextEntry
              />
            </View>

            {/* Login Button */}
            <View style={styles.buttonContainer}>
              <Button
                title="Login"
                size="large"
                onPress={handleLogin}
                loading={loading}
              />
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToMenu}
              >
                <Text style={styles.backButtonText}>Back to QR Scanner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaContainer>
  );
}