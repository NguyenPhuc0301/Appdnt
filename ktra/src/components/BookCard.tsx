import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Book} from '../types/Book';
import {colors, radius, spacing} from '../theme/colors';

type Props = {book: Book; onPress: () => void; onLongPress: () => void};
export default function BookCard({book, onPress, onLongPress}: Props) {
  const available = book.quantity - book.borrowed;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} onLongPress={onLongPress} delayLongPress={450} style={({pressed}) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.cover}><Text style={styles.coverIcon}>▤</Text></View>
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.title}>{book.title}</Text>
        <Text numberOfLines={1} style={styles.author}>{book.author}</Text>
        <View style={styles.bottom}>
          <Text style={styles.category}>{book.category}</Text>
          <Text style={[styles.stock, available === 0 && styles.empty]}>{available === 0 ? 'Hết sách' : `Còn ${available} cuốn`}</Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, elevation: 2, shadowColor: colors.shadow, shadowOpacity: 0.05, shadowRadius: 7, shadowOffset: {width: 0, height: 3}},
  pressed: {opacity: 0.84, transform: [{scale: 0.995}]}, cover: {width: 54, height: 70, borderRadius: radius.sm, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md}, coverIcon: {fontSize: 29, color: colors.primary}, info: {flex: 1}, title: {fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4}, author: {fontSize: 13, color: colors.muted, marginBottom: 8}, bottom: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6}, category: {fontSize: 11, color: colors.primary, backgroundColor: colors.chip, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill}, stock: {fontSize: 12, color: colors.success, fontWeight: '700'}, empty: {color: colors.danger}, chevron: {fontSize: 28, color: colors.muted, paddingLeft: 7},
});
