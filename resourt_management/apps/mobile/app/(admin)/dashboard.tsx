import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import { useAdminAuth } from '@contexts/AdminAuthContext';
import { CERTIFICATIONS, SANITIZATION_LOGS } from '@services/mockData';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';
import { 
  ClipboardList, 
  Package, 
  ShieldCheck, 
  BellRing, 
  User,
  Layers,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  Sparkles,
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import Badge from '@components/ui/Badge';
import { INVENTORY_ITEMS } from '@services/mockData';

const ADMIN_SECTIONS = [
  { id: 'orders', label: 'Orders', Icon: ClipboardList, color: COLORS.status.info, route: '/(admin)/orders-management' },
  { id: 'inventory', label: 'Inventory', Icon: Package, color: COLORS.status.success, route: '/(admin)/inventory' },
  { id: 'hygiene', label: 'Hygiene', Icon: ShieldCheck, color: COLORS.status.success, route: '/(admin)/hygiene-compliance' },
  { id: 'expiry', label: 'Alerts', Icon: BellRing, color: COLORS.status.error, route: '/(admin)/expiry-alerts' },
  { id: 'profile', label: 'Profile', Icon: User, color: COLORS.status.neutral, route: '/(admin)/staff-profile' },
];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { admin, logout } = useAdminAuth();

  // Mock stats - in a real app these would come from an API
  const stats = [
    { label: 'Total Items', value: INVENTORY_ITEMS.length, Icon: Layers, color: COLORS.status.success },
    { label: 'Critical', value: INVENTORY_ITEMS.filter(i => i.status === 'expired').length, Icon: AlertTriangle, color: COLORS.status.error },
    { label: 'Low Stock', value: 3, Icon: TrendingDown, color: COLORS.status.warning },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f7f9',
    },
    content: {
      padding: SPACING.lg,
      flex: 1,
    },
    welcomeHeader: {
      marginBottom: SPACING.xl,
    },
    welcomeText: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
    },
    adminName: {
      fontSize: FONT_SIZES.base,
      color: COLORS.text.secondary,
      marginTop: 4,
    },
    summaryGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.xl,
    },
    summaryCard: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      width: '31%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 3,
    },
    summaryIcon: {
      marginBottom: SPACING.xs,
    },
    summaryValue: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
    },
    summaryLabel: {
      fontSize: 10,
      color: COLORS.text.secondary,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    sectionLabel: {
      fontSize: FONT_SIZES.base,
      fontWeight: '800',
      color: COLORS.text.primary,
      marginBottom: SPACING.md,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: SPACING.lg,
    },
    gridItem: {
      width: '31%',
      marginBottom: SPACING.md,
    },
    sectionButton: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      alignItems: 'center',
      justifyContent: 'center',
      aspectRatio: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.02)',
    },
    sectionIcon: {
      marginBottom: SPACING.sm,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
      textAlign: 'center',
    },
    listCard: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
    },
    cardSubtitle: {
      fontSize: 12,
      color: COLORS.text.secondary,
      marginTop: 2,
    },
    logoutContainer: {
      padding: SPACING.lg,
      paddingBottom: SPACING.xl,
    },
    logoutButton: {
      flexDirection: 'row',
      backgroundColor: 'rgba(231, 76, 60, 0.1)',
      paddingVertical: SPACING.md,
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

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <>
      <Header title="Admin Dashboard" showBackButton={false} />
      <SafeAreaContainer style={styles.container} scrollable>
        <View style={styles.content}>
          {/* Welcome Header */}
          <View style={styles.welcomeHeader}>
            <Text style={styles.welcomeText}>Hello, {admin?.name || 'Admin'}</Text>
            <Text style={styles.adminName}>Operations and management overview</Text>
          </View>

          {/* Highlights Stats */}
          <View style={styles.summaryGrid}>
            {stats.map((stat, idx) => (
              <View key={idx} style={styles.summaryCard}>
                <stat.Icon size={18} color={stat.color} style={styles.summaryIcon} strokeWidth={2.5} />
                <Text style={styles.summaryValue}>{stat.value}</Text>
                <Text style={styles.summaryLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Quick Access Grid */}
          <Text style={styles.sectionLabel}>Management</Text>
          <View style={styles.gridContainer}>
            {ADMIN_SECTIONS.map((section) => (
              <View key={section.id} style={styles.gridItem}>
                <TouchableOpacity
                  style={styles.sectionButton}
                  onPress={() => handleNavigate(section.route)}
                  activeOpacity={0.7}
                >
                  <section.Icon size={24} color={section.color} style={styles.sectionIcon} strokeWidth={2} />
                  <Text style={styles.sectionTitle}>{section.label}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Certifications Section */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
            <Text style={[styles.sectionLabel, { marginBottom: 0 }]}>Certifications</Text>
            <TouchableOpacity onPress={() => handleNavigate('/(admin)/hygiene-compliance')}>
              <Text style={{ color: COLORS.status.info, fontSize: 12, fontWeight: '700' }}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          
          {CERTIFICATIONS.slice(0, 1).map((cert) => (
            <View key={cert.id} style={styles.listCard}>
              <View style={styles.cardRow}>
                <View style={[styles.cardContent, { flexDirection: 'row', alignItems: 'center' }]}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.status.success + '14', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md }}>
                    <CheckCircle2 size={18} color={COLORS.status.success} />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>{cert.name}</Text>
                    <Text style={styles.cardSubtitle}>Valid until {cert.expiryDate.toLocaleDateString()}</Text>
                  </View>
                </View>
                <Badge label="ACTIVE" variant="success" size="small" />
              </View>
            </View>
          ))}

          {/* Recent Sanitization Section */}
          <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>Recent Sanitization</Text>
          {SANITIZATION_LOGS.slice(0, 2).map((log) => (
            <View key={log.id} style={styles.listCard}>
              <View style={styles.cardRow}>
                <View style={[styles.cardContent, { flexDirection: 'row', alignItems: 'center' }]}>
                   <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.status.info + '14', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md }}>
                    <Sparkles size={18} color={COLORS.status.info} />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>{log.type}</Text>
                    <Text style={styles.cardSubtitle}>{log.employee} • {log.date.toLocaleDateString()}</Text>
                  </View>
                </View>
                <Badge label={log.status} variant={log.status === 'verified' ? 'success' : 'warning'} size="small" />
              </View>
            </View>
          ))}
        </View>

        {/* Improved Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color={COLORS.status.error} />
            <Text style={styles.logoutButtonText}>LOGOUT SYSTEM</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaContainer>
    </>
  );
}
