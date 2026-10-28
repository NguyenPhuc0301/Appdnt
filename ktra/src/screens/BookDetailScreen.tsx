import React from 'react';
import {Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, Pressable} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import PrimaryButton from '../components/PrimaryButton';
import {colors, radius, spacing} from '../theme/colors';
import {Book, RootStackParamList} from '../types/Book';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetail'> & {books: Book[]; onBorrow: (id: string) => void; onReturn: (id: string) => void; onDelete: (id: string) => void};
export default function BookDetailScreen({navigation, route, books, onBorrow, onReturn, onDelete}: Props) {
  const book = books.find(item => item.id === route.params.bookId);
  if (!book) return <SafeAreaView style={styles.safe}><Text style={styles.missing}>Không tìm thấy thông tin sách.</Text><PrimaryButton title="Quay lại" onPress={() => navigation.goBack()}/></SafeAreaView>;
  const available = book.quantity - book.borrowed;
  const confirmDelete = () => {
    if (book.borrowed > 0) {
      Alert.alert('Không thể xóa sách', `Sách đang có ${book.borrowed} cuốn được mượn. Vui lòng nhận trả trước khi xóa.`);
      return;
    }
    Alert.alert('Xóa sách', `Bạn có chắc muốn xóa “${book.title}” không?`, [{text: 'Hủy', style: 'cancel'}, {text: 'Xóa', style: 'destructive', onPress: () => {onDelete(book.id); navigation.popToTop();}}]);
  };
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="dark-content" backgroundColor={colors.background}/><ScrollView contentContainerStyle={styles.content}>
    <Pressable onPress={() => navigation.goBack()} style={styles.back}><Text style={styles.backText}>‹  Danh sách sách</Text></Pressable>
    <View style={styles.hero}><View style={styles.cover}><Text style={styles.coverIcon}>▤</Text></View><Text style={styles.category}>{book.category}</Text><Text style={styles.title}>{book.title}</Text><Text style={styles.author}>Tác giả: {book.author}</Text><View style={[styles.status, available === 0 && styles.statusEmpty]}><View style={[styles.dot, available === 0 && styles.dotEmpty]}/><Text style={[styles.statusText, available === 0 && styles.statusTextEmpty]}>{available === 0 ? 'Đã hết sách' : `Còn ${available} cuốn có thể mượn`}</Text></View></View>
    <Text style={styles.sectionTitle}>Thông tin sách</Text>
    <View style={styles.infoCard}><InfoRow label="Năm xuất bản" value={String(book.year)}/><InfoRow label="Thể loại" value={book.category}/><InfoRow label="Tổng số cuốn" value={`${book.quantity} cuốn`}/><InfoRow label="Đang được mượn" value={`${book.borrowed} cuốn`}/><InfoRow label="Còn trong thư viện" value={`${available} cuốn`} last/></View>
    <Text style={styles.sectionTitle}>Nghiệp vụ mượn / trả</Text>
    <View style={styles.actions}><View style={styles.action}><PrimaryButton title="＋  Cho mượn" onPress={() => onBorrow(book.id)} disabled={available <= 0}/><Text style={styles.actionHint}>{available <= 0 ? 'Đã hết sách để mượn' : 'Ghi nhận một lượt mượn'}</Text></View><View style={styles.action}><PrimaryButton title="↩  Nhận trả" variant="secondary" onPress={() => onReturn(book.id)} disabled={book.borrowed <= 0}/><Text style={styles.actionHint}>{book.borrowed <= 0 ? 'Không có lượt mượn' : 'Ghi nhận sách được trả'}</Text></View></View>
    <View style={styles.bottomActions}><PrimaryButton title="Sửa thông tin" onPress={() => navigation.navigate('BookForm', {bookId: book.id})}/><PrimaryButton title="Xóa sách" variant="danger" onPress={confirmDelete}/></View>
  </ScrollView></SafeAreaView>;
}
function InfoRow({label, value, last = false}: {label: string; value: string; last?: boolean}) {return <View style={[styles.infoRow, last && {borderBottomWidth: 0}]}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;}
const styles = StyleSheet.create({safe: {flex: 1, backgroundColor: colors.background}, content: {padding: spacing.lg, paddingBottom: 36}, back: {alignSelf: 'flex-start', paddingVertical: 7, marginBottom: spacing.md}, backText: {fontSize: 15, fontWeight: '700', color: colors.primary}, hero: {backgroundColor: colors.surface, alignItems: 'center', padding: spacing.xl, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl}, cover: {width: 90, height: 112, borderRadius: radius.md, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg}, coverIcon: {fontSize: 47, color: colors.primary}, category: {fontSize: 11, fontWeight: '700', color: colors.primary, backgroundColor: colors.chip, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 6, overflow: 'hidden'}, title: {fontSize: 22, lineHeight: 29, fontWeight: '800', color: colors.text, textAlign: 'center', marginTop: 12}, author: {fontSize: 14, color: colors.muted, marginTop: 7}, status: {flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 17, backgroundColor: colors.successSoft, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8}, statusEmpty: {backgroundColor: colors.dangerSoft}, dot: {width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success}, dotEmpty: {backgroundColor: colors.danger}, statusText: {fontSize: 12, color: colors.success, fontWeight: '700'}, statusTextEmpty: {color: colors.danger}, sectionTitle: {fontSize: 17, color: colors.text, fontWeight: '800', marginBottom: 11}, infoCard: {backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.lg, marginBottom: spacing.xl}, infoRow: {minHeight: 49, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border}, infoLabel: {fontSize: 13, color: colors.muted}, infoValue: {fontSize: 13, fontWeight: '700', color: colors.text, textAlign: 'right', flexShrink: 1}, actions: {flexDirection: 'row', gap: 12}, action: {flex: 1}, actionHint: {fontSize: 10, color: colors.muted, textAlign: 'center', marginTop: 7, marginBottom: spacing.lg}, bottomActions: {gap: 10, marginTop: 5}, missing: {padding: 20, color: colors.text}});
