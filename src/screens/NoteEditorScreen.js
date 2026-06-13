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
    console.log('=== SAVE BUTTON PRESSED ===');
    console.log('Title:', title);
    console.log('Content:', content);
    
    if (title.trim() || content.trim()) {
      const savedId = await addNote(
        title.trim() || 'Untitled',
        content.trim()
      );
      
      console.log('Note saved with ID:', savedId);
      
      if (savedId) {
        console.log('Navigating back with refresh param');
        // Show bottom tab bar again
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
        navigation.navigate('NotesList', { refresh: Date.now() });
      }
    } else {
      console.log('Empty note, going back without saving');
      // Show bottom tab bar again
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
      navigation.goBack();
    }
  };

  const handleBack = () => {
  console.log('Current colors being used:', {
    surface: colors.surface,
    border: colors.border,
    isDarkMode: colors === darkColors ? 'dark' : 'light'
  });
  
  navigation.getParent()?.setOptions({ 
    tabBarStyle: { 
      display: 'flex',
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 8,
      paddingBottom: 12,
      height: 60,
    }
  });
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