import React, { useState } from 'react';
import {
  View,
  FlatList,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@components/layout/Header';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import MenuItemCard from '@components/cards/MenuItemCard';
import Button from '@components/ui/Button';
import QuantitySelector from '@components/ui/QuantitySelector';
import Card from '@components/ui/Card';
import { MenuItem, CartItem } from '@/types';
import { MENU_ITEMS } from '@services/mockData';
import { useCart } from '@contexts/CartContext';
import { COLORS } from '@constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

export default function MenuItemsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addItem } = useCart();

  const category = params.category as string;
  const tableId = params.tableId as string;
  const items = MENU_ITEMS[category] || [];

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: COLORS.white,
      borderTopLeftRadius: BORDER_RADIUS.xl,
      borderTopRightRadius: BORDER_RADIUS.xl,
      padding: SPACING.lg,
      maxHeight: '80%',
    },
    modalHeader: {
      marginBottom: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      paddingBottom: SPACING.md,
    },
    modalTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text.primary,
    },
    ingredientsLabel: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
      marginTop: SPACING.lg,
      marginBottom: SPACING.sm,
    },
    ingredientItem: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.text.secondary,
      marginLeft: SPACING.md,
      marginBottom: SPACING.xs,
    },
    quantityLabel: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text.primary,
      marginTop: SPACING.lg,
      marginBottom: SPACING.md,
    },
    quantitySelector: {
      width: 100,
    },
    priceTag: {
      marginTop: SPACING.lg,
      paddingVertical: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    priceText: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
      marginBottom: SPACING.lg,
    },
    closeButton: {
      position: 'absolute',
      right: SPACING.lg,
      top: SPACING.lg,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: COLORS.gray[100],
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.text.primary,
    },
  });

  const handleItemPress = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setModalVisible(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const cartItem: CartItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity,
      image: selectedItem.image,
      category: selectedItem.category,
    };

    addItem(cartItem);
    Alert.alert('Success', `${selectedItem.name} (x${quantity}) added to cart!`);
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleViewCart = () => {
    router.push({
      pathname: '/(customer)/cart',
      params: { tableId },
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <>
      <Header
        title={category.charAt(0).toUpperCase() + category.slice(1)}
        onBackPress={handleBackPress}
        showBackButton
        rightIcon={
          <TouchableOpacity onPress={handleViewCart}>
            <Text style={{ fontSize: 20, color: COLORS.white }}>🛒</Text>
          </TouchableOpacity>
        }
      />
      <SafeAreaContainer scrollable>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <MenuItemCard
              item={item}
              onPress={handleItemPress}
              onAddPress={(item) => {
                setSelectedItem(item);
                setQuantity(1);
                setModalVisible(true);
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </SafeAreaContainer>

      {/* Item Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <SafeAreaContainer style={styles.modalContent} scrollable>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                </View>

                <Text style={{ color: COLORS.text.secondary, marginBottom: SPACING.md }}>
                  {selectedItem.description}
                </Text>

                {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                  <>
                    <Text style={styles.ingredientsLabel}>Ingredients:</Text>
                    {selectedItem.ingredients.map((ingredient, idx) => (
                      <Text key={idx} style={styles.ingredientItem}>
                        • {ingredient}
                      </Text>
                    ))}
                  </>
                )}

                <Text style={styles.quantityLabel}>Quantity:</Text>
                <QuantitySelector
                  quantity={quantity}
                  onIncrement={() => setQuantity((q) => Math.min(q + 1, 10))}
                  onDecrement={() => setQuantity((q) => Math.max(q - 1, 1))}
                  style={styles.quantitySelector}
                />

                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>
                    Rs. {selectedItem.price * quantity}
                  </Text>
                  <Button
                    title="Add to Cart"
                    onPress={handleAddToCart}
                    size="large"
                  />
                </View>
              </>
            )}
          </SafeAreaContainer>
        </View>
      </Modal>
    </>
  );
}