import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClipboardList, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { colors, typography, spacing } from '../styles/theme';

export default function NotesScreen() {
  return (
    <View style={styles.container}>
      <FontAwesomeIcon icon={faClipboardList} size={64} color={colors.primary} />
      <Text style={styles.title}>Notes</Text>
      <Text style={styles.subtitle}>All your notes in one place</Text>
      <FontAwesomeIcon icon={faPlusCircle} size={24} color={colors.primaryLight} style={styles.plusIcon} />
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
  plusIcon: {
    marginTop: spacing.xlarge,
    opacity: 0.5,
  },
});