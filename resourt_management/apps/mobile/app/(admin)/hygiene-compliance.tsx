import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Card from '@components/ui/Card';
import { CERTIFICATIONS, SANITIZATION_LOGS } from '@services/mockData';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function HygieneComplianceScreen() {
  const router = useRouter();

  const styles = StyleSheet.create({
    content: { padding: SPACING.lg, flex: 1 },
    sectionLabel: { fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text.primary, marginBottom: SPACING.md, marginTop: SPACING.lg },
    certCard: { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderLeftWidth: 4, borderLeftColor: COLORS.success, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.md },
    certTitle: { fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text.primary },
    certDetails: { fontSize: FONT_SIZES.xs, color: COLORS.text.secondary, marginTop: SPACING.xs },
    logCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    logIcon: { fontSize: 24, marginRight: SPACING.md, width: 40 },
    logContent: { flex: 1 },
    logType: { fontSize: FONT_SIZES.sm, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text.primary },
    logDetails: { fontSize: FONT_SIZES.xs, color: COLORS.text.secondary, marginTop: SPACING.xs },
    statusBadge: { backgroundColor: COLORS.success, color: COLORS.white, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.md, fontSize: FONT_SIZES.xs, fontWeight: FONT_WEIGHTS.bold },
  });

  const renderCert = ({ item }: any) => (
    <View style={styles.certCard}>
      <Text style={styles.certTitle}>{item.name}</Text>
      <Text style={styles.certDetails}>{item.level}</Text>
      <Text style={styles.certDetails}>Valid until: {item.expiryDate.toDateString()}</Text>
    </View>
  );

  const renderLog = ({ item }: any) => (
    <View style={styles.logCard}>
      <Text style={styles.logIcon}>✓</Text>
      <View style={styles.logContent}>
        <Text style={styles.logType}>{item.type}</Text>
        <Text style={styles.logDetails}>{item.employee} • {item.date.toDateString()} at {item.time}</Text>
      </View>
      <Text style={styles.statusBadge}>{item.status.toUpperCase()}</Text>
    </View>
  );

  return (
    <>
      <Header title="Hygiene & Compliance" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer scrollable>
        <View style={styles.content}>
          <Text style={styles.sectionLabel}>Certifications</Text>
          <FlatList data={CERTIFICATIONS} renderItem={renderCert} keyExtractor={(item) => item.id} scrollEnabled={false} />

          <Text style={styles.sectionLabel}>Sanitization Log</Text>
          <FlatList data={SANITIZATION_LOGS} renderItem={renderLog} keyExtractor={(item) => item.id} scrollEnabled={false} />
        </View>
      </SafeAreaContainer>
    </>
  );
}
