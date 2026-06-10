import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleQuestion, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { colors, typography, spacing } from '../styles/theme';

export default function QuizScreen() {
  return (
    <View style={styles.container}>
      <FontAwesomeIcon icon={faCircleQuestion} size={64} color={colors.primary} />
      <Text style={styles.title}>Quiz</Text>
      <Text style={styles.subtitle}>Test your knowledge</Text>
      <FontAwesomeIcon icon={faChartSimple} size={24} color={colors.accent} style={styles.chartIcon} />
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
    color: colors.textLight,
  },
  chartIcon: {
    marginTop: spacing.xlarge,
    opacity: 0.5,
  },
});