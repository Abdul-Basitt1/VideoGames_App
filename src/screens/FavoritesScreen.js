import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { gamesAPI } from '../services/api';
import { storage } from '../utils/storage';
import { colors } from '../constants/colors';

const FavoritesScreen = ({ navigation }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, [navigation]);

    const loadFavorites = async () => {
        try {
            const favoriteIds = await storage.getFavorites();

            if (favoriteIds.length === 0) {
                setGames([]);
                setLoading(false);
                return;
            }

            const gamePromises = favoriteIds.map((id) =>
                gamesAPI.getGameDetails(id).catch(() => null)
            );
            const favoriteGames = await Promise.all(gamePromises);
            setGames(favoriteGames.filter((game) => game !== null));
            setLoading(false);
        } catch (error) {
            console.error('Error loading favorites:', error);
            setLoading(false);
        }
    };

    const renderGameCard = ({ item }) => (
        <TouchableOpacity
            style={styles.gameCard}
            onPress={() => navigation.navigate('GameDetails', { gameId: item.id })}
        >
            <View style={styles.cardContent}>
                <Image
                    source={{ uri: item.background_image }}
                    style={styles.gameImage}
                    resizeMode="cover"
                />
                <View style={styles.gameInfo}>
                    <View style={styles.titleRow}>
                        <Text style={styles.gameTitle} numberOfLines={2}>
                            {item.name}
                        </Text>
                        <View style={styles.heartIcon}>
                            <Text style={styles.heart}>❤️</Text>
                        </View>
                    </View>
                    {item.genres && item.genres.length > 0 && (
                        <View style={styles.genreContainer}>
                            {item.genres.slice(0, 2).map((genre) => (
                                <View key={genre.id} style={styles.genreTag}>
                                    <Text style={styles.genreText}>{genre.name}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {item.rating && (
                        <View style={styles.ratingContainer}>
                            <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
                            {item.released && (
                                <Text style={styles.releaseDate}>
                                    📅 {new Date(item.released).getFullYear()}
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>⭐ My Collection</Text>
                <Text style={styles.headerSubtitle}>Your Favorite Games Library</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.dark.accentTertiary} />
                    <Text style={styles.loadingText}>Loading your collection...</Text>
                </View>
            ) : games.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>⭐</Text>
                    <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                    <Text style={styles.emptyText}>
                        Start exploring and add games to build your ultimate collection!
                    </Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => navigation.navigate('HomeTab')}
                    >
                        <Text style={styles.exploreButtonText}>Start Exploring 🎮</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={games}
                    renderItem={renderGameCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.dark.primaryText,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: colors.dark.accentTertiary,
    },
    list: {
        padding: 20,
    },
    gameCard: {
        marginBottom: 16,
    },
    cardContent: {
        backgroundColor: colors.dark.secondaryBackground,
        borderRadius: 20,
        overflow: 'hidden',
        flexDirection: 'row',
        elevation: 6,
        shadowColor: colors.dark.accentTertiary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: colors.dark.accentTertiary,
    },
    gameImage: {
        width: 120,
        height: 120,
    },
    gameInfo: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    gameTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.dark.primaryText,
        flex: 1,
    },
    heartIcon: {
        marginLeft: 8,
    },
    heart: {
        fontSize: 20,
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    genreTag: {
        backgroundColor: colors.dark.genre,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 4,
    },
    genreText: {
        color: colors.dark.primaryText,
        fontSize: 11,
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rating: {
        fontSize: 16,
        color: colors.dark.warning,
        fontWeight: '600',
    },
    releaseDate: {
        fontSize: 14,
        color: colors.dark.secondaryText,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: colors.dark.secondaryText,
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 100,
        marginBottom: 24,
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.dark.primaryText,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: colors.dark.secondaryText,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    exploreButton: {
        backgroundColor: colors.dark.accentTertiary,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 25,
        elevation: 4,
        shadowColor: colors.dark.accentTertiary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    exploreButtonText: {
        color: colors.dark.primaryText,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default FavoritesScreen;
