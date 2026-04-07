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
import { 
  Database, 
  CalendarX, 
  BadgeCheck, 
  AlertTriangle,
  Trash2
} from 'lucide-react-native';
import Badge from '@components/ui/Badge';

export default function ExpiryAlertsScreen() {
  const router = useRouter();
  const expiryItems = INVENTORY_ITEMS.filter(item => item.status !== 'fresh');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f7f9',
    },
    content: { 
      padding: SPACING.lg, 
      flex: 1 
    },
    alertCard: { 
      marginBottom: SPACING.md, 
      padding: SPACING.lg,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
    },
    itemTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
    },
    categoryText: {
      fontSize: 12,
      color: COLORS.text.secondary,
      marginTop: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    detailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.sm,
      backgroundColor: COLORS.gray[50],
      padding: SPACING.sm,
      borderRadius: BORDER_RADIUS.md,
    },
    detailsText: { 
      fontSize: FONT_SIZES.sm, 
      color: COLORS.text.primary, 
      marginLeft: SPACING.sm,
      fontWeight: FONT_WEIGHTS.medium,
    },
    dateRow: {
       flexDirection: 'row',
       alignItems: 'center',
       marginTop: SPACING.xs,
    },
    dateText: {
      fontSize: 12,
      color: COLORS.status.error,
      fontWeight: FONT_WEIGHTS.bold,
      marginLeft: 6,
    },
    actionButton: { 
      marginTop: SPACING.md,
    },
    emptyState: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      marginTop: 100,
    },
    emptyText: { 
      fontSize: FONT_SIZES.lg, 
      color: COLORS.text.secondary,
      marginTop: SPACING.md,
      fontWeight: FONT_WEIGHTS.medium,
    },
  });

  const renderAlert = ({ item }: { item: typeof INVENTORY_ITEMS[0] }) => (
    <Card style={styles.alertCard} shadow>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Badge 
          label={item.status.toUpperCase()} 
          variant={item.status === 'expired' ? 'error' : 'warning'} 
        />
      </View>

      <View style={styles.detailsRow}>
        <Database size={16} color={COLORS.text.secondary} />
        <Text style={styles.detailsText}>Current Stock: {item.stock} {item.unit}</Text>
      </View>

      <View style={styles.dateRow}>
        <CalendarX size={16} color={COLORS.status.error} />
        <Text style={styles.dateText}>
          {item.status === 'expired' ? 'EXPIRED ON' : 'EXPIRES ON'}: {item.expiryDate.toLocaleDateString()}
        </Text>
      </View>

      <Button 
        title="PROCESS DISPOSAL" 
        variant={item.status === 'expired' ? 'danger' : 'secondary'} 
        size="small" 
        icon={<Trash2 size={16} color={item.status === 'expired' ? COLORS.white : COLORS.error} />}
        onPress={() => {}} 
        style={styles.actionButton} 
      />
    </Card>
  );

  return (
    <>
      <Header title="Expiry Management" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer style={styles.container} scrollable>
        {expiryItems.length === 0 ? (
          <View style={styles.emptyState}>
            <BadgeCheck size={80} color={COLORS.status.success} strokeWidth={1} />
            <Text style={styles.emptyText}>Inventory is healthy!</Text>
            <Text style={{ color: COLORS.text.secondary, fontSize: 14 }}>No expiring items found.</Text>
          </View>
        ) : (
          <View style={styles.content}>
            <FlatList 
              data={expiryItems} 
              renderItem={renderAlert} 
              keyExtractor={(item) => item.id} 
              scrollEnabled={false} 
            />
          </View>
        )}
      </SafeAreaContainer>
    </>
  );
}
