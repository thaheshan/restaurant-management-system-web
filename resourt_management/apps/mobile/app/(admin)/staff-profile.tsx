import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import { useAdminAuth } from '@contexts/AdminAuthContext';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';
import { 
  Mail, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  LogOut 
} from 'lucide-react-native';

export default function StaffProfileScreen() {
  const router = useRouter();
  const { admin, logout } = useAdminAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f7f9',
    },
    content: { 
      padding: SPACING.lg, 
      flex: 1, 
    },
    profileHeader: { 
      alignItems: 'center', 
      marginBottom: SPACING.xl,
      paddingVertical: SPACING.xl,
    },
    avatarWrapper: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 4,
      borderColor: COLORS.status.info + '20',
    },
    avatarText: { 
      fontSize: 36, 
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.status.info 
    },
    name: { 
      fontSize: FONT_SIZES.xl, 
      fontWeight: FONT_WEIGHTS.bold, 
      color: COLORS.text.primary, 
      marginBottom: 4 
    },
    email: { 
      fontSize: FONT_SIZES.sm, 
      color: COLORS.text.secondary 
    },
    infoSection: {
      marginTop: SPACING.md,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: COLORS.gray[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SPACING.lg,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: { 
      fontSize: 10, 
      fontWeight: '800', 
      color: COLORS.text.secondary, 
      textTransform: 'uppercase', 
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    infoValue: { 
      fontSize: FONT_SIZES.base, 
      fontWeight: FONT_WEIGHTS.medium,
      color: COLORS.text.primary 
    },
    logoutContainer: {
        marginTop: SPACING.xxl,
    },
    logoutButton: { 
        flexDirection: 'row',
        backgroundColor: 'rgba(231, 76, 60, 0.1)', 
        paddingVertical: SPACING.lg, 
        borderRadius: BORDER_RADIUS.md, 
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(231, 76, 60, 0.2)',
    },
    logoutButtonText: { 
        color: COLORS.status.error, 
        fontWeight: FONT_WEIGHTS.bold, 
        fontSize: FONT_SIZES.base,
        marginLeft: SPACING.sm,
    },
  });

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const initials = admin?.name
    ? admin.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <>
      <Header title="My Profile" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer style={styles.container} scrollable>
        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.name}>{admin?.name || 'Administrator'}</Text>
            <Badge label="VERIFIED ACCESS" variant="info" size="small" />
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Mail size={18} color={COLORS.gray[400]} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{admin?.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Building2 size={18} color={COLORS.gray[400]} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Restaurant ID</Text>
                <Text style={styles.infoValue}>{admin?.restaurantId}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <ShieldCheck size={18} color={COLORS.gray[400]} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Access Role</Text>
                <Text style={styles.infoValue}>System Administrator</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <CheckCircle2 size={18} color={COLORS.status.success} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Account Status</Text>
                <Text style={[styles.infoValue, { color: COLORS.status.success }]}>Active & Verified</Text>
              </View>
            </View>
          </View>

          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={18} color={COLORS.status.error} />
              <Text style={styles.logoutButtonText}>LOGOUT SYSTEM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaContainer>
    </>
  );
}
