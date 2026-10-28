import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BookListScreen from './src/screens/BookListScreen';
import BookFormScreen from './src/screens/BookFormScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import {Book, RootStackParamList} from './src/types/Book';
import {seedBooks} from './src/utils/seedBooks';
import {colors} from './src/theme/colors';

const STORAGE_KEY = '@libraryapp/books/v1';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: unknown = raw ? JSON.parse(raw) : null;
        if (mounted) {
          if (Array.isArray(parsed) && parsed.length > 0) setBooks(parsed as Book[]);
          else setBooks(seedBooks);
        }
      } catch {
        if (mounted) setBooks(seedBooks);
      } finally {
        if (mounted) setReady(true);
      }
    };
    load();
    return () => {mounted = false;};
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books)).catch(() => {
      Alert.alert('Lỗi lưu dữ liệu', 'Không thể lưu dữ liệu trên thiết bị. Vui lòng thử lại.');
    });
  }, [books, ready]);

  const saveBook = (book: Book) => setBooks(current => {
    const exists = current.some(item => item.id === book.id);
    return exists ? current.map(item => item.id === book.id ? book : item) : [book, ...current];
  });
  const deleteBook = (id: string) => setBooks(current => current.filter(book => book.id !== id));
  const borrowBook = (id: string) => {
    const book = books.find(item => item.id === id);
    if (!book) return;
    if (book.quantity - book.borrowed <= 0) {
      Alert.alert('Không thể cho mượn', 'Sách đã hết, hiện không còn cuốn nào trong thư viện.');
      return;
    }
    Alert.alert('Xác nhận cho mượn', `Ghi nhận mượn một cuốn “${book.title}”?`, [
      {text: 'Hủy', style: 'cancel'},
      {text: 'Xác nhận', onPress: () => setBooks(current => current.map(item => item.id === id ? {...item, borrowed: item.borrowed + 1} : item))},
    ]);
  };
  const returnBook = (id: string) => {
    const book = books.find(item => item.id === id);
    if (!book) return;
    if (book.borrowed <= 0) {
      Alert.alert('Không thể nhận trả', 'Sách hiện không có cuốn nào đang được mượn.');
      return;
    }
    Alert.alert('Xác nhận nhận trả', `Ghi nhận trả một cuốn “${book.title}”?`, [
      {text: 'Hủy', style: 'cancel'},
      {text: 'Xác nhận', onPress: () => setBooks(current => current.map(item => item.id === id ? {...item, borrowed: Math.max(0, item.borrowed - 1)} : item))},
    ]);
  };

  if (!ready) return null;
  return <NavigationContainer>
    <Stack.Navigator initialRouteName="BookList" screenOptions={{headerShown: false, contentStyle: {backgroundColor: colors.background}, animation: 'slide_from_right'}}>
      <Stack.Screen name="BookList">{props => <BookListScreen {...props} books={books} onDelete={deleteBook}/>}</Stack.Screen>
      <Stack.Screen name="BookForm">{props => <BookFormScreen {...props} books={books} onSave={saveBook}/>}</Stack.Screen>
      <Stack.Screen name="BookDetail">{props => <BookDetailScreen {...props} books={books} onBorrow={borrowBook} onReturn={returnBook} onDelete={deleteBook}/>}</Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>;
}
