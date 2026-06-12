import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography } from '../styles/theme';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryDark }]}>Kuwiz</Text>
      <Text style={[styles.subtitle, { color: colors.primary }]}>Turn your notes into quizzes</Text>
      <Text style={[styles.body, { color: colors.textLight }]}>Learn smarter, remember longer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.large,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.medium,
  },
  subtitle: {
    ...typography.subtitle,
    marginBottom: spacing.small,
  },
  body: {
    ...typography.body,
    textAlign: 'center',
  },
});