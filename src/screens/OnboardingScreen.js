import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
    StatusBar,
} from 'react-native';
import { colors } from '../constants/colors';
import { storage } from '../utils/storage';

const { width, height } = Dimensions.get('window');

const onboardingData = [
    {
        id: 1,
        title: 'Discover Epic Games',
        description: 'Explore thousands of amazing games from the best developers worldwide',
        icon: '🎮',
    },
    {
        id: 2,
        title: 'Stay Updated',
        description: 'Get the latest gaming news and trending releases',
        icon: '📰',
    },
    {
        id: 3,
        title: 'Build Your Collection',
        description: 'Save your favorite games and create your ultimate gaming library',
        icon: '⭐',
    },
];

const OnboardingScreen = ({ navigation, onComplete }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const currentIndex = useRef(0);

    const handleNext = () => {
        if (currentIndex.current < onboardingData.length - 1) {
            currentIndex.current += 1;
            scrollViewRef.current?.scrollTo({
                x: currentIndex.current * width,
                animated: true,
            });
        }
    };

    const handleSkip = async () => {
        if (onComplete) {
            onComplete();
        }
        await storage.setHasOnboarded();
        navigation.replace('MainTabs');
    };

    const scrollViewRef = useRef(null);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <Animated.ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            >
                {onboardingData.map((item, index) => (
                    <View key={item.id} style={styles.slide}>
                        <Animated.View
                            style={[
                                styles.iconContainer,
                                {
                                    opacity: scrollX.interpolate({
                                        inputRange: [
                                            (index - 1) * width,
                                            index * width,
                                            (index + 1) * width,
                                        ],
                                        outputRange: [0, 1, 0],
                                    }),
                                    transform: [
                                        {
                                            scale: scrollX.interpolate({
                                                inputRange: [
                                                    (index - 1) * width,
                                                    index * width,
                                                    (index + 1) * width,
                                                ],
                                                outputRange: [0.5, 1, 0.5],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <Text style={styles.icon}>{item.icon}</Text>
                        </Animated.View>

                        <Animated.View
                            style={[
                                styles.textContainer,
                                {
                                    opacity: scrollX.interpolate({
                                        inputRange: [
                                            (index - 1) * width,
                                            index * width,
                                            (index + 1) * width,
                                        ],
                                        outputRange: [0, 1, 0],
                                    }),
                                },
                            ]}
                        >
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </Animated.View>
                    </View>
                ))}
            </Animated.ScrollView>

            <View style={styles.indicatorContainer}>
                {onboardingData.map((_, index) => {
                    const inputRange = [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                    ];

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 20, 8],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[styles.dot, { width: dotWidth, opacity }]}
                        />
                    );
                })}
            </View>

            <View style={styles.buttonContainer}>
                {currentIndex.current !== onboardingData.length - 1 ? (
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                            <Text style={styles.nextText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={handleSkip} style={styles.getStartedButton}>
                        <Text style={styles.getStartedText}>Get Started</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
    },
    slide: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: colors.dark.secondaryBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
    },
    icon: {
        fontSize: 80,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.dark.primaryText,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 18,
        color: colors.dark.secondaryText,
        textAlign: 'center',
        lineHeight: 28,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 120,
        left: 0,
        right: 0,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.dark.accent,
        marginHorizontal: 4,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        paddingHorizontal: 40,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skipButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    skipText: {
        color: colors.dark.secondaryText,
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: colors.dark.accent,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 12,
    },
    nextText: {
        color: colors.dark.primaryText,
        fontSize: 16,
        fontWeight: 'bold',
    },
    getStartedButton: {
        backgroundColor: colors.dark.accent,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    getStartedText: {
        color: colors.dark.primaryText,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;

