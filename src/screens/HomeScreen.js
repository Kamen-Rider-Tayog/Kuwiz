import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookOpen, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { colors, typography, spacing } from '../styles/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kuwiz</Text>
      <Text style={styles.subtitle}>Turn your notes into quizzes</Text>
      <Text style={styles.body}>Learn smarter, remember longer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.large,
  },
  title: {
    ...typography.title,
    color: colors.primaryDark,
    marginBottom: spacing.medium,
    marginTop: spacing.medium,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginBottom: spacing.small,
  },
  body: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
  },
});