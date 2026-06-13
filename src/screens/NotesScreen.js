import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import { StickyNotePlus, X, FileText, PenSquare } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { spacing, typography } from "../styles/theme";
import { getNotes, deleteNote } from "../services/database";

export default function NotesScreen({ navigation, route, notes, setNotes }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));

  // Load notes from database
  const loadNotes = async () => {
    console.log('Loading notes from database...');
    const loadedNotes = await getNotes();
    console.log('Notes loaded:', loadedNotes.length, 'notes found');
    setNotes(loadedNotes);
  };

  // Refresh when route.params.refresh changes (coming from CreateNote)
  React.useEffect(() => {
    if (route.params?.refresh) {
      console.log('Refresh triggered, reloading notes...');
      loadNotes();
      navigation.setParams({ refresh: null });
      console.log('Refresh param cleared');
    }
  }, [route.params?.refresh]);

  // Load notes when screen first opens
  React.useEffect(() => {
    console.log('Initial load - screen opened');
    loadNotes();
  }, []);

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleCreateNote = () => {
    console.log("Create Blank Note tapped");
    closeModal();
    // Hide bottom tab bar
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    navigation.navigate("CreateNote");
  };

  const handleImportDocument = () => {
    closeModal();
    // TODO: Open file picker with OCR
    console.log("Import document");
  };

  const handleEditNote = (item) => {
    console.log("Edit note tapped:", item.id);
    // Hide bottom tab bar
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    navigation.navigate("EditNote", { 
      noteId: item.id, 
      title: item.title, 
      content: item.content 
    });
  };

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => handleEditNote(item)}
          >
            <View
              style={[
                styles.noteCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.noteTitle, { color: colors.primaryDark }]}>
                {item.title}
              </Text>
              <Text style={[styles.noteContent, { color: colors.text }]}>
                {item.content}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textLight }]}>
            No notes yet. Tap + to add your first note!
          </Text>
        }
        contentContainerStyle={notes.length === 0 ? styles.emptyContainer : null}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={openModal}
      >
        <StickyNotePlus size={28} color="#FFFFFF" strokeWidth={2} />
      </TouchableOpacity>

      {/* Custom Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeModal}
          />
          <Animated.View
            style={[
              styles.modalContainer,
              {
                backgroundColor: colors.surface,
                transform: [{ translateY: modalTranslateY }],
              },
            ]}
          >
            <View
              style={[styles.modalHeader, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Add Note
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <X size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalOptions}>
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={handleCreateNote}
              >
                <View
                  style={[
                    styles.modalOptionIcon,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <PenSquare size={24} color={colors.primaryDark} />
                </View>
                <View style={styles.modalOptionText}>
                  <Text
                    style={[styles.modalOptionTitle, { color: colors.text }]}
                  >
                    Create Blank Note
                  </Text>
                  <Text
                    style={[
                      styles.modalOptionDesc,
                      { color: colors.textLight },
                    ]}
                  >
                    Write your own notes from scratch
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalOption,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={handleImportDocument}
              >
                <View
                  style={[
                    styles.modalOptionIcon,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <FileText size={24} color={colors.primaryDark} />
                </View>
                <View style={styles.modalOptionText}>
                  <Text
                    style={[styles.modalOptionTitle, { color: colors.text }]}
                  >
                    Import Document
                  </Text>
                  <Text
                    style={[
                      styles.modalOptionDesc,
                      { color: colors.textLight },
                    ]}
                  >
                    Upload PDF, DOC, or Image
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.large + 10,
    paddingHorizontal: spacing.large,
    paddingBottom: spacing.large,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: spacing.xlarge,
  },
  noteCard: {
    borderRadius: 12,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    borderWidth: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: spacing.small,
  },
  noteContent: {
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.large,
    paddingBottom: spacing.xlarge,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: spacing.medium,
    borderBottomWidth: 1,
    marginBottom: spacing.large,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  modalOptions: {
    gap: spacing.medium,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.medium,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.medium,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  modalOptionDesc: {
    fontSize: 14,
  },
});