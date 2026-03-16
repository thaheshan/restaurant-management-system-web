import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import { INVENTORY_ITEMS } from '@services/mockData';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function ExpiryAlertsScreen() {
  const router = useRouter();
  const expiryItems = INVENTORY_ITEMS.filter(item => item.status !== 'fresh');

  const styles = StyleSheet.create({
    content: { padding: SPACING.lg, flex: 1 },
    alertCard: { marginBottom: SPACING.md, borderLeftWidth: 4, borderLeftColor: COLORS.warning },
    alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    itemName: { fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text.primary },
    expiryDate: { fontSize: FONT_SIZES.xs, color: COLORS.error, fontWeight: FONT_WEIGHTS.bold },
    detailsText: { fontSize: FONT_SIZES.sm, color: COLORS.text.secondary, marginBottom: SPACING.sm },
    actionButton: { marginTop: SPACING.md },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: FONT_SIZES.lg, color: COLORS.text.secondary },
  });

  const renderAlert = ({ item }: any) => (
    <Card style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.expiryDate}>EXPIRY: {item.expiryDate.toDateString()}</Text>
      </View>
      <Text style={styles.detailsText}>Category: {item.category}</Text>
      <Text style={styles.detailsText}>Stock: {item.stock} {item.unit}</Text>
      <Button title="Action Required" variant={item.status === 'expired' ? 'danger' : 'secondary'} size="small" onPress={() => {}} style={styles.actionButton} />
    </Card>
  );

  return (
    <>
      <Header title="Expiry Alerts" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer scrollable>
        {expiryItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>All items are fresh!</Text>
          </View>
        ) : (
          <View style={styles.content}>
            <FlatList data={expiryItems} renderItem={renderAlert} keyExtractor={(item) => item.id} scrollEnabled={false} />
          </View>
        )}
      </SafeAreaContainer>
    </>
  );
}
