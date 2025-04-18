import React, { useRef, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated,
  useWindowDimensions,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { text } from '@/constants/text';
import { menuItems } from '@/mocks/menu';

const MenuSection = () => {
  // Destructure hooks dan definisikan semua nilai dasar
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const cardWidth = width > 768 ? width * 0.25 : width * 0.75;
  const cardMargin = 12;
  
  // Semua useRef di satu tempat, pastikan urutan selalu sama
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
  // useMemo untuk semua animasi grid dan promo
  const gridItemAnimations = useMemo(() => {
    const animations = [];
    for (let i = 0; i < 9; i++) {
      animations.push({
        fade: new Animated.Value(0),
        scale: new Animated.Value(0.9)
      });
    }
    return animations;
  }, []);
  
  const promoCardAnimations = useMemo(() => {
    const animations = [];
    for (let i = 0; i < text.menu.promos.length; i++) {
      animations.push({
        fade: new Animated.Value(0),
        scale: new Animated.Value(0.9)
      });
    }
    return animations;
  }, []);

  // Efek untuk animasi utama
  useEffect(() => {
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
  }, []);

  // Efek untuk animasi grid
  useEffect(() => {
    gridItemAnimations.forEach((anim, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const delay = 100 + (row * 3 + col) * 100;
      
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(anim.fade, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, []);

  // Efek untuk animasi promo
  useEffect(() => {
    promoCardAnimations.forEach((anim, index) => {
      const delay = 300 + index * 150;
      
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(anim.fade, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, []);

  const renderMenuGrid = () => {
    // Create a copy of menuItems and ensure we have at least 9 items for the grid
    const gridItems = [...menuItems];
    
    // If we have less than 9 items, duplicate some to fill the grid
    while (gridItems.length < 9) {
      gridItems.push({
        ...menuItems[gridItems.length % menuItems.length],
        id: gridItems.length + 1, // Ensure unique IDs
      });
    }
    
    // Take only the first 9 items for our 3x3 grid
    const displayItems = gridItems.slice(0, 9);
    
    // Create rows of 3 items each
    const rows = [];
    for (let i = 0; i < 9; i += 3) {
      const rowItems = displayItems.slice(i, i + 3);
      rows.push(
        <View key={`row-${i}`} style={styles.gridRow}>
          {rowItems.map((item, index) => {
            const animIndex = i + index;
            return (
              <Animated.View 
                key={item.id} 
                style={[
                  styles.gridItem,
                  {
                    opacity: gridItemAnimations[animIndex].fade,
                    transform: [{ scale: gridItemAnimations[animIndex].scale }],
                  }
                ]}
              >
                <View style={styles.gridImageContainer}>
                  <Image
                    source={item.image}
                    style={styles.gridMenuImage}
                    contentFit="cover"
                  />
                  {item.isPromo && (
                    <View style={styles.gridPromoBadge}>
                      <Text style={styles.gridPromoText}>{item.promoLabel}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.gridMenuContent}>
                  <Text style={styles.gridMenuName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.gridMenuDescription} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <View style={styles.gridPriceContainer}>
                    {item.isPromo ? (
                      <>
                        <Text style={styles.gridOriginalPrice}>{item.price}</Text>
                        <Text style={styles.gridPromoPrice}>{item.promoPrice}</Text>
                      </>
                    ) : (
                      <Text style={styles.gridPrice}>{item.price}</Text>
                    )}
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      );
    }
    
    return (
      <View style={styles.gridContainer}>
        {rows}
      </View>
    );
  };

  const renderMenuCards = () => {
    return menuItems.map((item, index) => {
      const inputRange = [
        (index - 1) * (cardWidth + cardMargin * 2),
        index * (cardWidth + cardMargin * 2),
        (index + 1) * (cardWidth + cardMargin * 2),
      ];

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
        extrapolate: 'clamp',
      });

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.7, 1, 0.7],
        extrapolate: 'clamp',
      });

      const translateY = scrollX.interpolate({
        inputRange,
        outputRange: [10, 0, 10],
        extrapolate: 'clamp',
      });

      const rotate = scrollX.interpolate({
        inputRange,
        outputRange: ['0deg', '0deg', '0deg'],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View
          key={item.id}
          style={[
            styles.menuCard,
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
          <View style={styles.imageContainer}>
            <Image
              source={item.image}
              style={styles.menuImage}
              contentFit="cover"
            />
            {item.isPromo && (
              <View style={styles.promoBadge}>
                <Text style={styles.promoText}>{item.promoLabel}</Text>
              </View>
            )}
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.priceContainer}>
              {item.isPromo ? (
                <>
                  <Text style={styles.originalPrice}>{item.price}</Text>
                  <Text style={styles.promoPrice}>{item.promoPrice}</Text>
                </>
              ) : (
                <Text style={styles.price}>{item.price}</Text>
              )}
            </View>
          </View>
        </Animated.View>
      );
    });
  };

  const renderPromoCards = () => {
    return text.menu.promos.map((promo, index) => {
      return (
        <Animated.View 
          key={promo.id} 
          style={[
            styles.promoCard,
            {
              opacity: promoCardAnimations[index].fade,
              transform: [{ scale: promoCardAnimations[index].scale }],
            }
          ]}
        >
          <LinearGradient
            colors={index % 2 === 0 ? [colors.primary, colors.primaryDark] : [colors.secondary, colors.secondaryDark]}
            style={styles.promoGradient}
          >
            <View style={styles.promoBadgeSmall}>
              <Text style={styles.promoBadgeText}>{promo.badge}</Text>
            </View>
            <Text style={styles.promoTitle}>{promo.title}</Text>
            <Text style={styles.promoPrice}>{promo.price}</Text>
          </LinearGradient>
        </Animated.View>
      );
    });
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{text.menu.title}</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>{text.menu.viewAll}</Text>
          <ChevronRight color={colors.primary} size={16} />
        </TouchableOpacity>
      </View>

      {isDesktop ? (
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          snapToInterval={cardWidth + cardMargin * 2}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          {renderMenuCards()}
        </Animated.ScrollView>
      ) : (
        renderMenuGrid()
      )}

      <View style={styles.promoContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoScrollContent}
        >
          {renderPromoCards()}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.backgroundAlt,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  scrollViewContent: {
    paddingVertical: 10,
    paddingHorizontal: Platform.OS === 'web' ? 20 : 0,
  },
  menuCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 280,
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  menuImage: {
    width: '100%',
    height: '100%',
  },
  promoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  promoText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuContent: {
    padding: 16,
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
    height: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  promoPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  promoContainer: {
    marginTop: 24,
  },
  promoScrollContent: {
    paddingVertical: 10,
  },
  promoCard: {
    width: 160,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promoGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  promoBadgeSmall: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  promoBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  // Grid styles for mobile view
  gridContainer: {
    marginVertical: 10,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridItem: {
    width: '32%',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gridImageContainer: {
    height: 80,
    position: 'relative',
  },
  gridMenuImage: {
    width: '100%',
    height: '100%',
  },
  gridPromoBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gridPromoText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  gridMenuContent: {
    padding: 8,
  },
  gridMenuName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 2,
  },
  gridMenuDescription: {
    fontSize: 10,
    color: colors.textLight,
    marginBottom: 4,
  },
  gridPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  gridPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  gridOriginalPrice: {
    fontSize: 10,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  gridPromoPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default MenuSection;