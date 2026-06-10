import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle, faGear, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { colors, typography, spacing } from '../styles/theme';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <FontAwesomeIcon icon={faUserCircle} size={64} color={colors.primary} />
      <Text style={styles.title}>Account</Text>
      
      <TouchableOpacity style={styles.button}>
        <FontAwesomeIcon icon={faGear} size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.logoutButton]}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
    marginBottom: spacing.xlarge,
    marginTop: spacing.medium,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xlarge,
    paddingVertical: spacing.medium,
    borderRadius: 12,
    marginVertical: spacing.small,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoutButton: {
    backgroundColor: colors.warning,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});