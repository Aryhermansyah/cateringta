import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Clock, 
  CreditCard,
  Wallet,
  ChevronRight,
  MessageCircle
} from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useCartStore } from '@/store/cart-store';

// Payment methods
const paymentMethods = [
  { id: 'cash', name: 'Tunai', icon: 'Wallet' },
  { id: 'transfer', name: 'Transfer Bank', icon: 'CreditCard' },
  { id: 'ewallet', name: 'E-Wallet', icon: 'Smartphone' },
];

// Delivery times
const deliveryTimes = [
  { id: 'now', name: 'Sekarang' },
  { id: 'lunch', name: 'Makan Siang (11:00-13:00)' },
  { id: 'dinner', name: 'Makan Malam (17:00-19:00)' },
  { id: 'tomorrow', name: 'Besok' },
];

export default function CartScreen() {
  const router = useRouter();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    updateNotes,
    getTotalItems, 
    getTotalPrice,
    deliveryInfo,
    setDeliveryInfo,
    placeOrder
  } = useCartStore();
  
  const [address, setAddress] = useState(deliveryInfo?.address || '');
  const [contactName, setContactName] = useState(deliveryInfo?.contactName || '');
  const [contactPhone, setContactPhone] = useState(deliveryInfo?.contactPhone || '');
  const [selectedPayment, setSelectedPayment] = useState(deliveryInfo?.paymentMethod || 'cash');
  const [selectedTime, setSelectedTime] = useState(deliveryInfo?.deliveryTime || 'now');
  
  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const deliveryFee = 10000; // Rp 10.000
  const total = subtotal + deliveryFee;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
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
  }, []);
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleCheckout = () => {
    if (!address || !contactName || !contactPhone) {
      Alert.alert('Info Tidak Lengkap', 'Mohon lengkapi alamat dan kontak pengiriman');
      return;
    }
    
    // Save delivery info
    setDeliveryInfo({
      address,
      contactName,
      contactPhone,
      paymentMethod: selectedPayment,
      deliveryTime: selectedTime,
    });
    
    // Place order
    placeOrder();
    
    // Navigate to order tracking
    router.push('/delivery/tracking');
  };
  
  const renderCartItems = () => {
    return items.map((item, index) => {
      // Create staggered animation for each cart item
      const itemFadeAnim = useRef(new Animated.Value(0)).current;
      const itemTranslateXAnim = useRef(new Animated.Value(-20)).current;
      
      useEffect(() => {
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.parallel([
            Animated.timing(itemFadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(itemTranslateXAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, []);
      
      return (
        <Animated.View
          key={item.id}
          style={[
            styles.cartItem,
            {
              opacity: itemFadeAnim,
              transform: [{ translateX: itemTranslateXAnim }],
            },
          ]}
        >
          <View style={styles.cartItemImageContainer}>
            <Image
              source={item.image}
              style={styles.cartItemImage}
              contentFit="cover"
            />
          </View>
          
          <View style={styles.cartItemContent}>
            <View style={styles.cartItemHeader}>
              <Text style={styles.cartItemName} numberOfLines={1}>
                {item.name}
              </Text>
              <TouchableOpacity
                onPress={() => removeItem(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Trash2 size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.cartItemPrice}>{item.price}</Text>
            
            <View style={styles.cartItemFooter}>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={16} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.cartItemTotal}>
                {(item.priceValue * item.quantity).toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
            
            <TextInput
              style={styles.notesInput}
              placeholder="Tambahkan catatan..."
              placeholderTextColor={colors.textLight}
              value={item.notes}
              onChangeText={(text) => updateNotes(item.id, text)}
            />
          </View>
        </Animated.View>
      );
    });
  };
  
  const renderPaymentMethods = () => {
    return (
      <View style={styles.paymentMethodsContainer}>
        <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
        
        <View style={styles.paymentOptions}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment === method.id && styles.paymentOptionSelected,
              ]}
              onPress={() => setSelectedPayment(method.id)}
              activeOpacity={0.7}
            >
              {method.id === 'cash' ? (
                <Wallet size={20} color={selectedPayment === method.id ? colors.primary : colors.textLight} />
              ) : (
                <CreditCard size={20} color={selectedPayment === method.id ? colors.primary : colors.textLight} />
              )}
              <Text
                style={[
                  styles.paymentOptionText,
                  selectedPayment === method.id && styles.paymentOptionTextSelected,
                ]}
              >
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  const renderDeliveryTimes = () => {
    return (
      <View style={styles.deliveryTimesContainer}>
        <Text style={styles.sectionTitle}>Waktu Pengiriman</Text>
        
        <View style={styles.timeOptions}>
          {deliveryTimes.map((time) => (
            <TouchableOpacity
              key={time.id}
              style={[
                styles.timeOption,
                selectedTime === time.id && styles.timeOptionSelected,
              ]}
              onPress={() => setSelectedTime(time.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.timeOptionText,
                  selectedTime === time.id && styles.timeOptionTextSelected,
                ]}
              >
                {time.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Keranjang</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.emptyCartContainer}>
          <Image
            source="https://images.unsplash.com/photo-1586769852044-692d6e3703f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            style={styles.emptyCartImage}
            contentFit="cover"
          />
          <Text style={styles.emptyCartTitle}>Keranjang Kosong</Text>
          <Text style={styles.emptyCartText}>
            Tambahkan menu ke keranjang untuk melanjutkan pemesanan
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={handleGoBack}
            activeOpacity={0.8}
          >
            <Text style={styles.browseButtonText}>Lihat Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keranjang</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.cartItemsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Pesanan Anda ({totalItems})</Text>
          {renderCartItems()}
        </Animated.View>
        
        <View style={styles.deliveryInfoContainer}>
          <Text style={styles.sectionTitle}>Informasi Pengiriman</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIconContainer}>
              <MapPin size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Alamat Pengiriman"
              placeholderTextColor={colors.textLight}
              value={address}
              onChangeText={setAddress}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIconContainer}>
              <MessageCircle size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nama Penerima"
              placeholderTextColor={colors.textLight}
              value={contactName}
              onChangeText={setContactName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputIconContainer}>
              <MessageCircle size={20} color={colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nomor Telepon"
              placeholderTextColor={colors.textLight}
              keyboardType="phone-pad"
              value={contactPhone}
              onChangeText={setContactPhone}
            />
          </View>
        </View>
        
        {renderDeliveryTimes()}
        {renderPaymentMethods()}
        
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Ringkasan Pembayaran</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {subtotal.toLocaleString('id-ID', {
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
              {deliveryFee.toLocaleString('id-ID', {
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
              {total.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.checkoutContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.checkoutTotalLabel}>Total Pembayaran</Text>
          <Text style={styles.checkoutTotalValue}>
            {total.toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.checkoutButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.checkoutButtonText}>Pesan Sekarang</Text>
            <ChevronRight size={20} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100,
  },
  cartItemsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cartItemImageContainer: {
    width: 80,
    height: 80,
  },
  cartItemImage: {
    width: '100%',
    height: '100%',
  },
  cartItemContent: {
    flex: 1,
    padding: 12,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  cartItemPrice: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  cartItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
  },
  quantityText: {
    width: 28,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  notesInput: {
    fontSize: 12,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deliveryInfoContainer: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: colors.grayLight,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  inputIconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.textDark,
  },
  paymentMethodsContainer: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: colors.grayLight,
  },
  paymentOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
    marginBottom: 8,
    minWidth: '30%',
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundAlt,
  },
  paymentOptionText: {
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 8,
  },
  paymentOptionTextSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  deliveryTimesContainer: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: colors.grayLight,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  timeOption: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
    marginBottom: 8,
    minWidth: '45%',
  },
  timeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundAlt,
  },
  timeOptionText: {
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center',
  },
  timeOptionTextSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 20,
    borderTopWidth: 8,
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
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalContainer: {
    flex: 1,
    marginRight: 16,
  },
  checkoutTotalLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  checkoutTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  checkoutButton: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  checkoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginRight: 4,
  },
  // Empty cart styles
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
});