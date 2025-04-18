import React, { useEffect, useRef } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Easing, 
  Linking, 
  Platform,
  View,
  Text
} from 'react-native';
import { MessageCircle, ShoppingBag } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cart-store';

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

const FloatingWhatsAppButton = ({ 
  phoneNumber = '6281234567890',
  message = 'Halo, saya tertarik dengan layanan catering Anda.'
}: FloatingWhatsAppButtonProps) => {
  const router = useRouter();
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation
    const pulseAnimation = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(
      Animated.sequence([
        Animated.delay(2000),
        pulseAnimation,
        Animated.delay(2000),
      ])
    ).start();
  }, []);

  const handleWhatsAppPress = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log("WhatsApp is not installed");
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };
  
  const handleCartPress = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    router.push('/delivery');
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: 0 }
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.whatsappButton]}
          onPress={handleWhatsAppPress}
          activeOpacity={0.8}
        >
          <MessageCircle color={colors.white} size={24} />
          {Platform.OS !== 'web' && (
            <Text style={styles.text}>Chat</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: -70 }
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.cartButton]}
          onPress={handleCartPress}
          activeOpacity={0.8}
        >
          <View style={styles.cartIconContainer}>
            <ShoppingBag color={colors.white} size={24} />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            )}
          </View>
          {Platform.OS !== 'web' && (
            <Text style={styles.text}>Pesan</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
  },
  buttonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  whatsappButton: {
    backgroundColor: '#25D366', // WhatsApp green
  },
  cartButton: {
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  cartIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.secondary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.textDark,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default FloatingWhatsAppButton;