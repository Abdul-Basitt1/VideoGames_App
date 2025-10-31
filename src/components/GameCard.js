import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { colors } from '../constants/colors';

const GameCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.gameCard} onPress={onPress}>
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
};

const styles = StyleSheet.create({
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
});

export default GameCard;

