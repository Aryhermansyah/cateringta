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
  Image as RNImage,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ChevronRight, 
  Users, 
  Calendar, 
  UtensilsCrossed, 
  Clock,
  MessageCircle
} from 'lucide-react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

// Catering package data
const cateringPackages = [
  {
    id: 1,
    name: 'Paket Hajatan',
    description: 'Cocok untuk acara pernikahan, syukuran, dan perayaan besar',
    minOrder: '100 porsi',
    priceRange: 'Rp 25.000 - Rp 50.000 per porsi',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['Menu prasmanan', 'Dekorasi meja', 'Peralatan makan', 'Pelayan']
  },
  {
    id: 2,
    name: 'Paket Rapat & Seminar',
    description: 'Ideal untuk pertemuan bisnis, seminar, dan workshop',
    minOrder: '30 porsi',
    priceRange: 'Rp 20.000 - Rp 35.000 per porsi',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['Coffee break', 'Makan siang', 'Snack box', 'Air mineral']
  },
  {
    id: 3,
    name: 'Paket Ulang Tahun',
    description: 'Sempurna untuk perayaan ulang tahun anak atau dewasa',
    minOrder: '50 porsi',
    priceRange: 'Rp 18.000 - Rp 30.000 per porsi',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['Kue ulang tahun', 'Snack box', 'Dekorasi', 'Goodie bag']
  },
  {
    id: 4,
    name: 'Paket Aqiqah',
    description: 'Paket lengkap untuk acara aqiqah dengan menu khas',
    minOrder: '80 porsi',
    priceRange: 'Rp 22.000 - Rp 40.000 per porsi',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['Menu tradisional', 'Nasi kotak', 'Kambing/domba', 'Peralatan makan']
  }
];

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Ahmad Fauzi',
    role: 'Pengantin Pria',
    text: 'Catering untuk pernikahan kami sangat memuaskan. Tamu-tamu memuji kelezatan makanannya!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    role: 'Event Organizer',
    text: 'Sudah 5 kali menggunakan jasa catering ini untuk acara seminar. Selalu tepat waktu dan rasa konsisten.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 3,
    name: 'Budi Santoso',
    role: 'Manajer Perusahaan',
    text: 'Pelayanan sangat profesional. Menu bervariasi dan selalu ada pilihan baru setiap pemesanan.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }
];

export default function CateringScreen() {
  const { width } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
  // For testimonial carousel
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialScrollX = useRef(new Animated.Value(0)).current;
  
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
    
    // Auto-scroll testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Animate to the active testimonial
    if (Platform.OS !== 'web') {
      Animated.spring(testimonialScrollX, {
        toValue: -activeTestimonial * width,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [activeTestimonial, width]);
  
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const handleWhatsAppPress = () => {
    // Implementation for WhatsApp contact
  };
  
  const renderCateringPackages = () => {
    return cateringPackages.map((pkg, index) => {
      // Create staggered animation for each package
      const itemFadeAnim = useRef(new Animated.Value(0)).current;
      const itemTranslateYAnim = useRef(new Animated.Value(20)).current;
      
      useEffect(() => {
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.parallel([
            Animated.timing(itemFadeAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(itemTranslateYAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, []);
      
      return (
        <Animated.View
          key={pkg.id}
          style={[
            styles.packageCard,
            {
              opacity: itemFadeAnim,
              transform: [{ translateY: itemTranslateYAnim }],
            },
          ]}
        >
          <View style={styles.packageImageContainer}>
            <Image
              source={pkg.image}
              style={styles.packageImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageGradient}
            />
            <Text style={styles.packageName}>{pkg.name}</Text>
          </View>
          
          <View style={styles.packageContent}>
            <Text style={styles.packageDescription}>{pkg.description}</Text>
            
            <View style={styles.packageDetails}>
              <View style={styles.detailItem}>
                <Users size={16} color={colors.primary} />
                <Text style={styles.detailText}>Min. {pkg.minOrder}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Calendar size={16} color={colors.primary} />
                <Text style={styles.detailText}>Pesan 3 hari sebelumnya</Text>
              </View>
            </View>
            
            <Text style={styles.priceRange}>{pkg.priceRange}</Text>
            
            <View style={styles.featuresContainer}>
              {pkg.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.detailButton}
              onPress={handleWhatsAppPress}
              activeOpacity={0.8}
            >
              <Text style={styles.detailButtonText}>Lihat Detail</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    });
  };
  
  const renderTestimonials = () => {
    if (Platform.OS === 'web') {
      // For web, render active testimonial only
      const testimonial = testimonials[activeTestimonial];
      
      return (
        <View style={styles.testimonialContainer}>
          <View style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <Image
                source={testimonial.image}
                style={styles.testimonialImage}
                contentFit="cover"
              />
              <View style={styles.testimonialAuthor}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialRole}>{testimonial.role}</Text>
              </View>
            </View>
            <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
          </View>
          
          <View style={styles.testimonialDots}>
            {testimonials.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveTestimonial(index)}
              >
                <View
                  style={[
                    styles.testimonialDot,
                    activeTestimonial === index && styles.testimonialDotActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    } else {
      // For native, use horizontal scroll animation
      return (
        <View style={styles.testimonialContainer}>
          <Animated.View
            style={[
              styles.testimonialScroller,
              {
                transform: [{ translateX: testimonialScrollX }],
                width: width * testimonials.length,
              },
            ]}
          >
            {testimonials.map((testimonial) => (
              <View
                key={testimonial.id}
                style={[styles.testimonialCard, { width: width - 40 }]}
              >
                <View style={styles.testimonialHeader}>
                  <Image
                    source={testimonial.image}
                    style={styles.testimonialImage}
                    contentFit="cover"
                  />
                  <View style={styles.testimonialAuthor}>
                    <Text style={styles.testimonialName}>{testimonial.name}</Text>
                    <Text style={styles.testimonialRole}>{testimonial.role}</Text>
                  </View>
                </View>
                <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
              </View>
            ))}
          </Animated.View>
          
          <View style={styles.testimonialDots}>
            {testimonials.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveTestimonial(index)}
              >
                <View
                  style={[
                    styles.testimonialDot,
                    activeTestimonial === index && styles.testimonialDotActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
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
        <Text style={styles.headerTitle}>Catering</Text>
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
          <Text style={styles.heroTitle}>Catering untuk Semua Acara</Text>
          <Text style={styles.heroSubtitle}>
            Kami menyediakan berbagai paket catering untuk acara pernikahan, 
            ulang tahun, rapat, dan berbagai acara lainnya
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Acara</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Menu</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Puas</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleWhatsAppPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.contactButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MessageCircle size={20} color={colors.white} />
              <Text style={styles.contactButtonText}>Konsultasi Gratis</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Paket Catering</Text>
          <Text style={styles.sectionSubtitle}>
            Pilih paket yang sesuai dengan kebutuhan acara Anda
          </Text>
          
          {renderCateringPackages()}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Proses Pemesanan</Text>
          
          <View style={styles.processContainer}>
            <View style={styles.processStep}>
              <View style={styles.processNumberContainer}>
                <Text style={styles.processNumber}>1</Text>
              </View>
              <Text style={styles.processTitle}>Konsultasi</Text>
              <Text style={styles.processDescription}>
                Diskusikan kebutuhan dan anggaran acara Anda dengan tim kami
              </Text>
            </View>
            
            <View style={styles.processArrow}>
              <ChevronRight size={20} color={colors.primary} />
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.processNumberContainer}>
                <Text style={styles.processNumber}>2</Text>
              </View>
              <Text style={styles.processTitle}>Penawaran</Text>
              <Text style={styles.processDescription}>
                Kami berikan penawaran harga dan menu yang sesuai kebutuhan
              </Text>
            </View>
            
            <View style={styles.processArrow}>
              <ChevronRight size={20} color={colors.primary} />
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.processNumberContainer}>
                <Text style={styles.processNumber}>3</Text>
              </View>
              <Text style={styles.processTitle}>Eksekusi</Text>
              <Text style={styles.processDescription}>
                Kami siapkan dan sajikan hidangan terbaik untuk acara Anda
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Testimoni Pelanggan</Text>
          {renderTestimonials()}
        </View>
        
        <View style={styles.ctaContainer}>
          <LinearGradient
            colors={[colors.backgroundAlt, colors.white]}
            style={styles.ctaGradient}
          >
            <UtensilsCrossed size={40} color={colors.primary} />
            <Text style={styles.ctaTitle}>Siap Memesan?</Text>
            <Text style={styles.ctaText}>
              Hubungi kami sekarang untuk mendapatkan penawaran terbaik
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleWhatsAppPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.ctaButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Clock size={20} color={colors.white} />
                <Text style={styles.ctaButtonText}>Pesan Sekarang</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.grayLight,
  },
  contactButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  contactButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
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
  packageCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  packageImageContainer: {
    height: 160,
    position: 'relative',
  },
  packageImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  packageName: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  packageContent: {
    padding: 16,
  },
  packageDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  packageDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    color: colors.textDark,
    marginLeft: 4,
  },
  priceRange: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
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
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.textDark,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 4,
  },
  processContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  processStep: {
    width: Platform.OS === 'web' ? '28%' : '100%',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 0 : 20,
  },
  processNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  processNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  processTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  processDescription: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  processArrow: {
    display: Platform.OS === 'web' ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  testimonialContainer: {
    marginTop: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  testimonialScroller: {
    flexDirection: 'row',
  },
  testimonialCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: Platform.OS === 'web' ? 0 : 10,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  testimonialAuthor: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 2,
  },
  testimonialRole: {
    fontSize: 12,
    color: colors.textLight,
  },
  testimonialText: {
    fontSize: 14,
    color: colors.textDark,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  testimonialDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  testimonialDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginHorizontal: 4,
  },
  testimonialDotActive: {
    backgroundColor: colors.primary,
    width: 16,
  },
  ctaContainer: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: colors.grayLight,
  },
  ctaGradient: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 300,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  ctaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
});