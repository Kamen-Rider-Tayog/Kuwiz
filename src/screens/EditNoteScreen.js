import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography } from '../styles/theme';
import { updateNote } from '../services/database';

export default function EditNoteScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { noteId, title: initialTitle, content: initialContent } = route.params;
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSave = async () => {
    console.log('=== EDIT NOTE SAVE ===');
    console.log('Note ID:', noteId);
    console.log('Title:', title);
    console.log('Content:', content);
    
    if (title.trim() || content.trim()) {
      await updateNote(noteId, title.trim() || 'Untitled', content.trim());
      console.log('Note updated successfully');
    }
    
    // Show tab bar again
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
    // Navigate back with refresh param to reload notes
    navigation.navigate('NotesList', { refresh: Date.now() });
  };

  const handleBack = () => {
    // Auto-save on back
    handleSave();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.screenTitle, { color: colors.text }]} numberOfLines={1}>
          {title.trim() || 'Edit Note'}
        </Text>
        
        {/* Empty view for spacing to keep title centered */}
        <View style={styles.placeholder} />
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
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: spacing.medium,
  },
  placeholder: {
    width: 40,
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