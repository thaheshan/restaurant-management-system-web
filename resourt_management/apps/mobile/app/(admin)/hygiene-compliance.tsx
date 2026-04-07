import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import { CERTIFICATIONS, SANITIZATION_LOGS } from '@services/mockData';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';
import { 
  Award, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react-native';

export default function HygieneComplianceScreen() {
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f7f9',
    },
    content: { padding: SPACING.lg, flex: 1 },
    sectionLabel: { 
      fontSize: FONT_SIZES.base, 
      fontWeight: '800', 
      color: COLORS.text.primary, 
      marginBottom: SPACING.md, 
      marginTop: SPACING.lg,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    certCard: { 
      marginBottom: SPACING.md, 
      padding: SPACING.lg,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: COLORS.status.success + '14',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SPACING.md,
    },
    certTitle: { 
      fontSize: FONT_SIZES.sm, 
      fontWeight: FONT_WEIGHTS.bold, 
      color: COLORS.text.primary 
    },
    certDetails: { 
      fontSize: 12, 
      color: COLORS.text.secondary, 
      marginTop: 2 
    },
    logCard: { 
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      flexDirection: 'row', 
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    logIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.status.info + '14',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SPACING.md,
    },
    logContent: { flex: 1 },
    logType: { 
      fontSize: FONT_SIZES.sm, 
      fontWeight: FONT_WEIGHTS.bold, 
      color: COLORS.text.primary 
    },
    logDetails: { 
      fontSize: 12, 
      color: COLORS.text.secondary, 
      marginTop: 2 
    },
  });

  const renderCert = ({ item }: { item: typeof CERTIFICATIONS[0] }) => (
    <Card style={styles.certCard} shadow>
      <View style={styles.cardRow}>
        <View style={styles.iconWrapper}>
          <Award size={20} color={COLORS.status.success} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.certTitle}>{item.name}</Text>
          <Text style={styles.certDetails}>{item.level}</Text>
          <Text style={styles.certDetails}>Valid until: {item.expiryDate.toLocaleDateString()}</Text>
        </View>
        <Badge label="VERIFIED" variant="success" size="small" />
      </View>
    </Card>
  );

  const renderLog = ({ item }: { item: typeof SANITIZATION_LOGS[0] }) => (
    <View style={styles.logCard}>
      <View style={styles.logIconWrapper}>
        <Sparkles size={18} color={COLORS.status.info} />
      </View>
      <View style={styles.logContent}>
        <Text style={styles.logType}>{item.type}</Text>
        <Text style={styles.logDetails}>{item.employee} • {item.date.toLocaleDateString()}</Text>
      </View>
      <Badge 
        label={item.status.toUpperCase()} 
        variant={item.status === 'verified' ? 'success' : 'warning'} 
        size="small" 
      />
    </View>
  );

  return (
    <>
      <Header title="Hygiene & Compliance" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer style={styles.container} scrollable>
        <View style={styles.content}>
          <Text style={styles.sectionLabel}>Active Certifications</Text>
          <FlatList 
            data={CERTIFICATIONS} 
            renderItem={renderCert} 
            keyExtractor={(item) => item.id} 
            scrollEnabled={false} 
          />

          <Text style={[styles.sectionLabel, { marginTop: SPACING.xl }]}>Recent Sanitization Logs</Text>
          <FlatList 
            data={SANITIZATION_LOGS} 
            renderItem={renderLog} 
            keyExtractor={(item) => item.id} 
            scrollEnabled={false} 
          />
        </View>
      </SafeAreaContainer>
    </>
  );
}
