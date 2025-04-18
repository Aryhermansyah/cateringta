import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Platform,
  Animated,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

// Components
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SubscriptionSection from '@/components/SubscriptionSection';
import MenuSection from '@/components/MenuSection';
import ServicesSection from '@/components/ServicesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FooterSection from '@/components/FooterSection';
import AnimatedBackground from '@/components/AnimatedBackground';
import BottomNavBar from '@/components/BottomNavBar';

export default function HomeScreen() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Refs untuk komponen yg memerlukan animasi scroll-triggered
  const subscriptionSectionRef = useRef(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > 50);
        
        // Kirim current scroll position ke komponen yang membutuhkan
        if (subscriptionSectionRef.current) {
          subscriptionSectionRef.current.handlePageScroll?.(offsetY);
        }
      }
    }
  );

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent 
      />
      
      <Header 
        isScrolled={isScrolled} 
        showMenu={showMenu} 
        toggleMenu={toggleMenu} 
      />
      
      <AnimatedBackground />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <HeroSection />
        <SubscriptionSection ref={subscriptionSectionRef} />
        <MenuSection />
        <ServicesSection />
        <TestimonialsSection />
        <FooterSection />
      </ScrollView>
      
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
});