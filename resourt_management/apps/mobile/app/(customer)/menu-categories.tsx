import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import { MENU_CATEGORIES } from '@services/mockData';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.md) / 2;

export default function MenuCategoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tableId = params.tableId as string;

  const styles = StyleSheet.create({
    categoryCard: {
      width: ITEM_WIDTH,
      margin: SPACING.md / 2,
      borderRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.border,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageContainer: {
      width: '100%',
      height: ITEM_WIDTH,
      backgroundColor: COLORS.gray[100],
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    nameContainer: {
      padding: SPACING.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryName: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
      textAlign: 'center',
    },
    tableIdText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      marginBottom: SPACING.md,
      textAlign: 'center',
    },
  });

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/(customer)/menu-items/[category]',
      params: { category: categoryId, tableId },
    });
  };

  const renderCategoryCard = ({ item }: { item: (typeof MENU_CATEGORIES)[0] }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header title="DineSmart" subtitle={`Table ${tableId}`} />
      <SafeAreaContainer scrollable style={{ backgroundColor: COLORS.surface }}>
        <Text style={styles.tableIdText}>
          Scan completed! Select a category to browse menu
        </Text>
        <FlatList
          data={MENU_CATEGORIES}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
        />
      </SafeAreaContainer>
    </>
  );
}
