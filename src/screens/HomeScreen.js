import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Dimensions,
    Animated,
    StatusBar,
} from 'react-native';
import { gamesAPI } from '../services/api';
import { colors } from '../constants/colors';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadGames();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const loadGames = async () => {
        try {
            const data = await gamesAPI.getTrendingGames(1);
            setGames(data.results);
            setLoading(false);
        } catch (error) {
            console.error('Error loading games:', error);
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);

        if (query.length > 2) {
            setIsSearching(true);
            try {
                const data = await gamesAPI.searchGames(query);
                setSearchResults(data.results);
            } catch (error) {
                console.error('Error searching games:', error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
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
                {item.rating && (
                    <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    const displayedGames = searchQuery.length > 2 ? searchResults : games;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                <Text style={styles.headerTitle}>🎮 GameVerse</Text>
                <Text style={styles.headerSubtitle}>Explore the Ultimate Gaming Universe</Text>
            </Animated.View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="🔍 Find your next adventure..."
                    placeholderTextColor={colors.dark.secondaryText}
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.dark.accent} />
                    <Text style={styles.loadingText}>Loading amazing games...</Text>
                </View>
            ) : (
                <FlatList
                    data={displayedGames}
                    renderItem={renderGameCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {isSearching
                                    ? 'Searching...'
                                    : searchQuery.length > 2
                                        ? 'No games found'
                                        : 'No games available'}
                            </Text>
                        </View>
                    }
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
        color: colors.dark.accent,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    searchInput: {
        backgroundColor: colors.dark.secondaryBackground,
        borderRadius: 12,
        padding: 14,
        color: colors.dark.primaryText,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.dark.border,
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
    },
    emptyText: {
        color: colors.dark.secondaryText,
        fontSize: 18,
    },
});

export default HomeScreen;
