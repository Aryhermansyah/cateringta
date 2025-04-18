import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform
} from 'react-native';
import { Link, usePathname } from 'expo-router';
import { 
  Home, 
  ShoppingBag, 
  UtensilsCrossed, 
  Calendar
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

// Data menu untuk bottom navigation
const navItems = [
  { id: 1, label: 'HOME', path: '/' as const, icon: Home },
  { id: 2, label: 'PESAN SEKARANG', path: '/delivery' as const, icon: ShoppingBag },
  { id: 3, label: 'CATERING', path: '/catering' as const, icon: UtensilsCrossed },
  { id: 4, label: 'LANGGANAN', path: '/subscription' as const, icon: Calendar },
];

const BottomNavBar = () => {
  const pathname = usePathname();

  // Fungsi untuk memeriksa apakah item menu aktif
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <Link href={item.path} key={item.id} asChild>
              <TouchableOpacity style={styles.navItem}>
                <Icon 
                  color={active ? colors.primary : colors.textLight} 
                  size={24} 
                  strokeWidth={active ? 2.5 : 2}
                />
                <Text 
                  style={[
                    styles.navText,
                    active && styles.navTextActive
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingBottom: Platform.OS === 'ios' ? 25 : 0,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    color: colors.textLight,
    fontWeight: '500',
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default BottomNavBar; 