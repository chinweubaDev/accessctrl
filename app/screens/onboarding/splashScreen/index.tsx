import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import images from '../../../constants/images';

// Get the window width for responsive design
const { width } = Dimensions.get('window');

// Define navigation type for this screen
type SplashScreenNavigationProp = StackNavigationProp<any, 'Splash'>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace('login');
//     },6000);

//     return () => clearTimeout(timer);
//   }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sliderContainer}>
        <Image source={images.splash} style={styles.image} resizeMode="cover" />
      </View>

      <Text style={styles.title}>Redefining Security Systems</Text>
      <Text style={styles.subTitle}>
        All in one security solution, Get Pass Code, Pay Estate Dues, Buy Electricity, Buy airtime, Buy Data and more
      </Text>
      
      <View style={styles.bottomBox}>
        <View style={styles.boxRow}> 
          <View style={styles.bottomBoxItem}>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Get Started</Text>
            </Pressable> 
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    height: 400,
    overflow: 'hidden',
  },
  slider: {
    flexDirection: 'row',
    height: '100%',
  },
  imageContainer: {
    width: width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#fff',
  },
  subTitle: {
    fontSize: 14,
    paddingHorizontal: 20,
    alignContent: 'center',
    fontWeight: 'normal',
    marginTop: 20,
    color: '#fff',
    textAlign: 'center',
  },
  bottomBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxRow: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBoxItem: {
    borderRadius: 10,
    height: 50,
    padding: 15,
    marginTop: 20,
    backgroundColor: '#04a3a3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
