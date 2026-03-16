import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';

interface SafeAreaContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  scrollProps?: ScrollViewProps;
}

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
  children,
  style,
  scrollable = false,
  scrollProps,
}) => {
  if (scrollable) {
    return (
      <SafeAreaView style={[styles.container, style]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          {...scrollProps}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default SafeAreaContainer;