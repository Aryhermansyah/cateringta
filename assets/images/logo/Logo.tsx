import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { UtensilsCrossed } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  color?: string;
  textColor?: string;
  animated?: boolean;
}

export default function Logo({
  size = 'medium',
  showText = true,
  color = colors.primary,
  textColor = colors.primary,
  animated = true,
}: LogoProps) {
  // Animated values
  const iconRotate = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.9)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(10)).current;

  // Size mapping
  const sizeMap = {
    small: {
      container: 32,
      icon: 18,
      fontSize: 16,
    },
    medium: {
      container: 44,
      icon: 26,
      fontSize: 20,
    },
    large: {
      container: 60,
      icon: 36,
      fontSize: 28,
    },
  };

  const selectedSize = sizeMap[size];

  // Start animations on mount
  useEffect(() => {
    if (animated) {
      // Icon animation
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.15,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Small rotation on mount for subtle effect
      Animated.sequence([
        Animated.timing(iconRotate, {
          toValue: 0.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotate, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Text fade in
      if (showText) {
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 400,
            delay: 100,
            useNativeDriver: true,
          }),
          Animated.timing(textTranslate, {
            toValue: 0,
            duration: 400,
            delay: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [animated, showText]);

  // Map rotation value to degrees
  const rotation = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            width: selectedSize.container,
            height: selectedSize.container,
            borderRadius: selectedSize.container / 2,
            backgroundColor: `${color}15`,
            transform: [
              { scale: iconScale },
              { rotate: rotation },
            ],
          },
        ]}
      >
        <View style={[styles.iconInner, { backgroundColor: `${color}25` }]}>
          <UtensilsCrossed 
            color={color} 
            size={selectedSize.icon}
            strokeWidth={2.5}
          />
        </View>
      </Animated.View>

      {showText && (
        <Animated.Text
          style={[
            styles.logoText,
            {
              fontSize: selectedSize.fontSize,
              color: textColor,
              marginLeft: size === 'small' ? 8 : 10,
              opacity: textOpacity,
              transform: [{ translateX: textTranslate }],
            },
          ]}
        >
          <Text style={styles.logoTextBold}>Rasa</Text>Nusantara
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconInner: {
    width: '70%',
    height: '70%',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: '500',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  logoTextBold: {
    fontWeight: '700',
  }
}); 