import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  MessageCircle 
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { text } from '@/constants/text';

const FooterSection = () => {
  const handleWhatsAppPress = () => {
    const phoneNumber = '6281234567890';
    const message = 'Halo, saya tertarik dengan layanan catering Anda.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
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

  const handlePhonePress = () => {
    Linking.openURL(`tel:${text.footer.phone}`);
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${text.footer.email}`);
  };

  const handleSocialPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.ctaSection}>
        <Text style={styles.ctaText}>{text.footer.cta}</Text>
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={handleWhatsAppPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <MessageCircle color={colors.white} size={20} />
            <Text style={styles.buttonText}>{text.footer.ctaButton}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.contactSection}>
        <View style={styles.contactItem}>
          <MapPin color={colors.primary} size={20} />
          <Text style={styles.contactText}>{text.footer.address}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={handlePhonePress}
        >
          <Phone color={colors.primary} size={20} />
          <Text style={styles.contactText}>{text.footer.phone}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={handleEmailPress}
        >
          <Mail color={colors.primary} size={20} />
          <Text style={styles.contactText}>{text.footer.email}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialSection}>
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => handleSocialPress('https://instagram.com')}
        >
          <Instagram color={colors.white} size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => handleSocialPress('https://facebook.com')}
        >
          <Facebook color={colors.white} size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={handleWhatsAppPress}
        >
          <MessageCircle color={colors.white} size={20} />
        </TouchableOpacity>
      </View>

      <Text style={styles.copyright}>{text.footer.copyright}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaButton: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
    maxWidth: 300,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.grayLight,
    marginVertical: 20,
  },
  contactSection: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 12,
  },
  socialSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 16,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyright: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default FooterSection;