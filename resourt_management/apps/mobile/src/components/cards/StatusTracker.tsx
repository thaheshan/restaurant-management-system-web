import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { OrderStatus } from '@types/index';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '@constants/spacing';

interface StatusTrackerProps {
  currentStatus: OrderStatus;
  style?: ViewStyle;
}

const STATUS_STEPS: OrderStatus[] = ['placed', 'prep', 'in-progress', 'served'];
const STATUS_LABELS = {
  placed: 'Order Placed',
  prep: 'Start Prep',
  'in-progress': 'In Progress',
  served: 'Served',
};

const StatusTracker: React.FC<StatusTrackerProps> = ({ currentStatus, style }) => {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  const styles = StyleSheet.create({
    container: {
      paddingVertical: SPACING.lg,
    },
    stepsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.xl,
    },
    stepWrapper: {
      alignItems: 'center',
      flex: 1,
    },
    circle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.md,
      backgroundColor: COLORS.gray[200],
      borderWidth: 2,
      borderColor: COLORS.gray[200],
    },
    circleActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    circleCompleted: {
      backgroundColor: COLORS.success,
      borderColor: COLORS.success,
    },
    circleText: {
      fontWeight: FONT_WEIGHTS.bold,
      fontSize: FONT_SIZES.base,
      color: COLORS.text.primary,
    },
    circleActiveText: {
      color: COLORS.white,
    },
    label: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      color: COLORS.text.secondary,
      textAlign: 'center',
    },
    labelActive: {
      color: COLORS.primary,
      fontWeight: FONT_WEIGHTS.bold,
    },
    connector: {
      position: 'absolute',
      height: 2,
      backgroundColor: COLORS.gray[200],
      top: 25,
      zIndex: -1,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.stepsContainer}>
        {STATUS_STEPS.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <View key={status} style={styles.stepWrapper}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isActive && styles.circleActive,
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    (isActive || isCompleted) && styles.circleActiveText,
                  ]}
                >
                  {isCompleted ? '✓' : index + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.label,
                  (isActive || isCompleted) && styles.labelActive,
                ]}
              >
                {STATUS_LABELS[status]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default StatusTracker;
