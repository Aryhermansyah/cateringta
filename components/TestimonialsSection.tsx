import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  Easing
} from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { text } from '@/constants/text';

const TestimonialsSection = () => {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const testimonialAnim = useRef(new Animated.Value(1)).current;
  const testimonialTranslateX = useRef(new Animated.Value(0)).current;
  const testimonialScale = useRef(new Animated.Value(1)).current;

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

    // Auto-scroll testimonials
    const interval = setInterval(() => {
      changeTestimonial((currentIndex + 1) % text.testimonials.items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const changeTestimonial = (newIndex: number) => {
    // Exit animation
    Animated.parallel([
      Animated.timing(testimonialAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(testimonialTranslateX, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(testimonialScale, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start(() => {
      setCurrentIndex(newIndex);
      
      // Reset animation values
      testimonialTranslateX.setValue(50);
      testimonialScale.setValue(0.9);
      
      // Enter animation
      Animated.parallel([
        Animated.timing(testimonialAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(testimonialTranslateX, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(testimonialScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const starAnim = useRef(new Animated.Value(0)).current;
      
      useEffect(() => {
        Animated.sequence([
          Animated.delay(i * 100 + 300),
          Animated.spring(starAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start();
      }, [currentIndex]);
      
      stars.push(
        <Animated.View
          key={i}
          style={{
            transform: [
              { scale: starAnim },
              { 
                rotate: starAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-30deg', '0deg'],
                }) 
              }
            ],
            opacity: starAnim,
          }}
        >
          <Star
            size={16}
            color={i < rating ? colors.secondary : colors.gray}
            fill={i < rating ? colors.secondary : 'none'}
          />
        </Animated.View>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const currentTestimonial = text.testimonials.items[currentIndex];

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
      <Text style={styles.title}>{text.testimonials.title}</Text>

      <Animated.View 
        style={[
          styles.testimonialCard,
          {
            opacity: testimonialAnim,
            transform: [
              { translateX: testimonialTranslateX },
              { scale: testimonialScale }
            ],
          }
        ]}
      >
        <Text style={styles.testimonialText}>"{currentTestimonial.text}"</Text>
        {renderStars(currentTestimonial.rating)}
        <View style={styles.testimonialAuthor}>
          <Text style={styles.authorName}>{currentTestimonial.name}</Text>
          <Text style={styles.authorRole}>{currentTestimonial.role}</Text>
        </View>
      </Animated.View>

      <View style={styles.dotsContainer}>
        {text.testimonials.items.map((_, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => changeTestimonial(index)}
            activeOpacity={0.7}
          >
            <Animated.View 
              style={[
                styles.dot, 
                index === currentIndex && styles.activeDot,
                index === currentIndex && {
                  transform: [
                    { 
                      scale: testimonialAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }) 
                    }
                  ]
                }
              ]} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.backgroundAlt,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  testimonialCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  testimonialText: {
    fontSize: 16,
    color: colors.textDark,
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 4,
  },
  testimonialAuthor: {
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingTop: 16,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  authorRole: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 16,
  },
});

export default TestimonialsSection;