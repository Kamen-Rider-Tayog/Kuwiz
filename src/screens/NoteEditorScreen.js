import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography } from '../styles/theme';
import { addNote } from '../services/database';

export default function NoteEditorScreen({ navigation, route }) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (title.trim() || content.trim()) {
      const savedId = await addNote(
        title.trim() || 'Untitled',
        content.trim()
      );
      
      if (savedId) {
        // Navigate back with refresh parameter
        navigation.navigate('NotesList', { refresh: Date.now() });
      }
    } else {
      navigation.goBack();
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.screenTitle, { color: colors.text }]}>New Note</Text>
        
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Save size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.titleInput, { color: colors.text, borderBottomColor: colors.border }]}
          placeholder="Add a cool title"
          placeholderTextColor={colors.textLight}
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
        
        <TextInput
          style={[styles.contentInput, { color: colors.text }]}
          placeholder="Start writing..."
          placeholderTextColor={colors.textLight}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.large + 8,
    paddingHorizontal: spacing.medium,
    paddingBottom: spacing.medium,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.small,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: spacing.small,
  },
  inputContainer: {
    flex: 1,
    padding: spacing.large,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    marginBottom: spacing.large,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    textAlignVertical: 'top',
  },
});