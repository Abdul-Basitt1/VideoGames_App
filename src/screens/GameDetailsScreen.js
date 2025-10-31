import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    FlatList,
    Animated,
} from 'react-native';
import { gamesAPI } from '../services/api';
import { colors } from '../constants/colors';
import { storage } from '../utils/storage';

const { width } = Dimensions.get('window');

const GameDetailsScreen = ({ route, navigation }) => {
    const { gameId } = route.params;
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadGameDetails();
        checkFavorite();
    }, []);

    const loadGameDetails = async () => {
        try {
            const data = await gamesAPI.getGameDetails(gameId);
            setGame(data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading game details:', error);
            setLoading(false);
        }
    };

    const checkFavorite = async () => {
        const favorite = await storage.isFavorite(gameId);
        setIsFavorite(favorite);
    };

    const toggleFavorite = async () => {
        if (isFavorite) {
            await storage.removeFavorite(gameId);
            setIsFavorite(false);
        } else {
            await storage.addFavorite(gameId);
            setIsFavorite(true);
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderCarouselItem = ({ item, index }) => {
        const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.carouselItemContainer, { transform: [{ scale }] }]}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.carouselImage}
                    resizeMode="cover"
                />
            </Animated.View>
        );
    };

    const renderPaginationDots = () => {
        if (!game || !game.short_screenshots || game.short_screenshots.length <= 1) {
            return null;
        }

        return (
            <View style={styles.paginationContainer}>
                {game.short_screenshots.map((_, index) => {
                    const inputRange = [
                        (index - 1) * width,
                        index * width,
                        (index + 1) * width,
                    ];

                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 24, 8],
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
                            style={[
                                styles.paginationDot,
                                {
                                    width: dotWidth,
                                    opacity,
                                },
                            ]}
                        />
                    );
                })}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.dark.accent} />
            </View>
        );
    }

    if (!game) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Game not found</Text>
            </View>
        );
    }

    const screenshots = game.short_screenshots || [{ image: game.background_image }];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.carouselContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={screenshots}
                        renderItem={renderCarouselItem}
                        keyExtractor={(item, index) => `screenshot-${index}`}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width}
                        decelerationRate="fast"
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                    />
                    {renderPaginationDots()}
                </View>

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{game.name}</Text>
                        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
                        </TouchableOpacity>
                    </View>

                    {game.rating && (
                        <View style={styles.ratingContainer}>
                            <Text style={styles.rating}>⭐ {game.rating.toFixed(1)}</Text>
                            {game.ratings_count && (
                                <Text style={styles.ratingCount}>
                                    ({game.ratings_count.toLocaleString()} ratings)
                                </Text>
                            )}
                        </View>
                    )}

                    {game.description_raw && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About</Text>
                            <Text style={styles.description}>{game.description_raw}</Text>
                        </View>
                    )}

                    {game.genres && game.genres.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Genres</Text>
                            <View style={styles.chipContainer}>
                                {game.genres.map((genre) => (
                                    <View key={genre.id} style={styles.chip}>
                                        <Text style={styles.chipText}>{genre.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {game.platforms && game.platforms.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Platforms</Text>
                            <View style={styles.chipContainer}>
                                {game.platforms.map((platform) => (
                                    <View key={platform.platform.id} style={[styles.chip, styles.platformChip]}>
                                        <Text style={styles.chipText}>{platform.platform.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {game.released && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Release Date</Text>
                            <Text style={styles.releaseDate}>{game.released}</Text>
                        </View>
                    )}

                    {game.developers && game.developers.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Developers</Text>
                            <View style={styles.chipContainer}>
                                {game.developers.map((developer) => (
                                    <View key={developer.id} style={[styles.chip, styles.developerChip]}>
                                        <Text style={styles.chipText}>{developer.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {game.publishers && game.publishers.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Publishers</Text>
                            <View style={styles.chipContainer}>
                                {game.publishers.map((publisher) => (
                                    <View key={publisher.id} style={[styles.chip, styles.publisherChip]}>
                                        <Text style={styles.chipText}>{publisher.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.dark.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.dark.background,
    },
    errorText: {
        color: colors.dark.error,
        fontSize: 18,
    },
    carouselContainer: {
        height: 280,
        position: 'relative',
        backgroundColor: colors.dark.background,
    },
    carouselItemContainer: {
        width: width,
        height: 280,
    },
    carouselImage: {
        width: '100%',
        height: '100%',
    },
    paginationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationDot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.dark.primaryText,
        marginHorizontal: 4,
    },
    content: {
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.dark.primaryText,
        flex: 1,
    },
    favoriteButton: {
        padding: 4,
    },
    favoriteIcon: {
        fontSize: 28,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    rating: {
        fontSize: 24,
        color: colors.dark.warning,
        fontWeight: 'bold',
        marginRight: 8,
    },
    ratingCount: {
        fontSize: 16,
        color: colors.dark.secondaryText,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark.primaryText,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 26,
        color: colors.dark.secondaryText,
        textAlign: 'justify',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: colors.dark.genre,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    platformChip: {
        backgroundColor: colors.dark.platform,
    },
    developerChip: {
        backgroundColor: colors.dark.developer,
    },
    publisherChip: {
        backgroundColor: colors.dark.publisher,
    },
    chipText: {
        color: colors.dark.primaryText,
        fontSize: 14,
        fontWeight: '600',
    },
    releaseDate: {
        fontSize: 18,
        color: colors.dark.accent,
        fontWeight: '600',
    },
});

export default GameDetailsScreen;
