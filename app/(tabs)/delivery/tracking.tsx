import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Linking,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Check,
  ChevronRight,
  Home
} from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useCartStore } from '@/store/cart-store';

// Order status steps
const orderSteps = [
  { id: 'confirmed', label: 'Pesanan Dikonfirmasi' },
  { id: 'preparing', label: 'Sedang Diproses' },
  { id: 'delivering', label: 'Dalam Pengiriman' },
  { id: 'delivered', label: 'Pesanan Selesai' },
];

export default function TrackingScreen() {
  const router = useRouter();
  const { activeOrder, updateOrderStatus } = useCartStore();
  const [currentStep, setCurrentStep] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
  // Animation for progress bar
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Set current step based on order status
    if (activeOrder) {
      const stepIndex = orderSteps.findIndex(step => step.id === activeOrder.status);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
        
        // Animate progress bar
        Animated.timing(progressAnim, {
          toValue: (stepIndex + 1) / orderSteps.length,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }
    }
    
    // For demo purposes, automatically update order status after some time
    if (activeOrder && activeOrder.status === 'confirmed') {
      const timer = setTimeout(() => {
        updateOrderStatus(activeOrder.id, 'preparing');
      }, 10000);
      
      return () => clearTimeout(timer);
    }
    
    if (activeOrder && activeOrder.status === 'preparing') {
      const timer = setTimeout(() => {
        updateOrderStatus(activeOrder.id, 'delivering');
      }, 10000);
      
      return () => clearTimeout(timer);
    }
    
    if (activeOrder && activeOrder.status === 'delivering') {
      const timer = setTimeout(() => {
        updateOrderStatus(activeOrder.id, 'delivered');
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [activeOrder]);
  
  // Update UI when order status changes
  useEffect(() => {
    if (activeOrder) {
      const stepIndex = orderSteps.findIndex(step => step.id === activeOrder.status);
      if (stepIndex !== -1 && stepIndex !== currentStep) {
        setCurrentStep(stepIndex);
        
        // Animate progress bar
        Animated.timing(progressAnim, {
          toValue: (stepIndex + 1) / orderSteps.length,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }
    }
  }, [activeOrder?.status]);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleGoHome = () => {
    router.push('/');
  };
  
  const handleCallDriver = () => {
    if (activeOrder?.driverPhone) {
      Linking.openURL(`tel:${activeOrder.driverPhone}`);
    }
  };
  
  const handleMessageDriver = () => {
    if (activeOrder?.driverPhone) {
      Linking.openURL(`sms:${activeOrder.driverPhone}`);
    }
  };
  
  if (!activeOrder) {
    return (
      <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lacak Pesanan</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Tidak Ada Pesanan Aktif</Text>
          <Text style={styles.emptyText}>
            Anda tidak memiliki pesanan yang sedang aktif saat ini
          </Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleGoHome}
            activeOpacity={0.8}
          >
            <Home size={20} color={colors.white} />
            <Text style={styles.homeButtonText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lacak Pesanan</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.orderInfoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>Pesanan {activeOrder.id}</Text>
            <Text style={styles.orderDate}>
              {new Date(activeOrder.createdAt).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { width: progressWidth },
                ]}
              />
            </View>
            
            <View style={styles.stepsContainer}>
              {orderSteps.map((step, index) => {
                const isActive = index <= currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <View key={step.id} style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepCircle,
                        isActive && styles.stepCircleActive,
                      ]}
                    >
                      {isCompleted ? (
                        <Check size={16} color={colors.white} />
                      ) : (
                        <Text
                          style={[
                            styles.stepNumber,
                            isActive && styles.stepNumberActive,
                          ]}
                        >
                          {index + 1}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        isActive && styles.stepLabelActive,
                      ]}
                    >
                      {step.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          
          {activeOrder.status === 'delivering' && (
            <View style={styles.driverContainer}>
              <View style={styles.driverInfo}>
                <Image
                  source={activeOrder.driverPhoto || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'}
                  style={styles.driverPhoto}
                  contentFit="cover"
                />
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>{activeOrder.driverName || 'Kurir'}</Text>
                  <Text style={styles.driverStatus}>Sedang menuju lokasi Anda</Text>
                </View>
              </View>
              
              <View style={styles.driverActions}>
                <TouchableOpacity
                  style={styles.driverAction}
                  onPress={handleCallDriver}
                  activeOpacity={0.7}
                >
                  <Phone size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.driverAction}
                  onPress={handleMessageDriver}
                  activeOpacity={0.7}
                >
                  <MessageCircle size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <View style={styles.deliveryInfoContainer}>
            <View style={styles.deliveryInfoItem}>
              <MapPin size={20} color={colors.primary} />
              <View style={styles.deliveryInfoContent}>
                <Text style={styles.deliveryInfoLabel}>Alamat Pengiriman</Text>
                <Text style={styles.deliveryInfoValue}>
                  {activeOrder.deliveryInfo.address}
                </Text>
              </View>
            </View>
            
            <View style={styles.deliveryInfoItem}>
              <Clock size={20} color={colors.primary} />
              <View style={styles.deliveryInfoContent}>
                <Text style={styles.deliveryInfoLabel}>Estimasi Tiba</Text>
                <Text style={styles.deliveryInfoValue}>
                  {activeOrder.estimatedDeliveryTime || '30-45 menit'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
        
        <View style={styles.orderItemsContainer}>
          <Text style={styles.sectionTitle}>Detail Pesanan</Text>
          
          {activeOrder.items.map((item, index) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemQuantity}>
                <Text style={styles.quantityText}>{item.quantity}x</Text>
              </View>
              <View style={styles.orderItemDetails}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                {item.notes && (
                  <Text style={styles.orderItemNotes}>Catatan: {item.notes}</Text>
                )}
              </View>
              <Text style={styles.orderItemPrice}>
                {(item.priceValue * item.quantity).toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
          ))}
          
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {activeOrder.totalAmount.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Biaya Pengiriman</Text>
              <Text style={styles.summaryValue}>
                {(10000).toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {(activeOrder.totalAmount + 10000).toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
          </View>
        </View>
        
        {activeOrder.status === 'delivered' && (
          <View style={styles.completedContainer}>
            <LinearGradient
              colors={[colors.success, '#1A7D73']}
              style={styles.completedGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.completedIconContainer}>
                <Check size={32} color={colors.white} />
              </View>
              <Text style={styles.completedTitle}>Pesanan Selesai</Text>
              <Text style={styles.completedText}>
                Terima kasih telah memesan dari Catering Nusantara
              </Text>
              <TouchableOpacity
                style={styles.orderAgainButton}
                onPress={handleGoHome}
                activeOpacity={0.8}
              >
                <Text style={styles.orderAgainText}>Pesan Lagi</Text>
                <ChevronRight size={20} color={colors.white} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  orderInfoContainer: {
    padding: 20,
  },
  orderHeader: {
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  statusContainer: {
    marginBottom: 24,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.grayLight,
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    width: '25%',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  stepNumberActive: {
    color: colors.white,
  },
  stepLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: colors.textDark,
    fontWeight: '500',
  },
  driverContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  driverStatus: {
    fontSize: 14,
    color: colors.textLight,
  },
  driverActions: {
    flexDirection: 'row',
  },
  driverAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deliveryInfoContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  deliveryInfoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  deliveryInfoItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  deliveryInfoContent: {
    marginLeft: 12,
    flex: 1,
  },
  deliveryInfoLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  deliveryInfoValue: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '500',
  },
  orderItemsContainer: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: colors.grayLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderItemQuantity: {
    width: 30,
    marginRight: 12,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 4,
  },
  orderItemNotes: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  orderSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  completedContainer: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: colors.grayLight,
  },
  completedGradient: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  completedIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  completedText: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  orderAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  orderAgainText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    marginRight: 4,
  },
  // Empty container styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 8,
  },
});