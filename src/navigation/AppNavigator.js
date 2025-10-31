import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { storage } from '../utils/storage';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import GameDetailsScreen from '../screens/GameDetailsScreen';
import NewsScreen from '../screens/NewsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.dark.accent,
                tabBarInactiveTintColor: colors.dark.secondaryText,
                tabBarStyle: {
                    backgroundColor: colors.dark.tertiaryBackground,
                    borderTopWidth: 0,
                    paddingBottom: insets.bottom + 10,
                    paddingTop: 12,
                    height: insets.bottom + 70,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    position: 'absolute',
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '700',
                    marginTop: 4,
                },
                tabBarIconStyle: {
                    marginTop: 0,
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Explore',
                    tabBarIcon: ({ focused, color }) => (
                        <View style={styles.iconContainer}>
                            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                                <Text style={styles.iconText}>🎮</Text>
                            </View>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="NewsTab"
                component={NewsScreen}
                options={{
                    tabBarLabel: 'News',
                    tabBarIcon: ({ focused, color }) => (
                        <View style={styles.iconContainer}>
                            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                                <Text style={styles.iconText}>📰</Text>
                            </View>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="FavoritesTab"
                component={FavoritesScreen}
                options={{
                    tabBarLabel: 'My Games',
                    tabBarIcon: ({ focused, color }) => (
                        <View style={styles.iconContainer}>
                            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                                <Text style={styles.iconText}>⭐</Text>
                            </View>
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
    },
    iconWrapperActive: {
        backgroundColor: colors.dark.accent,
        opacity: 1,
        shadowColor: colors.dark.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
    },
    iconText: {
        fontSize: 22,
    },
});

function AppNavigator() {
    const [isReady, setIsReady] = useState(false);
    const [hasOnboarded, setHasOnboarded] = useState(false);

    useEffect(() => {
        checkOnboardingStatus();
    }, []);

    const checkOnboardingStatus = async () => {
        try {
            const onboarded = await storage.hasOnboarded();
            setHasOnboarded(onboarded);
            setIsReady(true);
        } catch (error) {
            console.error('Error checking onboarding status:', error);
            setHasOnboarded(false);
            setIsReady(true);
        }
    };

    if (!isReady) {
        return null;
    }

    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                {!hasOnboarded ? (
                    <Stack.Screen name="Onboarding">
                        {(props) => (
                            <OnboardingScreen
                                {...props}
                                onComplete={() => setHasOnboarded(true)}
                            />
                        )}
                    </Stack.Screen>
                ) : null}
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen
                    name="GameDetails"
                    component={GameDetailsScreen}
                    options={{
                        presentation: 'modal',
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: colors.dark.secondaryBackground,
                        },
                        headerTintColor: colors.dark.primaryText,
                        headerTitle: '',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;
