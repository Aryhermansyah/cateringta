import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Animated,
  useWindowDimensions,
  Platform,
  TouchableOpacity
} from 'react-native';
import { 
  Briefcase, 
  GraduationCap, 
  Users, 
  Landmark, 
  Baby, 
  Heart, 
  Utensils, 
  MoreHorizontal 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { text } from '@/constants/text';

const ServicesSection = () => {
  const { width } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  const getIconForService = (iconName: string) => {
    const iconProps = { 
      size: 24, 
      color: colors.primary,
      strokeWidth: 2
    };

    switch (iconName) {
      case 'Briefcase':
        return <Briefcase {...iconProps} />;
      case 'GraduationCap':
        return <GraduationCap {...iconProps} />;
      case 'Users':
        return <Users {...iconProps} />;
      case 'Landmark':
        return <Landmark {...iconProps} />;
      case 'Baby':
        return <Baby {...iconProps} />;
      case 'Heart':
        return <Heart {...iconProps} />;
      case 'Utensils':
        return <Utensils {...iconProps} />;
      case 'MoreHorizontal':
        return <MoreHorizontal {...iconProps} />;
      default:
        return <Utensils {...iconProps} />;
    }
  };

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

  const renderServiceItems = () => {
    const itemsPerRow = width > 768 ? 4 : 3;
    const rows = [];
    
    for (let i = 0; i < text.services.items.length; i += itemsPerRow) {
      const rowItems = text.services.items.slice(i, i + itemsPerRow);
      rows.push(
        <View key={i} style={styles.row}>
          {rowItems.map((item, index) => {
            const delay = (i + index) * 100;
            const itemFadeAnim = useRef(new Animated.Value(0)).current;
            const itemTranslateYAnim = useRef(new Animated.Value(20)).current;
            const itemScaleAnim = useRef(new Animated.Value(0.9)).current;

            useEffect(() => {
              Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                  Animated.timing(itemFadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                  }),
                  Animated.timing(itemTranslateYAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                  }),
                  Animated.spring(itemScaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                  }),
                ]),
              ]).start();
            }, []);

            return (
              <TouchableOpacity 
                key={item.id} 
                activeOpacity={0.8}
              >
                <Animated.View 
                  style={[
                    styles.serviceItem,
                    {
                      opacity: itemFadeAnim,
                      transform: [
                        { translateY: itemTranslateYAnim },
                        { scale: itemScaleAnim }
                      ],
                      width: `${100 / itemsPerRow}%`,
                    }
                  ]}
                >
                  <Animated.View 
                    style={[
                      styles.iconContainer,
                      {
                        transform: [
                          { scale: itemScaleAnim }
                        ]
                      }
                    ]}
                  >
                    {getIconForService(item.icon)}
                  </Animated.View>
                  <Text style={styles.serviceName}>{item.name}</Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

    return rows;
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
      <Text style={styles.title}>{text.services.title}</Text>
      <View style={styles.servicesGrid}>
        {renderServiceItems()}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  servicesGrid: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  serviceItem: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceName: {
    fontSize: 14,
    color: colors.textDark,
    textAlign: 'center',
  },
});

export default ServicesSection;