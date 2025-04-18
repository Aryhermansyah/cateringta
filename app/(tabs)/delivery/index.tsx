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
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  Filter, 
  Clock, 
  Star, 
  ChevronDown, 
  MapPin, 
  ShoppingBag,
  Plus,
  Minus
} from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { menuItems } from '@/mocks/menu';
import { useCartStore } from '@/store/cart-store';

// Define categories for food filtering
const categories = [
  { id: 'all', name: 'Semua' },
  { id: 'promo', name: 'Promo' },
  { id: 'popular', name: 'Populer' },
  { id: 'rice', name: 'Nasi Kotak' },
  { id: 'snack', name: 'Snack' },
  { id: 'beverage', name: 'Minuman' },
];

export default function DeliveryScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(menuItems);
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
  // Cart state
  const { items, addItem, getTotalItems, getTotalPrice } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Animation for cart button
  const cartButtonScale = useRef(new Animated.Value(1)).current;
  
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

  // Cart button animation when items change
  useEffect(() => {
    if (totalItems > 0) {
      Animated.sequence([
        Animated.timing(cartButtonScale, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(cartButtonScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [totalItems]);

  // Filter menu items based on category and search
  useEffect(() => {
    let filtered = [...menuItems];
    
    // Apply category filter
    if (selectedCategory === 'promo') {
      filtered = filtered.filter(item => item.isPromo);
    } else if (selectedCategory !== 'all') {
      // In a real app, you would have category IDs in your menu items
      // This is just a placeholder logic
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const navigateToCart = () => {
    router.push('/delivery/cart');
  };

  const renderCategoryTabs = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabsContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === category.id && styles.categoryTabTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderMenuItem = (item: typeof menuItems[0], index: number) => {
    // Create staggered animation for each menu item
    const itemFadeAnim = useRef(new Animated.Value(0)).current;
    const itemTranslateYAnim = useRef(new Animated.Value(20)).current;
    
    useEffect(() => {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.parallel([
          Animated.timing(itemFadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(itemTranslateYAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, []);

    // Check if item is in cart
    const cartItem = items.find(cartItem => cartItem.menuItemId === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.menuItem,
          {
            opacity: itemFadeAnim,
            transform: [{ translateY: itemTranslateYAnim }],
          },
        ]}
      >
        <View style={styles.menuItemImageContainer}>
          <Image
            source={item.image}
            style={styles.menuItemImage}
            contentFit="cover"
          />
          {item.isPromo && (
            <View style={styles.promoBadge}>
              <Text style={styles.promoText}>{item.promoLabel || '🔥 PROMO'}</Text>
            </View>
          )}
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.menuItemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.menuItemFooter}>
            <View>
              {item.isPromo ? (
                <View style={styles.priceContainer}>
                  <Text style={styles.originalPrice}>{item.price}</Text>
                  <Text style={styles.promoPrice}>{item.promoPrice}</Text>
                </View>
              ) : (
                <Text style={styles.price}>{item.price}</Text>
              )}
            </View>
            
            {quantity > 0 ? (
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => addItem(item.id, -1)}
                >
                  <Minus size={16} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => addItem(item.id, 1)}
                >
                  <Plus size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addItem(item.id)}
                activeOpacity={0.7}
              >
                <Plus size={16} color={colors.white} />
                <Text style={styles.addButtonText}>Tambah</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
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
        <Text style={styles.headerTitle}>Pesan Antar</Text>
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
          <Text style={styles.heroTitle}>Pesan Antar Catering</Text>
          
          <View style={styles.locationBar}>
            <View style={styles.locationInfo}>
              <MapPin size={16} color={colors.primary} />
              <Text style={styles.locationText} numberOfLines={1}>
                Jl. Pahlawan No. 123, Tulungagung
              </Text>
              <ChevronDown size={16} color={colors.textLight} />
            </View>
            <View style={styles.deliveryInfo}>
              <Clock size={14} color={colors.textLight} />
              <Text style={styles.deliveryText}>30-45 min</Text>
            </View>
          </View>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={colors.textLight} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari menu..."
                placeholderTextColor={colors.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        {renderCategoryTabs()}
        
        <View style={styles.menuList}>
          {filteredItems.map((item, index) => renderMenuItem(item, index))}
        </View>
      </ScrollView>
      
      {totalItems > 0 && (
        <Animated.View
          style={[
            styles.cartButton,
            {
              transform: [{ scale: cartButtonScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.cartButtonTouchable}
            onPress={navigateToCart}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.cartButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.cartInfo}>
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalItems}</Text>
                </View>
                <ShoppingBag size={20} color={colors.white} />
              </View>
              <Text style={styles.cartText}>Lihat Keranjang</Text>
              <Text style={styles.cartPrice}>
                {totalPrice.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
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
    paddingBottom: 140,
  },
  heroSection: {
    padding: 20,
    paddingTop: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  locationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: colors.textDark,
    marginHorizontal: 4,
    flex: 1,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveryText: {
    fontSize: 12,
    color: colors.textDark,
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 8,
    height: '100%',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.grayLight,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  categoryTabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
  },
  categoryTabText: {
    fontSize: 14,
    color: colors.textDark,
  },
  categoryTabTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  menuList: {
    paddingHorizontal: 20,
  },
  menuItem: {
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
  menuItemImageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  menuItemImage: {
    width: '100%',
    height: '100%',
  },
  promoBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promoText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuItemContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 8,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textLight,
    textDecorationLine: 'line-through',
  },
  promoPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
  cartButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  cartButtonTouchable: {
    width: '100%',
  },
  cartButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cartText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartPrice: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});