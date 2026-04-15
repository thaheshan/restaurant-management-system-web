import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Card from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import { INVENTORY_ITEMS } from '@services/mockData';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';
import { 
  Sprout, 
  Droplets, 
  Utensils, 
  Package, 
  Box,
  AlertTriangle,
  ClipboardList
} from 'lucide-react-native';

export default function InventoryScreen() {
  const router = useRouter();
  const [items] = useState(INVENTORY_ITEMS);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f7f9',
    },
    content: { 
      padding: SPACING.lg, 
      flex: 1 
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.lg,
    },
    summaryItem: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      width: '48%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)',
    },
    summaryLabel: {
      fontSize: 10,
      color: COLORS.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 4,
    },
    summaryValue: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
    },
    listTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: COLORS.text.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: SPACING.md,
      marginTop: SPACING.md,
    },
    itemCard: { 
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: COLORS.gray[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SPACING.md,
    },
    itemInfo: {
      flex: 1,
    },
    itemName: { 
      fontSize: FONT_SIZES.sm, 
      fontWeight: FONT_WEIGHTS.bold, 
      color: COLORS.text.primary 
    },
    itemCategory: { 
      fontSize: 11, 
      color: COLORS.text.secondary, 
      marginTop: 2 
    },
    stockContainer: {
      alignItems: 'flex-end',
    },
    stockText: { 
      fontSize: 14, 
      fontWeight: FONT_WEIGHTS.bold, 
      color: COLORS.text.primary 
    },
  });

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'produce': return Sprout;
      case 'dairy': return Droplets;
      case 'meat': return Utensils;
      case 'dry goods': return Package;
      default: return Box;
    }
  };

  const renderItem = ({ item }: { item: typeof INVENTORY_ITEMS[0] }) => {
    const IconComponent = getCategoryIcon(item.category);
    return (
      <Card style={styles.itemCard} shadow={false}>
        <View style={styles.iconWrapper}>
          <IconComponent size={18} color={COLORS.gray[500]} />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category.toUpperCase()}</Text>
        </View>
        <View style={styles.stockContainer}>
          <Text style={styles.stockText}>{item.stock} {item.unit}</Text>
          <Badge 
            label={item.status.toUpperCase()} 
            variant={item.status === 'expired' ? 'error' : item.status === 'warning' ? 'warning' : 'success'} 
            size="small"
            style={{ marginTop: 4 }}
          />
        </View>
      </Card>
    );
  };

  return (
    <>
      <Header title="Inventory Assets" onBackPress={() => router.back()} showBackButton />
      <SafeAreaContainer style={styles.container} scrollable>
        <View style={styles.content}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{items.length}</Text>
              <Text style={styles.summaryLabel}>Total Items</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: COLORS.status.warning }]}>
                {items.filter(i => i.status !== 'fresh').length}
              </Text>
              <Text style={styles.summaryLabel}>Alerts</Text>
            </View>
          </View>

          <Text style={styles.listTitle}>Inventory List</Text>
          <FlatList 
            data={items} 
            renderItem={renderItem} 
            keyExtractor={(item) => item.id} 
            scrollEnabled={false} 
          />
        </View>
      </SafeAreaContainer>
    </>
  );
}
