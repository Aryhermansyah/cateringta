import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Pressable,
  Platform,
} from 'react-native';
import { Link, usePathname } from 'expo-router';
import {
  Home,
  ShoppingBag,
  UtensilsCrossed,
  Calendar,
  Menu as MenuIcon,
  X,
  Search,
  User,
  ChevronRight,
  Heart,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import Logo from '@/assets/images/logo/Logo';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NavMenuItem {
  id: number;
  label: string;
  path: string;
  icon: any;
}

const MENU_ITEMS: NavMenuItem[] = [
  { id: 1, label: 'Beranda', path: '/' as '/', icon: Home },
  { id: 2, label: 'Pesan Antar', path: '/delivery' as '/delivery', icon: ShoppingBag },
  { id: 3, label: 'Catering', path: '/catering' as '/catering', icon: UtensilsCrossed },
  { id: 4, label: 'Langganan', path: '/subscription' as '/subscription', icon: Calendar },
];

interface NavigationBarProps {
  isScrolled?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isScrolled = false }) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Animation values
  const navbarOpacity = useRef(new Animated.Value(0)).current;
  const navbarHeight = useRef(new Animated.Value(70)).current;
  
  // Calculate dynamic values
  const navbarBackground = isScrolled 
    ? colors.background 
    : 'transparent';
  
  const textColor = isScrolled 
    ? colors.textDark 
    : colors.white;
    
  const shadowStyle = isScrolled 
    ? {
        shadowColor: colors.shadowMedium,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
      } 
    : {};

  // Initial animation
  useEffect(() => {
    Animated.timing(navbarOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, []);

  // Handle scroll state changes
  useEffect(() => {
    Animated.timing(navbarHeight, {
      toValue: isScrolled ? 60 : 70,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isScrolled]);

  // Handle menu toggle
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname && pathname.startsWith(path)) return true;
    return false;
  };

  // Create dynamic indicator style based on active item
  const getIndicatorStyle = () => {
    let initialLeft = 0;
    
    // Find active index
    const activeIndex = MENU_ITEMS.findIndex(item => isActive(item.path));
    if (activeIndex === -1) return { left: -100 }; // Hide if none active
    
    const itemWidth = SCREEN_WIDTH / MENU_ITEMS.length;
    initialLeft = activeIndex * itemWidth + (itemWidth / 2) - 15;
    
    return {
      left: initialLeft,
    };
  };

  return (
    <>
      <StatusBar 
        barStyle={isScrolled ? 'dark-content' : 'light-content'} 
        backgroundColor="transparent" 
        translucent 
      />
      <Animated.View 
        style={[
          styles.navbar,
          shadowStyle,
          {
            backgroundColor: navbarBackground,
            opacity: navbarOpacity,
            height: navbarHeight,
          }
        ]}
      >
        <View style={styles.container}>
          <Link href="/" asChild>
            <TouchableOpacity>
              <Logo 
                size="small" 
                color={isScrolled ? colors.primary : colors.white}
                textColor={isScrolled ? colors.primary : colors.white}
              />
            </TouchableOpacity>
          </Link>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Search 
                color={textColor} 
                size={22} 
                strokeWidth={2} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Heart 
                color={textColor} 
                size={22} 
                strokeWidth={2} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuButton, menuOpen && styles.menuButtonActive]}
              onPress={toggleMenu}
            >
              {menuOpen ? (
                <X 
                  color={menuOpen ? colors.white : textColor} 
                  size={20} 
                  strokeWidth={2.5} 
                />
              ) : (
                <MenuIcon 
                  color={textColor} 
                  size={20} 
                  strokeWidth={2.5} 
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 250 }}
          style={styles.dropdownContainer}
        >
          <LinearGradient
            colors={[colors.background, colors.backgroundAlt]}
            style={styles.dropdownGradient}
          >
            <View style={styles.dropdownContent}>
              {/* Menu items */}
              {MENU_ITEMS.map((item, index) => {
                const active = isActive(item.path);
                
                return (
                  <Link href={item.path} key={item.id} asChild>
                    <MotiView
                      from={{ opacity: 0, translateX: -20 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{ 
                        type: 'timing', 
                        duration: 300, 
                        delay: 100 + (index * 50) 
                      }}
                    >
                      <Pressable
                        style={[
                          styles.menuItem,
                          active && styles.menuItemActive
                        ]}
                      >
                        <View style={[
                          styles.menuItemIcon,
                          active && styles.menuItemIconActive
                        ]}>
                          <item.icon 
                            size={22} 
                            color={active ? colors.white : colors.primary}
                            strokeWidth={2}
                          />
                        </View>
                        <Text style={[
                          styles.menuItemText,
                          active && styles.menuItemTextActive
                        ]}>
                          {item.label}
                        </Text>
                        {active && (
                          <ChevronRight 
                            size={18} 
                            color={colors.primary} 
                            strokeWidth={2.5}
                          />
                        )}
                      </Pressable>
                    </MotiView>
                  </Link>
                );
              })}
              
              {/* Account section */}
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', delay: 300 }}
                style={styles.accountSection}
              >
                <TouchableOpacity style={styles.loginButton}>
                  <User size={18} color={colors.white} strokeWidth={2.5} />
                  <Text style={styles.loginButtonText}>Masuk ke Akun</Text>
                </TouchableOpacity>
              </MotiView>
            </View>
          </LinearGradient>
        </MotiView>
      )}

      {/* Bottom Tab Bar for Mobile */}
      <View style={styles.bottomTabBar}>
        {MENU_ITEMS.map((item) => {
          const active = isActive(item.path);
          
          return (
            <Link href={item.path} key={item.id} asChild>
              <TouchableOpacity 
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                <View style={styles.tabIconContainer}>
                  {active && (
                    <MotiView
                      from={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'timing', duration: 300 }}
                      style={styles.tabActiveIndicator}
                    />
                  )}
                  <item.icon 
                    size={22} 
                    color={active ? colors.primary : colors.textLight}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </View>
                {active && (
                  <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <Text style={styles.tabLabel}>{item.label}</Text>
                  </MotiView>
                )}
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: Platform.OS === 'ios' ? 55 : 30,
    paddingBottom: 15,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 18,
  },
  menuButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 18,
    backgroundColor: 'transparent',
  },
  menuButtonActive: {
    backgroundColor: colors.primary,
  },
  dropdownContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 85,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    zIndex: 99,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  dropdownGradient: {
    width: '100%',
    height: '100%',
  },
  dropdownContent: {
    padding: 20,
    paddingBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemActive: {
    backgroundColor: colors.backgroundAlt,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemIconActive: {
    backgroundColor: colors.primary,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    flex: 1,
  },
  menuItemTextActive: {
    color: colors.primary,
  },
  accountSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: `${colors.gray}20`,
  },
  loginButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: colors.white,
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    paddingHorizontal: 10,
    flex: 1,
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabActiveIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
});

export default NavigationBar; 