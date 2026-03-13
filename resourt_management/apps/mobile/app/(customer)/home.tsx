import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCustomerAuth } from '@contexts/CustomerAuthContext';
import { SafeAreaContainer } from '@components/layout/SafeAreaContainer';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { colors } from '@constants/colors';
import { spacing } from '@constants/spacing';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useCustomerAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleBarCodeScanned = async (result: { data: string }) => {
    setIsScanning(true);
    try {
      const scannedData = result.data;

      // Parse QR code data format: dinesmart://restaurant/{restaurantId}/table/{tableId}
      // Fallback format: dinesmart://table/{tableId}
      let restaurantId = 'rest-1'; // default
      let tableId = '';

      const fullRegex = /dinesmart:\/\/restaurant\/([^/]+)\/table\/([^/]+)/;
      const simpleRegex = /dinesmart:\/\/table\/(\d+)/;

      let match = scannedData.match(fullRegex);
      if (match) {
        restaurantId = match[1];
        tableId = match[2];
      } else {
        match = scannedData.match(simpleRegex);
        if (match) {
          tableId = match[1];
        }
      }

      if (tableId) {
        setIsScannerOpen(false);
        // Navigate to menu categories with restaurant and table params
        router.push({
          pathname: '/(customer)/menu-categories',
          params: {
            restaurantId,
            tableId,
          },
        });
      } else {
        Alert.alert('Invalid QR Code', 'Please scan a valid DineSmart QR code');
        setIsScanning(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process QR code');
      setIsScanning(false);
    }
  };

  const handleRequestPermission = async () => {
    const { granted } = await requestPermission();
    if (granted) {
      setIsScannerOpen(true);
    } else {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera permissions in your settings to scan QR codes'
      );
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (isScannerOpen && permission?.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <CameraView
          onBarcodeScanned={isScanning ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          style={{ flex: 1 }}
        />

        {/* Scanner Overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Scanner Frame */}
          <View
            style={{
              width: 250,
              height: 250,
              borderWidth: 3,
              borderColor: colors.primary,
              borderRadius: 12,
            }}
          />

          {/* Instructions */}
          <Text
            style={{
              marginTop: spacing.lg,
              fontSize: 14,
              color: colors.white,
              textAlign: 'center',
              paddingHorizontal: spacing.lg,
            }}
          >
            Position the QR code within the frame to scan
          </Text>
        </View>

        {/* Close Button */}
        <View
          style={{
            position: 'absolute',
            bottom: spacing.lg,
            left: spacing.lg,
            right: spacing.lg,
          }}
        >
          <Button
            title="Close Scanner"
            onPress={() => setIsScannerOpen(false)}
            variant="secondary"
          />
        </View>

        {isScanning && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={{
                marginTop: spacing.md,
                fontSize: 14,
                color: colors.white,
              }}
            >
              Processing QR Code...
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={{
            backgroundColor: colors.primary,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.md,
            marginBottom: spacing.lg,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.white,
                marginBottom: spacing.xs,
              }}
            >
              DineSmart
            </Text>
            <Text style={{ fontSize: 12, color: colors.lightBackground }}>
              Welcome, {user?.name}
            </Text>
          </View>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            }}
          />
        </View>

        {/* Welcome Card */}
        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.textPrimary,
                marginBottom: spacing.sm,
              }}
            >
              Welcome Back!
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                lineHeight: 20,
              }}
            >
              Scan a table's QR code to view the menu and place an order
            </Text>
          </View>
        </Card>

        {/* QR Scanner Section */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <View
            style={{
              backgroundColor: colors.lightBackground,
              borderRadius: 12,
              padding: spacing.lg,
              borderWidth: 2,
              borderColor: colors.primary,
              borderStyle: 'dashed',
              alignItems: 'center',
              marginBottom: spacing.lg,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.md,
              }}
            >
              <Text style={{ fontSize: 40 }}>📱</Text>
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.textPrimary,
                marginBottom: spacing.sm,
                textAlign: 'center',
              }}
            >
              Scan Table QR Code
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                textAlign: 'center',
                marginBottom: spacing.lg,
                lineHeight: 18,
              }}
            >
              Use your device camera to scan the QR code displayed on your table
            </Text>

            <Button
              title={
                permission?.granted
                  ? 'Open Scanner'
                  : permission?.status === 'undetermined'
                    ? 'Enable Camera'
                    : 'Open Settings'
              }
              onPress={
                permission?.granted
                  ? () => setIsScannerOpen(true)
                  : handleRequestPermission
              }
              style={{ width: '100%' }}
            />
          </View>
        </View>

        {/* Demo Info */}
        <Card style={{ marginHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.primary,
                marginBottom: spacing.sm,
              }}
            >
              Demo QR Code Formats:
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: colors.textSecondary,
                fontFamily: 'monospace',
                marginBottom: spacing.xs,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
                backgroundColor: colors.lightBackground,
                borderRadius: 4,
              }}
            >
              dinesmart://restaurant/rest-1/table/101
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: colors.textSecondary,
                fontFamily: 'monospace',
                marginBottom: spacing.xs,
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
                backgroundColor: colors.lightBackground,
                borderRadius: 4,
              }}
            >
              dinesmart://restaurant/rest-2/table/205
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: colors.textSecondary,
                fontFamily: 'monospace',
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.sm,
                backgroundColor: colors.lightBackground,
                borderRadius: 4,
              }}
            >
              dinesmart://table/301
            </Text>
          </View>
        </Card>

        {/* Features Section */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.xl }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: colors.textPrimary,
              marginBottom: spacing.md,
            }}
          >
            What You Can Do
          </Text>

          {[
            { title: 'View Menu', desc: 'Browse restaurant menu by category' },
            { title: 'Place Order', desc: 'Add items to cart and checkout' },
            { title: 'Track Status', desc: 'Real-time order preparation status' },
            { title: 'View History', desc: 'Access past orders and reorder' },
          ].map((feature, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                marginBottom: spacing.md,
                alignItems: 'flex-start',
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  {index === 0 ? '📋' : index === 1 ? '🛒' : index === 2 ? '⏱️' : '📜'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.textPrimary,
                    marginBottom: spacing.xs,
                  }}
                >
                  {feature.title}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                  {feature.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
}
