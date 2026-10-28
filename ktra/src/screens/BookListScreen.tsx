import React, {useMemo, useState} from 'react';
import {Alert, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View, Pressable} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import BookCard from '../components/BookCard';
import {colors, radius, spacing} from '../theme/colors';
import {Book, CATEGORIES, RootStackParamList} from '../types/Book';

type Props = NativeStackScreenProps<RootStackParamList, 'BookList'>;
type Filter = 'Tất cả' | (typeof CATEGORIES)[number];
type ListProps = Props & {books: Book[]; onDelete: (id: string) => void};
export default function BookListScreen({navigation, books, onDelete}: ListProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('Tất cả');
  const filteredBooks = useMemo(() => books.filter(book => {
    const text = query.trim().toLocaleLowerCase('vi');
    const matchesText = !text || book.title.toLocaleLowerCase('vi').includes(text) || book.author.toLocaleLowerCase('vi').includes(text);
    return matchesText && (filter === 'Tất cả' || book.category === filter);
  }), [books, filter, query]);
  const totalBooks = books.reduce((sum, book) => sum + book.quantity, 0);
  const totalBorrowed = books.reduce((sum, book) => sum + book.borrowed, 0);
  const confirmDelete = (book: Book) => {
    if (book.borrowed > 0) {
      Alert.alert('Không thể xóa sách', `“${book.title}” đang có ${book.borrowed} cuốn được mượn. Vui lòng nhận trả trước khi xóa.`);
      return;
    }
    Alert.alert('Xóa sách', `Bạn có chắc muốn xóa “${book.title}” không?`, [
      {text: 'Hủy', style: 'cancel'},
      {text: 'Xóa', style: 'destructive', onPress: () => onDelete(book.id)},
    ]);
  };
  const filters: Filter[] = ['Tất cả', ...CATEGORIES];
  return <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="dark-content" backgroundColor={colors.background}/>
    <FlatList
      data={filteredBooks}
      keyExtractor={item => item.id}
      renderItem={({item}) => <BookCard book={item} onPress={() => navigation.navigate('BookDetail', {bookId: item.id})} onLongPress={() => confirmDelete(item)}/>}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={<>
        <View style={styles.header}>
          <View><Text style={styles.eyebrow}>THƯ VIỆN CỦA BẠN</Text><Text style={styles.heading}>Quản lý sách</Text><Text style={styles.subtitle}>Theo dõi sách và lượt mượn trả</Text></View>
          <View style={styles.logo}><Text style={styles.logoText}>▤</Text></View>
        </View>
        <View style={styles.stats}>
          <View style={styles.statCard}><Text style={styles.statLabel}>Đầu sách</Text><Text style={styles.statValue}>{books.length}</Text><Text style={styles.statFoot}>đầu sách</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Tổng số cuốn</Text><Text style={styles.statValue}>{totalBooks}</Text><Text style={styles.statFoot}>trong thư viện</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>Đang mượn</Text><Text style={[styles.statValue, {color: colors.warning}]}>{totalBorrowed}</Text><Text style={styles.statFoot}>cuốn sách</Text></View>
        </View>
        <View style={styles.searchWrap}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Tìm theo tên sách hoặc tác giả..." placeholderTextColor={colors.muted} style={styles.search} returnKeyType="search" accessibilityLabel="Tìm kiếm sách"/><Pressable accessibilityRole="button" onPress={() => navigation.navigate('BookForm')} style={({pressed}) => [styles.addButton, pressed && {opacity: 0.8}]}><Text style={styles.addButtonText}>＋ Thêm sách</Text></Pressable></View>
        <Text style={styles.sectionTitle}>Danh sách sách <Text style={styles.count}>({filteredBooks.length})</Text></Text>
        <FlatList horizontal data={filters} keyExtractor={item => item} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters} renderItem={({item}) => <Pressable onPress={() => setFilter(item)} style={[styles.filterChip, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>}/>
      </>}
      ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyIcon}>⌕</Text><Text style={styles.emptyTitle}>Không tìm thấy sách</Text><Text style={styles.emptyText}>Thử từ khóa khác hoặc chọn thể loại khác.</Text></View>}
      ListFooterComponent={<Text style={styles.hint}>Mẹo: nhấn giữ một cuốn sách để xóa.</Text>}
    />
  </SafeAreaView>;
}
const styles = StyleSheet.create({safe: {flex: 1, backgroundColor: colors.background}, listContent: {paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 30}, header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg}, eyebrow: {fontSize: 10, letterSpacing: 1.7, fontWeight: '800', color: colors.primary, marginBottom: 5}, heading: {fontSize: 28, fontWeight: '800', color: colors.text}, subtitle: {fontSize: 13, color: colors.muted, marginTop: 4}, logo: {width: 52, height: 52, borderRadius: 17, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'}, logoText: {fontSize: 29, color: '#FFFFFF'}, stats: {flexDirection: 'row', gap: 9, marginBottom: spacing.xl}, statCard: {flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.border}, statLabel: {fontSize: 11, color: colors.muted, fontWeight: '600'}, statValue: {fontSize: 25, fontWeight: '800', color: colors.text, marginTop: 7}, statFoot: {fontSize: 10, color: colors.muted, marginTop: 2}, searchWrap: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.md, paddingLeft: 11, marginBottom: spacing.xl}, searchIcon: {fontSize: 26, color: colors.muted, marginRight: 5}, search: {flex: 1, minWidth: 0, paddingVertical: 13, color: colors.text, fontSize: 12}, addButton: {backgroundColor: colors.primary, borderRadius: 9, paddingVertical: 12, paddingHorizontal: 10, marginRight: 5}, addButtonText: {fontSize: 12, color: '#FFFFFF', fontWeight: '800'}, sectionTitle: {fontSize: 18, color: colors.text, fontWeight: '800', marginBottom: 12}, count: {fontSize: 14, color: colors.muted, fontWeight: '500'}, filters: {gap: 8, paddingBottom: 14}, filterChip: {paddingHorizontal: 13, paddingVertical: 8, backgroundColor: colors.surface, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border}, filterActive: {backgroundColor: colors.primary, borderColor: colors.primary}, filterText: {fontSize: 12, color: colors.muted, fontWeight: '600'}, filterTextActive: {color: '#FFFFFF'}, empty: {alignItems: 'center', paddingVertical: 42, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border}, emptyIcon: {fontSize: 36, color: colors.muted}, emptyTitle: {fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 8}, emptyText: {fontSize: 12, color: colors.muted, marginTop: 5, textAlign: 'center'}, hint: {fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 10}});
