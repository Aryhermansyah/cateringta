import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Check, 
  Briefcase, 
  GraduationCap, 
  Wallet, 
  Award, 
  Users, 
  Heart, 
  Leaf, 
  PartyPopper, 
  FileEdit, 
  Calendar 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { text } from '@/constants/text';
import { weeklyMenu } from '@/mocks/menu';

// Define interface untuk memaparkan metode ref
export interface SubscriptionSectionRef {
  handlePageScroll: (scrollOffset: number) => void;
}

const SubscriptionSection = forwardRef<SubscriptionSectionRef, {}>((props, ref) => {
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const cardWidth = width > 768 ? width * 0.22 : width * 0.7;
  const cardMargin = 10;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const userScrollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Tambahkan state untuk animasi scroll-triggered
  const [isAnimationTriggered, setIsAnimationTriggered] = useState(false);
  const [viewPosition, setViewPosition] = useState({ y: 0, height: 0 });
  
  // Animation values
  const part1Anim = useRef(new Animated.Value(0)).current;
  const part2Anim = useRef(new Animated.Value(0)).current;
  const part3Anim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  // Handler untuk melacak posisi view
  const handleLayout = (event: { nativeEvent: { layout: { y: number, height: number } } }) => {
    const { y, height } = event.nativeEvent.layout;
    setViewPosition({ y, height });
  };

  // Metode untuk memulai animasi
  const startAnimation = () => {
    if (!isAnimationTriggered) {
      setIsAnimationTriggered(true);
      
      // Animasi fade in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Animasi teks secara berurutan
      Animated.sequence([
        Animated.timing(part1Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(part2Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(part3Anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Fungsi untuk cek apakah section sudah terlihat saat scroll
  const checkIfVisible = (scrollOffset: number) => {
    const windowHeight = Dimensions.get('window').height;
    // Komponen dianggap visible jika bagian atasnya masuk viewport
    const threshold = viewPosition.y - windowHeight + 150;
    
    if (scrollOffset > threshold && !isAnimationTriggered) {
      startAnimation();
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (isUserScrolling) return;

    const autoScrollInterval = setInterval(() => {
      if (scrollViewRef.current && !isUserScrolling) {
        const nextIndex = (currentIndex + 1) % text.subscription.packages.length;
        scrollViewRef.current.scrollTo({
          x: nextIndex * (cardWidth + cardMargin * 2),
          animated: true
        });
        setCurrentIndex(nextIndex);
      }
    }, 3000); // Change card every 3 seconds

    return () => clearInterval(autoScrollInterval);
  }, [currentIndex, cardWidth, isUserScrolling]);

  // Handle manual scroll untuk cards
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / (cardWidth + cardMargin * 2));
        
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }

        // Set user scrolling flag
        setIsUserScrolling(true);
        
        // Clear any existing timeout
        if (userScrollingTimeoutRef.current) {
          clearTimeout(userScrollingTimeoutRef.current);
        }
        
        // Reset the flag after a delay
        userScrollingTimeoutRef.current = setTimeout(() => {
          setIsUserScrolling(false);
        }, 4000); // Resume auto-scroll after 4 seconds of inactivity
      }
    }
  );

  // Ekspos method untuk parent component
  useImperativeHandle(ref, () => ({
    handlePageScroll: (scrollOffset: number) => {
      checkIfVisible(scrollOffset);
    }
  }));

  const getIconForPackage = (iconName: string) => {
    const iconProps = { 
      size: 20, 
      color: colors.primary,
      strokeWidth: 2
    };

    switch (iconName) {
      case 'Briefcase':
        return <Briefcase {...iconProps} />;
      case 'GraduationCap':
        return <GraduationCap {...iconProps} />;
      case 'Wallet':
        return <Wallet {...iconProps} />;
      case 'Award':
        return <Award {...iconProps} />;
      case 'Users':
        return <Users {...iconProps} />;
      case 'Heart':
        return <Heart {...iconProps} />;
      case 'Leaf':
        return <Leaf {...iconProps} />;
      case 'PartyPopper':
        return <PartyPopper {...iconProps} />;
      case 'FileEdit':
        return <FileEdit {...iconProps} />;
      case 'Calendar':
        return <Calendar {...iconProps} />;
      default:
        return <Check {...iconProps} />;
    }
  };

  const renderPackageCards = () => {
    return text.subscription.packages.map((pkg, index) => {
      const inputRange = [
        (index - 1) * (cardWidth + cardMargin * 2),
        index * (cardWidth + cardMargin * 2),
        (index + 1) * (cardWidth + cardMargin * 2),
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.85, 1, 0.85],
        extrapolate: 'clamp',
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.6, 1, 0.6],
        extrapolate: 'clamp',
      });

      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [15, 0, 15],
        extrapolate: 'clamp',
      });
      
      const rotate = scrollX.interpolate({
        inputRange,
        outputRange: ['0deg', '0deg', '0deg'],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          key={pkg.id}
          style={[
            styles.packageCard,
            { 
              width: cardWidth,
              marginHorizontal: cardMargin,
              transform: [
                { scale }, 
                { translateY },
                { rotate }
              ],
              opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.white, colors.backgroundAlt]}
            style={styles.cardGradient}
          >
            <Animated.View 
              style={[
                styles.iconContainer,
                {
                  transform: [
                    { 
                      scale: scrollX.interpolate({
                        inputRange,
                        outputRange: [0.9, 1.1, 0.9],
                        extrapolate: 'clamp',
                      }) 
                    }
                  ]
                }
              ]}
            >
              {getIconForPackage(pkg.icon || '')}
            </Animated.View>
            <Text style={styles.packageName}>{pkg.name}</Text>
            <Text style={styles.packagePrice}>{pkg.price}</Text>
            <Text style={styles.packageDescription}>{pkg.description}</Text>
          </LinearGradient>
        </Animated.View>
      );
    });
  };

  const renderWeeklyMenu = () => {
    if (width >= 768) {
      // Desktop/tablet layout - grid
      return (
        <View style={styles.weeklyMenuContainer}>
          <Text style={styles.weeklyMenuTitle}>Contoh Menu Mingguan</Text>
          <View style={styles.weeklyMenuGrid}>
            {weeklyMenu.map((day, index) => {
              // Create staggered animation for each day
              const dayFadeAnim = useRef(new Animated.Value(0)).current;
              const dayTranslateYAnim = useRef(new Animated.Value(20)).current;
              
              useEffect(() => {
                Animated.sequence([
                  Animated.delay(index * 150),
                  Animated.parallel([
                    Animated.timing(dayFadeAnim, {
                      toValue: 1,
                      duration: 500,
                      useNativeDriver: true,
                    }),
                    Animated.timing(dayTranslateYAnim, {
                      toValue: 0,
                      duration: 500,
                      useNativeDriver: true,
                    }),
                  ]),
                ]).start();
              }, []);
              
              return (
                <Animated.View 
                  key={day.day} 
                  style={[
                    styles.dayContainer,
                    {
                      opacity: dayFadeAnim,
                      transform: [{ translateY: dayTranslateYAnim }],
                    }
                  ]}
                >
                  <Text style={styles.dayTitle}>{day.day}</Text>
                  {day.items.map((item, itemIndex) => (
                    <Text key={itemIndex} style={styles.menuItem}>• {item}</Text>
                  ))}
                </Animated.View>
              );
            })}
          </View>
        </View>
      );
    } else {
      // Mobile layout - horizontal scroll
      return (
        <View style={styles.weeklyMenuContainerMobile}>
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
                    styles.dayCardMobile,
                    {
                      opacity: dayFadeAnim,
                      transform: [{ scale: dayScaleAnim }],
                    }
                  ]}
                >
                  <LinearGradient
                    colors={[colors.white, colors.backgroundAlt]}
                    style={styles.dayCardGradient}
                  >
                    <View style={styles.dayHeaderMobile}>
                      <Text style={styles.dayTitleMobile}>{day.day}</Text>
                      <Calendar size={16} color={colors.primary} />
                    </View>
                    <View style={styles.daySeparator} />
                    {day.items.map((item, itemIndex) => (
                      <Text key={itemIndex} style={styles.menuItemMobile}>• {item}</Text>
                    ))}
                  </LinearGradient>
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>
      );
    }
  };

  return (
    <Animated.View 
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        }
      ]}
    >
      <View style={styles.typographyContainer}>
        <Animated.Text 
          style={[
            styles.headingPart1,
            { 
              opacity: part1Anim,
              transform: [
                { 
                  translateY: part1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }) 
                }
              ] 
            }
          ]}
        >
          Langganan tiap hari
        </Animated.Text>
        
        <Animated.Text 
          style={[
            styles.headingPart2,
            { 
              opacity: part2Anim,
              transform: [
                { 
                  translateY: part2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }) 
                }
              ] 
            }
          ]}
        >
          Makan Siang Praktis & Variatif
        </Animated.Text>
        
        <Animated.Text 
          style={[
            styles.headingPart3,
            { 
              opacity: part3Anim,
              transform: [
                { 
                  translateY: part3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }) 
                }
              ] 
            }
          ]}
        >
          Untuk Kantor, Sekolah, Rumah, dan Berbagai Kegiatan Harian
        </Animated.Text>
      </View>

      <View style={styles.carouselContainer}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          snapToInterval={cardWidth + cardMargin * 2}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={() => setIsUserScrolling(true)}
        >
          {renderPackageCards()}
        </Animated.ScrollView>
        
        <View style={styles.paginationContainer}>
          {text.subscription.packages.map((_, i) => {
            const inputRange = [
              (i - 1) * (cardWidth + cardMargin * 2),
              i * (cardWidth + cardMargin * 2),
              (i + 1) * (cardWidth + cardMargin * 2),
            ];
            
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 16, 8],
              extrapolate: 'clamp',
            });
            
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.2, 0.8],
              extrapolate: 'clamp',
            });
            
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { 
                    width: dotWidth, 
                    opacity,
                    transform: [{ scale }]
                  }
                ]}
              />
            );
          })}
        </View>
      </View>

      {renderWeeklyMenu()}

      <TouchableOpacity 
        style={styles.ctaButton} 
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.secondary, colors.secondaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaText}>Tanya Detail Langganan</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundAlt,
  },
  typographyContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  headingPart1: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headingPart2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  headingPart3: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 350,
  },
  carouselContainer: {
    marginBottom: 20,
  },
  scrollViewContent: {
    paddingVertical: 10,
    paddingHorizontal: Platform.OS === 'web' ? 20 : 0,
  },
  packageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 200,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  // Desktop weekly menu styles
  weeklyMenuContainer: {
    marginTop: 30,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
  },
  weeklyMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  weeklyMenuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayContainer: {
    width: '19%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  menuItem: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  // Mobile weekly menu styles
  weeklyMenuContainerMobile: {
    marginTop: 30,
    marginBottom: 20,
  },
  weeklyMenuScrollContent: {
    paddingVertical: 10,
    paddingRight: 20,
  },
  dayCardMobile: {
    width: 220,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dayCardGradient: {
    padding: 16,
    height: '100%',
  },
  dayHeaderMobile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayTitleMobile: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  daySeparator: {
    height: 1,
    backgroundColor: colors.grayLight,
    marginBottom: 12,
  },
  menuItemMobile: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 6,
  },
  ctaButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ctaGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubscriptionSection;