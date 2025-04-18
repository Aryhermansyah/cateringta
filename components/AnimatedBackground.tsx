import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, useWindowDimensions, Platform } from 'react-native';
import { colors } from '@/constants/colors';

const FOOD_ICONS = ['🍚', '🍗', '🍖', '🍲', '🥗', '🌶️', '🥘', '🍜', '🍛', '🍱', '🍳', '🥪'];
const ICON_SIZE = 24;
const NUM_ICONS = Platform.OS === 'web' ? 8 : 15;

interface AnimatedIconProps {
  icon: string;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
}

const AnimatedIcon = ({ icon, startX, startY, duration, delay }: AnimatedIconProps) => {
  const position = new Animated.ValueXY({ x: startX, y: startY });
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.5);
  const rotation = new Animated.Value(0);

  useEffect(() => {
    const targetY = startY - 150 - Math.random() * 150;
    const targetX = startX + (Math.random() * 150 - 75);

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1 + Math.random() * 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: Math.random() > 0.5 ? 1 : -1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(position, {
          toValue: { x: targetX, y: targetY },
          duration: duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Reset and restart animation
      position.setValue({ x: startX, y: startY });
      opacity.setValue(0);
      scale.setValue(0.5);
      rotation.setValue(0);
      startAnimation();
    });
  }, []);

  const startAnimation = () => {
    const targetY = startY - 150 - Math.random() * 150;
    const targetX = startX + (Math.random() * 150 - 75);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1 + Math.random() * 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: Math.random() > 0.5 ? 1 : -1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(position, {
          toValue: { x: targetX, y: targetY },
          duration: duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Reset and restart animation
      position.setValue({ x: startX, y: startY });
      opacity.setValue(0);
      scale.setValue(0.5);
      rotation.setValue(0);
      startAnimation();
    });
  };

  const spin = rotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-30deg', '30deg']
  });

  return (
    <Animated.Text
      style={[
        styles.icon,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { scale: scale },
            { rotate: spin }
          ],
          opacity: opacity,
        },
      ]}
    >
      {icon}
    </Animated.Text>
  );
};

const AnimatedBackground = () => {
  const { width, height } = useWindowDimensions();
  const icons = [];

  // Only render on native platforms or if explicitly enabled for web
  if (Platform.OS !== 'web') {
    for (let i = 0; i < NUM_ICONS; i++) {
      const icon = FOOD_ICONS[Math.floor(Math.random() * FOOD_ICONS.length)];
      const startX = Math.random() * width;
      const startY = height + Math.random() * 100;
      const duration = 5000 + Math.random() * 5000;
      const delay = Math.random() * 5000;

      icons.push(
        <AnimatedIcon
          key={i}
          icon={icon}
          startX={startX}
          startY={startY}
          duration={duration}
          delay={delay}
        />
      );
    }
  }

  return <View style={styles.container}>{icons}</View>;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: -1,
  },
  icon: {
    position: 'absolute',
    fontSize: ICON_SIZE,
  },
});

export default AnimatedBackground;