import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Platform,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  Home, 
  UtensilsCrossed, 
  Calendar,
  Bell,
  Search,
} from 'lucide-react-native';
import { Link } from 'expo-router';
import { colors } from '@/constants/colors';
import { text } from '@/constants/text';
import Logo from '@/assets/images/logo/Logo';
import { BlurView } from 'expo-blur';

interface HeaderProps {
  isScrolled: boolean;
  showMenu: boolean;
  toggleMenu: () => void;
}

// Data menu untuk header
const menuItems = [
  { id: 1, label: 'Beranda', path: '/' as const, icon: Home },
  { id: 2, label: 'Pesan Antar', path: '/delivery' as const, icon: ShoppingBag },
  { id: 3, label: 'Catering', path: '/catering' as const, icon: UtensilsCrossed },
  { id: 4, label: 'Langganan', path: '/subscription' as const, icon: Calendar },
];

const Header = ({ isScrolled, showMenu, toggleMenu }: HeaderProps) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  
  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-50)).current;
  const menuScaleAnim = useRef(new Animated.Value(0.8)).current;
  const menuOpacityAnim = useRef(new Animated.Value(0)).current;
  
  // Array untuk animasi menu items individual
  const menuItemAnims = useRef(
    menuItems.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    })).concat([{  // Tambahkan satu item lagi untuk tombol login
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }])
  ).current;

  useEffect(() => {
    // Animasi header saat mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  useEffect(() => {
    // Animasi saat toggle menu
    if (showMenu) {
      // Animate menu container
      Animated.parallel([
        Animated.spring(menuScaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
        }),
        Animated.timing(menuOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Animate menu items sequentially
      menuItemAnims.forEach((anim, index) => {
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.spring(anim.translateY, {
              toValue: 0,
              useNativeDriver: true,
              friction: 8,
            }),
          ]),
        ]).start();
      });
    } else {
      // Reset animations when menu closes
      Animated.parallel([
        Animated.timing(menuScaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(menuOpacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Reset menu item animations
      menuItemAnims.forEach((anim) => {
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: 20,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  }, [showMenu]);

  // Fungsi untuk menghasilkan ikon
  const renderIcon = (icon: any, color: string, size: number) => {
    const Icon = icon;
    return <Icon color={color} size={size} strokeWidth={2.5} />;
  };

  // Fungsi untuk render menu desktop
  const renderDesktopMenu = () => (
    <View style={styles.navContainer}>
      {menuItems.map((item) => (
        <Link href={item.path} key={item.id} asChild>
          <TouchableOpacity style={styles.navItem}>
            {renderIcon(
              item.icon, 
              isScrolled ? colors.primary : colors.white, 
              18
            )}
            <Text 
              style={[
                styles.navText, 
                { color: isScrolled ? colors.textDark : colors.white }
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        </Link>
      ))}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Masuk</Text>
      </TouchableOpacity>
    </View>
  );

  // Fungsi untuk render menu mobile
  const renderMobileMenu = () => (
    <Animated.View 
      style={[
        styles.mobileMenuWrapper,
        {
          opacity: menuOpacityAnim,
          transform: [{ scale: menuScaleAnim }],
        },
      ]}
    >
      <BlurView intensity={20} style={styles.blurBackground} tint="dark" />
      <View style={styles.mobileMenu}>
        {menuItems.map((item, index) => (
          <Link href={item.path} key={item.id} asChild>
            <Animated.View
              style={{
                opacity: menuItemAnims[index].opacity,
                transform: [{ translateY: menuItemAnims[index].translateY }],
              }}
            >
              <TouchableOpacity style={styles.mobileMenuItem}>
                <View style={styles.mobileMenuIconContainer}>
                  {renderIcon(item.icon, colors.primary, 24)}
                </View>
                <Text style={styles.mobileMenuText}>{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          </Link>
        ))}
        <Animated.View
          style={{
            opacity: menuItemAnims[menuItems.length].opacity,
            transform: [{ translateY: menuItemAnims[menuItems.length].translateY }],
            width: '100%',
            marginTop: 20,
          }}
        >
          <TouchableOpacity style={styles.mobileLoginButton}>
            <Text style={styles.mobileLoginButtonText}>Masuk</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );

  // Main header background style based on scroll position
  const headerBackgroundStyle = isScrolled 
    ? styles.headerScrolled 
    : styles.headerTransparent;

  return (
    <>
      <StatusBar 
        barStyle={isScrolled ? "dark-content" : "light-content"} 
        backgroundColor="transparent" 
        translucent 
      />
      <Animated.View 
        style={[
          styles.container,
          headerBackgroundStyle,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          }
        ]}
      >
        {isScrolled && <View style={styles.headerBlur} />}
        
        <View style={styles.content}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.logoContainer}>
              <Logo 
                size="small"
                color={isScrolled ? colors.primary : colors.white} 
                textColor={isScrolled ? colors.primary : colors.white} 
              />
            </TouchableOpacity>
          </Link>

          {isDesktop ? renderDesktopMenu() : (
            <View style={styles.mobileActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Search 
                  color={isScrolled ? colors.textDark : colors.white} 
                  size={22} 
                  strokeWidth={2.5} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButton}>
                <Bell 
                  color={isScrolled ? colors.textDark : colors.white} 
                  size={22} 
                  strokeWidth={2.5} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={toggleMenu} 
                style={[
                  styles.menuButton,
                  showMenu && styles.menuButtonActive
                ]}
              >
                {showMenu ? (
                  <X 
                    color={showMenu ? colors.white : isScrolled ? colors.textDark : colors.white} 
                    size={20} 
                    strokeWidth={2.5} 
                  />
                ) : (
                  <Menu 
                    color={isScrolled ? colors.textDark : colors.white} 
                    size={20} 
                    strokeWidth={2.5} 
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!isDesktop && showMenu && renderMobileMenu()}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: Platform.OS === 'ios' ? 55 : 25,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTransparent: {
    backgroundColor: 'transparent',
  },
  headerScrolled: {
    backgroundColor: colors.background,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  headerBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  mobileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 20,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: colors.transparent,
  },
  menuButtonActive: {
    backgroundColor: colors.primary,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  navItem: {
    marginLeft: 32,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 8,
  },
  navText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  mobileMenuWrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 90,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    zIndex: 100,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  mobileMenu: {
    padding: 20,
  },
  mobileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 4,
  },
  mobileMenuIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mobileMenuText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    letterSpacing: 0.3,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginLeft: 32,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  mobileLoginButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  mobileLoginButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

export default Header;