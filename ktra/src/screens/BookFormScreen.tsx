import React, {useMemo, useState} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Pressable} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import PrimaryButton from '../components/PrimaryButton';
import {colors, radius, spacing} from '../theme/colors';
import {Book, BookCategory, CATEGORIES, RootStackParamList} from '../types/Book';

type Props = NativeStackScreenProps<RootStackParamList, 'BookForm'> & {books: Book[]; onSave: (book: Book) => void};
type Field = 'title' | 'author' | 'year' | 'quantity' | 'borrowed';
export default function BookFormScreen({navigation, route, books, onSave}: Props) {
  const existing = useMemo(() => books.find(book => book.id === route.params?.bookId), [books, route.params?.bookId]);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [author, setAuthor] = useState(existing?.author ?? '');
  const [category, setCategory] = useState<BookCategory>(existing?.category ?? 'Giáo trình');
  const [year, setYear] = useState(String(existing?.year ?? new Date().getFullYear()));
  const [quantity, setQuantity] = useState(String(existing?.quantity ?? '1'));
  const [borrowed, setBorrowed] = useState(String(existing?.borrowed ?? '0'));
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (!title.trim()) next.title = 'Vui lòng nhập tên sách.';
    if (!author.trim()) next.author = 'Vui lòng nhập tên tác giả.';
    const y = Number(year), q = Number(quantity), b = Number(borrowed), currentYear = new Date().getFullYear();
    if (!year.trim() || !Number.isInteger(y) || y < 1900 || y > currentYear) next.year = `Năm phải từ 1900 đến ${currentYear}.`;
    if (!quantity.trim() || !Number.isInteger(q) || q <= 0) next.quantity = 'Số lượng phải là số nguyên lớn hơn 0.';
    if (!borrowed.trim() || !Number.isInteger(b) || b < 0) next.borrowed = 'Số đang mượn phải là số nguyên từ 0.';
    else if (Number.isInteger(q) && b > q) next.borrowed = 'Số đang mượn không được lớn hơn tổng số cuốn.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const save = () => {
    if (!validate()) return;
    onSave({id: existing?.id ?? `book-${Date.now()}`, title: title.trim(), author: author.trim(), category, year: Number(year), quantity: Number(quantity), borrowed: Number(borrowed)});
    navigation.goBack();
  };
  const field = (label: string, value: string, setValue: (v: string) => void, key: Field, opts: {keyboardType?: 'default' | 'numeric'; placeholder?: string} = {}) => <View style={styles.field}>
    <Text style={styles.label}>{label} <Text style={styles.required}>*</Text></Text>
    <TextInput value={value} onChangeText={v => {setValue(v); if (errors[key]) setErrors(prev => ({...prev, [key]: undefined}));}} placeholder={opts.placeholder ?? label} placeholderTextColor={colors.muted} keyboardType={opts.keyboardType ?? 'default'} style={[styles.input, errors[key] && styles.inputError]} accessibilityLabel={label}/>
    {!!errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
  </View>;
  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Pressable onPress={() => navigation.goBack()} style={styles.back}><Text style={styles.backText}>‹  Quay lại</Text></Pressable>
      <Text style={styles.eyebrow}>{existing ? 'CẬP NHẬT THÔNG TIN' : 'BỔ SUNG VÀO THƯ VIỆN'}</Text>
      <Text style={styles.heading}>{existing ? 'Sửa sách' : 'Thêm sách mới'}</Text>
      <Text style={styles.subtitle}>Điền thông tin bên dưới để {existing ? 'cập nhật' : 'lưu'} đầu sách.</Text>
      <View style={styles.form}>
        {field('Tên sách', title, setTitle, 'title', {placeholder: 'Nhập tên sách'})}
        {field('Tác giả', author, setAuthor, 'author', {placeholder: 'Nhập tên tác giả'})}
        <Text style={styles.label}>Thể loại <Text style={styles.required}>*</Text></Text>
        <View style={styles.categories}>{CATEGORIES.map(item => <Pressable key={item} onPress={() => setCategory(item)} style={[styles.category, category === item && styles.categoryActive]}><Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text></Pressable>)}</View>
        {field('Năm xuất bản', year, setYear, 'year', {keyboardType: 'numeric', placeholder: 'Ví dụ: 2024'})}
        <View style={styles.row}>{<View style={styles.half}>{field('Tổng số cuốn', quantity, setQuantity, 'quantity', {keyboardType: 'numeric', placeholder: 'Ví dụ: 10'})}</View>}<View style={styles.half}>{field('Đang được mượn', borrowed, setBorrowed, 'borrowed', {keyboardType: 'numeric', placeholder: 'Mặc định 0'})}</View></View>
        <View style={styles.note}><Text style={styles.noteText}>Lưu ý: số lượng đang mượn không được vượt quá tổng số cuốn.</Text></View>
        <PrimaryButton title={existing ? 'Lưu thay đổi' : '＋  Thêm sách'} onPress={save}/>
      </View>
    </ScrollView>
  </KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({safe: {flex: 1, backgroundColor: colors.background}, content: {padding: spacing.lg, paddingBottom: 36}, back: {alignSelf: 'flex-start', paddingVertical: 7, paddingRight: 12, marginBottom: spacing.lg}, backText: {fontSize: 15, color: colors.primary, fontWeight: '700'}, eyebrow: {fontSize: 10, letterSpacing: 1.6, color: colors.primary, fontWeight: '800'}, heading: {fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 5}, subtitle: {fontSize: 13, color: colors.muted, marginTop: 6, marginBottom: spacing.xl}, form: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg}, field: {marginBottom: spacing.lg, flex: 1}, label: {fontSize: 13, color: colors.text, fontWeight: '700', marginBottom: 7}, required: {color: colors.danger}, input: {borderWidth: 1, borderColor: colors.border, backgroundColor: '#FBFCFF', borderRadius: radius.sm, minHeight: 48, paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontSize: 14}, inputError: {borderColor: colors.danger}, error: {fontSize: 11, color: colors.danger, marginTop: 5}, categories: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.lg, marginTop: 2}, category: {borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: colors.surface}, categoryActive: {backgroundColor: colors.chip, borderColor: colors.primary}, categoryText: {fontSize: 12, color: colors.muted, fontWeight: '600'}, categoryTextActive: {color: colors.primary}, row: {flexDirection: 'row', gap: 12}, half: {flex: 1}, note: {padding: 12, backgroundColor: colors.warningSoft, borderRadius: radius.sm, marginBottom: spacing.lg}, noteText: {fontSize: 12, lineHeight: 18, color: colors.warning}});
