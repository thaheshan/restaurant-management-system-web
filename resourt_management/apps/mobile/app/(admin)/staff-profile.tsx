import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import { useAdminAuth } from '@contexts/AdminAuthContext';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function StaffProfileScreen() {
  const router = useRouter();
  const { admin, logout } = useAdminAuth();

  const styles = StyleSheet.create({
    content: { padding: SPACING.lg, flex: 1, justifyContent: 'space-between' },
    profileHeader: { alignItems: 'center', marginBottom: SPACING.xl },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
    avatarText: { fontSize: 40, color: COLORS.white },
    name: { fontSize: FONT_SIZES.xxl, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text.primary, marginBottom: SPACING.sm },
    email: { fontSize: FONT_SIZES.base, color: COLORS.text.secondary },
    infoCard: { marginBottom: SPACING.lg },
    infoLabel: { fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text.secondary, textTransform: 'uppercase', marginBottom: SPACING.sm },
    infoValue: { fontSize: FONT_SIZES.base, color: COLORS.text.primary },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.lg },
    buttonContainer: { gap: SPACING.md },
    logoutButton: { backgroundColor: COLORS.error, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
    logoutButtonText: { color: COLORS.white, fontWeight: FONT_WEIGHTS.semibold, fontSize: FONT_SIZES.base },
  });

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const initials = admin?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'A';

  return (
    <>
      <Header title="Staff Profile" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer>
        <View style={styles.content}>
          {/* Profile Header */}
          <View>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <Text style={styles.name}>{admin?.name}</Text>
              <Text style={styles.email}>{admin?.email}</Text>
            </View>

            {/* Info Cards */}
            <Card style={styles.infoCard}>
              <Text style={styles.infoLabel}>Restaurant ID</Text>
              <Text style={styles.infoValue}>{admin?.restaurantId}</Text>
            </Card>

            <Card style={styles.infoCard}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>Administrator</Text>
            </Card>

            <Card style={styles.infoCard}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>Active</Text>
            </Card>
          </View>

          {/* Logout Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaContainer>
    </>
  );
}
