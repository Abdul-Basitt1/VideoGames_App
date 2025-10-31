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
import { colors } from '../constants/colors';

const NewsScreen = ({ navigation }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadNewReleases();
    }, []);

    const loadNewReleases = async () => {
        try {
            setError(null);
            const data = await gamesAPI.getUpcomingGames(1);
            if (data && data.results) {
                setGames(data.results);
            } else {
                setGames([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading upcoming games:', error);
            setError('Failed to load games');
            setLoading(false);
        }
    };

    const renderGameCard = ({ item }) => (
        <TouchableOpacity
            style={styles.gameCard}
            onPress={() => navigation.navigate('GameDetails', { gameId: item.id })}
        >
            <Image
                source={{ uri: item.background_image }}
                style={styles.gameImage}
                resizeMode="cover"
            />
            <View style={styles.gameInfo}>
                <Text style={styles.gameTitle} numberOfLines={2}>
                    {item.name}
                </Text>
                {item.genres && item.genres.length > 0 && (
                    <Text style={styles.gameGenre} numberOfLines={1}>
                        {item.genres[0].name}
                    </Text>
                )}
                {item.released && (
                    <Text style={styles.releaseDate}>📅 {item.released}</Text>
                )}
                {item.rating && (
                    <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>📰 Gaming News</Text>
                <Text style={styles.headerSubtitle}>Hot Releases & Coming Soon</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.dark.accentSecondary} />
                    <Text style={styles.loadingText}>Loading hot releases...</Text>
                </View>
            ) : error ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                    <TouchableOpacity onPress={loadNewReleases} style={styles.retryButton}>
                        <Text style={styles.retryText}>Tap to Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={games}
                    renderItem={renderGameCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>📰</Text>
                            <Text style={styles.emptyTitle}>No Upcoming Games</Text>
                            <Text style={styles.emptyText}>Check back later for exciting new releases!</Text>
                        </View>
                    }
                    refreshing={loading}
                    onRefresh={loadNewReleases}
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
        color: colors.dark.accentSecondary,
    },
    list: {
        padding: 20,
    },
    gameCard: {
        backgroundColor: colors.dark.secondaryBackground,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    gameImage: {
        width: '100%',
        height: 200,
        backgroundColor: colors.dark.tertiaryBackground,
    },
    gameInfo: {
        padding: 16,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark.primaryText,
        marginBottom: 8,
    },
    gameGenre: {
        fontSize: 14,
        color: colors.dark.accentSecondary,
        marginBottom: 8,
    },
    releaseDate: {
        fontSize: 14,
        color: colors.dark.accent,
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 16,
        color: colors.dark.warning,
        fontWeight: '600',
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
        paddingVertical: 60,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.dark.primaryText,
        marginBottom: 8,
    },
    emptyText: {
        color: colors.dark.secondaryText,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    errorText: {
        color: colors.dark.error,
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: colors.dark.accentSecondary,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    retryText: {
        color: colors.dark.primaryText,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default NewsScreen;
