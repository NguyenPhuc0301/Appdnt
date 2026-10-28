import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';
import {colors, radius, spacing} from '../theme/colors';

type Props = {title: string; onPress: () => void; disabled?: boolean; variant?: 'primary' | 'secondary' | 'danger'; loading?: boolean};
export default function PrimaryButton({title, onPress, disabled = false, variant = 'primary', loading = false}: Props) {
  const backgroundColor = variant === 'danger' ? colors.danger : variant === 'secondary' ? colors.chip : colors.primary;
  const textColor = variant === 'secondary' ? colors.primary : '#FFFFFF';
  return <Pressable accessibilityRole="button" disabled={disabled || loading} onPress={onPress} style={({pressed}) => [styles.button, {backgroundColor}, (disabled || loading) && styles.disabled, pressed && !disabled && styles.pressed]}>
    {loading ? <ActivityIndicator color={textColor}/> : <Text style={[styles.text, {color: textColor}]}>{title}</Text>}
  </Pressable>;
}
const styles = StyleSheet.create({button: {minHeight: 48, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center'}, text: {fontSize: 15, fontWeight: '700'}, disabled: {opacity: 0.4}, pressed: {opacity: 0.8}});
