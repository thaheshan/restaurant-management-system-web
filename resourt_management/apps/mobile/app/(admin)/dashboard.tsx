import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Card from '@components/ui/Card';
import { useAdminAuth } from '@contexts/AdminAuthContext';
import { CERTIFICATIONS, SANITIZATION_LOGS } from '@services/mockData';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

const ADMIN_SECTIONS = [
  { id: 'orders', label: 'Orders Management', icon: '📋', route: '/(admin)/orders-management' },
  { id: 'inventory', label: 'Inventory', icon: '📦', route: '/(admin)/inventory' },
  { id: 'hygiene', label: 'Hygiene & Compliance', icon: '✓', route: '/(admin)/hygiene-compliance' },
  { id: 'expiry', label: 'Expiry Alerts', icon: '⏰', route: '/(admin)/expiry-alerts' },
  { id: 'profile', label: 'Staff Profile', icon: '👤', route: '/(admin)/staff-profile' },
];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { admin, logout } = useAdminAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: SPACING.lg,
      flex: 1,
    },
    welcomeCard: {
      backgroundColor: COLORS.primary,
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.xl,
      color: COLORS.white,
    },
    welcomeText: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.white,
      marginBottom: SPACING.sm,
    },
    adminName: {
      fontSize: FONT_SIZES.base,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    sectionLabel: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
      marginBottom: SPACING.md,
      marginTop: SPACING.lg,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: SPACING.xl,
    },
    gridItem: {
      width: '48%',
      marginBottom: SPACING.md,
    },
    sectionButton: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: SPACING.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 140,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionIcon: {
      fontSize: 40,
      marginBottom: SPACING.md,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
      textAlign: 'center',
    },
    certificationCard: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      borderLeftWidth: 4,
      borderLeftColor: COLORS.success,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      marginBottom: SPACING.md,
    },
    certTitle: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
    },
    certDetails: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.text.secondary,
      marginTop: SPACING.xs,
    },
    sanitationLog: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    logIcon: {
      fontSize: 20,
      marginRight: SPACING.md,
      width: 30,
    },
    logContent: {
      flex: 1,
    },
    logType: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
    },
    logDetails: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.text.secondary,
      marginTop: SPACING.xs,
    },
    statusBadge: {
      backgroundColor: COLORS.success,
      color: COLORS.white,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.md,
      fontSize: FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.bold,
      overflow: 'hidden',
    },
    buttonContainer: {
      padding: SPACING.lg,
      paddingBottom: SPACING.xl,
    },
    logoutButton: {
      backgroundColor: COLORS.error,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: COLORS.white,
      fontWeight: FONT_WEIGHTS.semibold,
      fontSize: FONT_SIZES.base,
    },
  });

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <>
      <Header title="DineSmart Admin" />
      <SafeAreaContainer style={styles.container} scrollable>
        <View style={styles.content}>
          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.adminName}>{admin?.name}</Text>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionLabel}>Management</Text>
          <View style={styles.gridContainer}>
            {ADMIN_SECTIONS.map((section) => (
              <View key={section.id} style={styles.gridItem}>
                <TouchableOpacity
                  style={styles.sectionButton}
                  onPress={() => handleNavigate(section.route)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sectionIcon}>{section.icon}</Text>
                  <Text style={styles.sectionTitle}>{section.label}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Certifications */}
          <Text style={styles.sectionLabel}>Certifications</Text>
          {CERTIFICATIONS.map((cert) => (
            <View key={cert.id} style={styles.certificationCard}>
              <Text style={styles.certTitle}>{cert.name}</Text>
              <Text style={styles.certDetails}>{cert.level}</Text>
              <Text style={styles.certDetails}>Valid until: {cert.expiryDate.toDateString()}</Text>
            </View>
          ))}

          {/* Recent Sanitization */}
          <Text style={styles.sectionLabel}>Recent Sanitization</Text>
          {SANITIZATION_LOGS.slice(0, 3).map((log) => (
            <View key={log.id} style={styles.sanitationLog}>
              <Text style={styles.logIcon}>🧼</Text>
              <View style={styles.logContent}>
                <Text style={styles.logType}>{log.type}</Text>
                <Text style={styles.logDetails}>
                  {log.employee} • {log.date.toDateString()} at {log.time}
                </Text>
              </View>
              <Text style={styles.statusBadge}>{log.status.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaContainer>
    </>
  );
}
