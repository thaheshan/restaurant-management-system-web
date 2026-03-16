import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Card from '@components/ui/Card';
import { INVENTORY_ITEMS } from '@services/mockData';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function InventoryScreen() {
  const router = useRouter();
  const [items] = useState(INVENTORY_ITEMS);

  const styles = StyleSheet.create({
    content: { padding: SPACING.lg, flex: 1 },
    itemCard: { marginBottom: SPACING.md },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
    itemName: { fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text.primary },
    itemCategory: { fontSize: FONT_SIZES.xs, color: COLORS.text.secondary, marginBottom: SPACING.xs },
    stockInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
    stockText: { fontSize: FONT_SIZES.sm, color: COLORS.text.secondary },
    stockValue: { fontSize: FONT_SIZES.base, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary },
    statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
    freshBadge: { backgroundColor: COLORS.success },
    warningBadge: { backgroundColor: COLORS.warning },
    expiredBadge: { backgroundColor: COLORS.error },
    badgeText: { color: COLORS.white, fontSize: FONT_SIZES.xs, fontWeight: FONT_WEIGHTS.bold },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh': return styles.freshBadge;
      case 'warning': return styles.warningBadge;
      case 'expired': return styles.expiredBadge;
      default: return styles.freshBadge;
    }
  };

  const renderItem = ({ item }: any) => (
    <Card style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category.toUpperCase()}</Text>
        </View>
        <View style={[styles.statusBadge, getStatusColor(item.status)]}>
          <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.stockInfo}>
        <Text style={styles.stockText}>Stock:</Text>
        <Text style={styles.stockValue}>{item.stock} {item.unit}</Text>
      </View>
    </Card>
  );

  return (
    <>
      <Header title="Inventory Management" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer scrollable>
        <View style={styles.content}>
          <FlatList data={items} renderItem={renderItem} keyExtractor={(item) => item.id} scrollEnabled={false} />
        </View>
      </SafeAreaContainer>
    </>
  );
}
