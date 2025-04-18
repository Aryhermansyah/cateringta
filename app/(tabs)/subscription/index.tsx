import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Platform,
  StatusBar,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar, 
  Check, 
  ChevronRight, 
  Clock, 
  CreditCard,
  MessageCircle,
  Star,
  User,
  Mail,
  Phone,
  Home as HomeIcon
} from 'lucide-react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

// Subscription plans data
const subscriptionPlans = [
  {
    id: 1,
    name: 'Paket Sekolah',
    price: 'Rp10.000',
    pricePerDay: 'per porsi',
    description: 'Menu sehat dan bergizi untuk pelajar',
    features: [
      'Menu berbeda setiap hari',
      'Nutrisi seimbang',
      'Pengiriman tepat waktu',
      'Kemasan ramah lingkungan'
    ],
    recommended: false,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Paket Kantor',
    price: 'Rp15.000',
    pricePerDay: 'per porsi',
    description: 'Menu lengkap dengan protein dan sayuran',
    features: [
      'Menu berbeda setiap hari',
      'Porsi lebih besar',
      'Pengiriman tepat waktu',
      'Kemasan premium'
    ],
    recommended: true,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Paket Premium',
    price: 'Rp25.000',
    pricePerDay: 'per porsi',
    description: 'Menu spesial dengan pilihan premium',
    features: [
      'Menu berbeda setiap hari',
      'Bahan premium',
      'Pengiriman prioritas',
      'Kemasan eksklusif',
      'Pilihan menu khusus'
    ],
    recommended: false,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

// Weekly menu sample
const weeklyMenu = [
  {
    day: 'Senin',
    items: [
      'Nasi Putih',
      'Ayam Goreng Serundeng',
      'Capcay Kuah',
      'Tempe Orek',
      'Kerupuk',
    ],
  },
  {
    day: 'Selasa',
    items: [
      'Nasi Putih',
      'Rendang Sapi',
      'Sayur Lodeh',
      'Telur Dadar',
      'Kerupuk',
    ],
  },
  {
    day: 'Rabu',
    items: [
      'Nasi Putih',
      'Ikan Patin Asam Manis',
      'Tumis Kangkung',
      'Tahu Goreng',
      'Kerupuk',
    ],
  },
  {
    day: 'Kamis',
    items: [
      'Nasi Putih',
      'Ayam Bakar Kecap',
      'Sayur Asem',
      'Tempe Mendoan',
      'Kerupuk',
    ],
  },
  {
    day: 'Jumat',
    items: [
      'Nasi Putih',
      'Sate Ayam',
      'Soup Sayuran',
      'Perkedel Kentang',
      'Kerupuk',
    ],
  },
];

export default function SubscriptionScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
  // Form state
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('1 bulan');
  
  useEffect(() => {
    // Entrance animation
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
  
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const handleSelectPlan = (planId: number) => {
    setSelectedPlan(planId);
  };
  
  const handleSubmit = () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Silakan pilih paket langganan');
      return;
    }
    
    if (!name || !email || !phone || !address || !startDate) {
      Alert.alert('Error', 'Silakan lengkapi semua data');
      return;
    }
    
    // In a real app, you would submit this data to your backend
    Alert.alert(
      'Berhasil',
      'Permintaan langganan Anda telah dikirim. Tim kami akan menghubungi Anda segera.',
      [{ text: 'OK' }]
    );
  };
  
  const renderSubscriptionPlans = () => {
    return subscriptionPlans.map((plan, index) => {
      // Create staggered animation for each plan
      const planFadeAnim = useRef(new Animated.Value(0)).current;
      const planTranslateYAnim = useRef(new Animated.Value(20)).current;
      
      useEffect(() => {
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.parallel([
            Animated.timing(planFadeAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(planTranslateYAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, []);
      
      const isSelected = selectedPlan === plan.id;
      
      return (
        <Animated.View
          key={plan.id}
          style={[
            styles.planCard,
            isSelected && styles.planCardSelected,
            {
              opacity: planFadeAnim,
              transform: [{ translateY: planTranslateYAnim }],
            },
          ]}
        >
          {plan.recommended && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Terpopuler</Text>
            </View>
          )}
          
          <View style={styles.planImageContainer}>
            <Image
              source={plan.image}
              style={styles.planImage}
              contentFit="cover"
            />
          </View>
          
          <View style={styles.planContent}>
            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planPricePerDay}>{plan.pricePerDay}</Text>
            </View>
            <Text style={styles.planDescription}>{plan.description}</Text>
            
            <View style={styles.featuresContainer}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Check size={16} color={colors.primary} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity
              style={[
                styles.selectButton,
                isSelected && styles.selectButtonSelected,
              ]}
              onPress={() => handleSelectPlan(plan.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  isSelected && styles.selectButtonTextSelected,
                ]}
              >
                {isSelected ? 'Terpilih' : 'Pilih Paket'}
              </Text>
              {isSelected && <Check size={16} color={colors.white} />}
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    });
  };
  
  const renderWeeklyMenu = () => {
    return (
      <View style={styles.weeklyMenuContainer}>
        <Text style={styles.weeklyMenuTitle}>Contoh Menu Mingguan</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weeklyMenuScrollContent}
        >
          {weeklyMenu.map((day, index) => {
            // Create staggered animation for each day card
            const dayFadeAnim = useRef(new Animated.Value(0)).current;
            const dayScaleAnim = useRef(new Animated.Value(0.9)).current;
            
            useEffect(() => {
              Animated.sequence([
                Animated.delay(index * 150),
                Animated.parallel([
                  Animated.timing(dayFadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                  }),
                  Animated.spring(dayScaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                  }),
                ]),
              ]).start();
            }, []);
            
            return (
              <Animated.View
                key={day.day}
                style={[
                  styles.dayCard,
                  {
                    opacity: dayFadeAnim,
                    transform: [{ scale: dayScaleAnim }],
                  },
                ]}
              >
                <LinearGradient
                  colors={[colors.white, colors.backgroundAlt]}
                  style={styles.dayCardGradient}
                >
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayTitle}>{day.day}</Text>
                    <Calendar size={16} color={colors.primary} />
                  </View>
                  <View style={styles.daySeparator} />
                  {day.items.map((item, itemIndex) => (
                    <Text key={itemIndex} style={styles.menuItem}>
                      • {item}
                    </Text>
                  ))}
                </LinearGradient>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  
  const renderSubscriptionForm = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Formulir Langganan</Text>
        
        <View style={styles.inputGroup}>
          <View style={styles.inputIconContainer}>
            <User size={20} color={colors.primary} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nama Lengkap"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={setName}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <View style={styles.inputIconContainer}>
            <Mail size={20} color={colors.primary} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textLight}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <View style={styles.inputIconContainer}>
            <Phone size={20} color={colors.primary} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nomor Telepon"
            placeholderTextColor={colors.textLight}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <View style={styles.inputIconContainer}>
            <HomeIcon size={20} color={colors.primary} />
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
            <Calendar size={20} color={colors.primary} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Tanggal Mulai (DD/MM/YYYY)"
            placeholderTextColor={colors.textLight}
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>
        
        <Text style={styles.formLabel}>Durasi Langganan</Text>
        <View style={styles.durationContainer}>
          {['1 bulan', '3 bulan', '6 bulan'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.durationOption,
                duration === option && styles.durationOptionSelected,
              ]}
              onPress={() => setDuration(option)}
            >
              <Text
                style={[
                  styles.durationText,
                  duration === option && styles.durationTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.submitButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.submitButtonText}>Kirim Permintaan</Text>
            <ChevronRight size={20} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            shadowOpacity: headerOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
          },
        ]}
      >
        <Text style={styles.headerTitle}>Langganan</Text>
      </Animated.View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          <Text style={styles.heroTitle}>Langganan Catering Harian</Text>
          <Text style={styles.heroSubtitle}>
            Nikmati menu berbeda setiap hari tanpa perlu repot memikirkan makan siang
          </Text>
          
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Clock size={24} color={colors.primary} />
              </View>
              <Text style={styles.benefitTitle}>Hemat Waktu</Text>
              <Text style={styles.benefitText}>
                Tidak perlu memikirkan menu harian
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Star size={24} color={colors.primary} />
              </View>
              <Text style={styles.benefitTitle}>Menu Bervariasi</Text>
              <Text style={styles.benefitText}>
                Menu berbeda setiap hari
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <CreditCard size={24} color={colors.primary} />
              </View>
              <Text style={styles.benefitTitle}>Harga Terjangkau</Text>
              <Text style={styles.benefitText}>
                Lebih hemat dengan langganan
              </Text>
            </View>
          </View>
        </Animated.View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Pilih Paket Langganan</Text>
          <Text style={styles.sectionSubtitle}>
            Pilih paket yang sesuai dengan kebutuhan Anda
          </Text>
          
          {renderSubscriptionPlans()}
        </View>
        
        <View style={styles.sectionContainer}>
          {renderWeeklyMenu()}
        </View>
        
        <View style={styles.sectionContainer}>
          {renderSubscriptionForm()}
        </View>
        
        <View style={styles.faqContainer}>
          <Text style={styles.faqTitle}>Pertanyaan Umum</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              Bagaimana cara berlangganan?
            </Text>
            <Text style={styles.faqAnswer}>
              Isi formulir di atas dan tim kami akan menghubungi Anda untuk konfirmasi dan pembayaran.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              Apakah bisa request menu?
            </Text>
            <Text style={styles.faqAnswer}>
              Ya, Anda bisa request menu khusus dengan tambahan biaya tertentu.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>
              Bagaimana jika saya tidak di tempat?
            </Text>
            <Text style={styles.faqAnswer}>
              Anda bisa memberitahu kami 1 hari sebelumnya untuk menunda pengiriman.
            </Text>
          </View>
        </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: colors.white,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
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
  heroSection: {
    padding: 20,
    paddingTop: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
    lineHeight: 24,
  },
  benefitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  benefitItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  benefitText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  sectionContainer: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: colors.grayLight,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.grayLight,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  planImageContainer: {
    height: 120,
  },
  planImage: {
    width: '100%',
    height: '100%',
  },
  planContent: {
    padding: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 4,
  },
  planPricePerDay: {
    fontSize: 14,
    color: colors.textLight,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  selectButtonSelected: {
    backgroundColor: colors.primary,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 4,
  },
  selectButtonTextSelected: {
    color: colors.white,
  },
  weeklyMenuContainer: {
    marginBottom: 20,
  },
  weeklyMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  weeklyMenuScrollContent: {
    paddingRight: 20,
  },
  dayCard: {
    width: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dayCardGradient: {
    padding: 16,
    height: '100%',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  daySeparator: {
    height: 1,
    backgroundColor: colors.grayLight,
    marginBottom: 12,
  },
  menuItem: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 6,
  },
  formContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
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
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  durationOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayLight,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  durationOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundAlt,
  },
  durationText: {
    fontSize: 14,
    color: colors.textDark,
  },
  durationTextSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  submitButton: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginRight: 4,
  },
  faqContainer: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: colors.grayLight,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});