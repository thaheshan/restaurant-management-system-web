import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useCustomerAuth } from '@contexts/CustomerAuthContext';
import SafeAreaContainer from '@components/layout/SafeAreaContainer';
import Button from '@components/ui/Button';
import Card from '@components/ui/Card';
import { 
  LogOut, 
  QrCode, 
  Menu, 
  ShoppingBag, 
  Timer, 
  History,
  Camera,
  Image as ImageIcon
} from 'lucide-react-native';
import { COLORS } from '@constants/colors';
import { SPACING } from '@constants/spacing';

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
      console.log('Scanned QR data:', scannedData);

      let restaurantId = '';
      let tableNumber = '';

      // ── Try JSON format first (backend generates this) ──
      try {
        const parsed = JSON.parse(scannedData);
        if (parsed.restaurantId) {
          restaurantId = parsed.restaurantId;
          tableNumber = String(parsed.tableNumber || '1');
          console.log('Parsed JSON QR — restaurantId:', restaurantId, 'tableNumber:', tableNumber);
        }
      } catch {
        // ── Fallback: try dinesmart:// URL format ──
        const fullRegex = /dinesmart:\/\/restaurant\/([^/]+)\/table\/([^/]+)/;
        const simpleRegex = /dinesmart:\/\/table\/(\d+)/;

        let match = scannedData.match(fullRegex);
        if (match) {
          restaurantId = match[1];
          tableNumber = match[2];
          console.log('Parsed URL QR (full) — restaurantId:', restaurantId, 'tableNumber:', tableNumber);
        } else {
          match = scannedData.match(simpleRegex);
          if (match) {
            restaurantId = '35f2c4cc-3f75-4181-88e0-6733e4aba39e';
            tableNumber = match[1];
            console.log('Parsed URL QR (simple) — tableNumber:', tableNumber);
          }
        }
      }

      if (restaurantId && tableNumber) {
        setIsScannerOpen(false);
        router.push({
          pathname: '/(customer)/menu-categories',
          params: { restaurantId, tableId: tableNumber },
        });
      } else {
        Alert.alert('Invalid QR Code', 'Please scan a valid DineSmart QR code');
        setIsScanning(false);
      }
    } catch (error) {
      console.error('QR scan error:', error);
      Alert.alert('Error', 'Failed to process QR code');
      setIsScanning(false);
    }
  };

  const handleUploadQRCode = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need gallery permissions to upload a QR code image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // expo-camera does not support scanning from image URI — guide user to use live camera
        Alert.alert(
          'Use Live Scanner',
          'Please use the "Open Scanner" button to scan the QR code directly with your camera.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('QR upload error:', error);
      Alert.alert('Error', 'Failed to process the uploaded image.');
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
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <CameraView
          onBarcodeScanned={isScanning ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
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
          <View
            style={{
              width: 250,
              height: 250,
              borderWidth: 3,
              borderColor: COLORS.primary,
              borderRadius: 12,
            }}
          />
          <Text
            style={{
              marginTop: SPACING.lg,
              fontSize: 14,
              color: COLORS.white,
              textAlign: 'center',
              paddingHorizontal: SPACING.lg,
            }}
          >
            Position the QR code within the frame to scan
          </Text>
        </View>

        {/* Close Button */}
        <View
          style={{
            position: 'absolute',
            bottom: SPACING.lg,
            left: SPACING.lg,
            right: SPACING.lg,
          }}
        >
          <Button
            title="Close Scanner"
            onPress={() => {
              setIsScannerOpen(false);
              setIsScanning(false);
            }}
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
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ marginTop: SPACING.md, fontSize: 14, color: COLORS.white }}>
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
            backgroundColor: COLORS.primary,
            paddingVertical: SPACING.lg,
            paddingHorizontal: SPACING.md,
            marginBottom: SPACING.lg,
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
                color: COLORS.white,
                marginBottom: SPACING.xs,
              }}
            >
              DineSmart
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
              Welcome, {user?.name}
            </Text>
          </View>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            icon={<LogOut size={16} color={COLORS.text.primary} />}
            style={{ paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm }}
          />
        </View>

        {/* Welcome Card */}
        <Card style={{ marginHorizontal: SPACING.md, marginBottom: SPACING.lg }}>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: COLORS.text.primary,
                marginBottom: SPACING.sm,
              }}
            >
              Welcome Back!
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.text.secondary, lineHeight: 20 }}>
              Scan a table QR code to view the menu and place an order
            </Text>
          </View>
        </Card>

        {/* QR Scanner Section */}
        <View style={{ paddingHorizontal: SPACING.md, marginBottom: SPACING.lg }}>
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 12,
              padding: SPACING.lg,
              borderWidth: 2,
              borderColor: COLORS.primary,
              borderStyle: 'dashed',
              alignItems: 'center',
              marginBottom: SPACING.lg,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: COLORS.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: SPACING.md,
              }}
            >
              <QrCode size={40} color={COLORS.white} strokeWidth={2} />
            </View>

            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: COLORS.text.primary,
                marginBottom: SPACING.sm,
                textAlign: 'center',
              }}
            >
              Scan Table QR Code
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: COLORS.text.secondary,
                textAlign: 'center',
                marginBottom: SPACING.lg,
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
              style={{ width: '100%', marginBottom: SPACING.md }}
            />

            <Button
              title="Upload QR Image"
              onPress={handleUploadQRCode}
              variant="secondary"
              icon={<ImageIcon size={20} color={COLORS.text.primary} />}
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaContainer>
  );
}