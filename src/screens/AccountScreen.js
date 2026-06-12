import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography } from '../styles/theme';

export default function AccountScreen() {
  const { isDarkMode, setIsDarkMode, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={isDarkMode ? colors.primaryDark : colors.surface}
        />
      </View>
      
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.logoutButton]}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.large,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    marginBottom: spacing.large,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    paddingHorizontal: spacing.xlarge,
    paddingVertical: spacing.medium,
    borderRadius: 12,
    marginVertical: spacing.small,
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF8A65',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});