import React, { useEffect } from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { onboardingImages } from '../../../constants/images';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
    const translateX = useSharedValue(0);

    useEffect(() => {
        translateX.value = withRepeat(
            withTiming(-width * (onboardingImages.length - 1), {
                duration: 3000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.sliderContainer}>
                <Animated.View style={[styles.slider, animatedStyle]}>
                    {onboardingImages.map((image, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image source={image} style={styles.image} resizeMode="contain" />
                        </View>
                    ))}
                </Animated.View>
            </View>
            <Text style={styles.title}>Access Control</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sliderContainer: {
        height: 200,
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
        width: width * 0.8,
        height: '80%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#333',
    },
});

export default SplashScreen;
