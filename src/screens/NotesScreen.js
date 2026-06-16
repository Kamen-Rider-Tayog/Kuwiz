import React from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Animated,
} from "react-native";
import { StickyNotePlus, X, FileText, PenSquare } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { useOCRContext } from "../context/OCRContext";
import { useNotes, useDocumentImport, useModal } from "../hooks";
import { notesStyles as styles } from "../styles/notesStyles";

export default function NotesScreen({ navigation, route, notes, setNotes }) {
  const { colors } = useTheme();
  const { model: ocrModel, status: ocrStatus } = useOCRContext();
  const { modalVisible, slideAnim, openModal, closeModal } = useModal();
  const { loadNotes } = useNotes(route, navigation, setNotes);
  const { processing, importDocument } = useDocumentImport(navigation, ocrModel, ocrStatus);

  const handleCreateNote = () => {
    console.log("Create Blank Note tapped");
    closeModal();
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    navigation.navigate("CreateNote");
  };

  const handleEditNote = (item) => {
    console.log("Edit note tapped:", item.id);
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    navigation.navigate("EditNote", {
      noteId: item.id,
      title: item.title,
      content: item.content,
    });
  };

  const notesList = notes || [];
  
  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => handleEditNote(item)}>
      <View
        style={[
          styles.noteCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.noteTitle, { color: colors.primaryDark }]}>
          {item.title}
        </Text>
        <Text
          style={[styles.noteContent, { color: colors.text }]}
          numberOfLines={3}
        >
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <Text style={[styles.emptyText, { color: colors.textLight }]}>
      No notes yet. Tap + to add your first note!
    </Text>
  );

  const renderProgressIndicator = () => {
    if (!ocrStatus.isReady && ocrStatus.progress < 1 && ocrStatus.progress > 0) {
      return (
        <View
          style={[
            styles.progressContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.progressText, { color: colors.text }]}>
            Downloading OCR Model...
          </Text>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${ocrStatus.progress * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressPercent, { color: colors.textLight }]}>
            {Math.round(ocrStatus.progress * 100)}%
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderErrorIndicator = () => {
    if (ocrStatus.error) {
      return (
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: "#FFE5E5", borderColor: "#FF4444" },
          ]}
        >
          <Text style={[styles.errorText, { color: "#FF4444" }]}>
            OCR Error: {ocrStatus.error}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderProgressIndicator()}
      {renderErrorIndicator()}

      <FlatList
        data={notesList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNoteItem}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={notesList.length === 0 ? styles.emptyContainer : null}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={openModal}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <StickyNotePlus size={28} color="#FFFFFF" strokeWidth={2} />
        )}
      </TouchableOpacity>

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
                  <Text style={[styles.modalOptionTitle, { color: colors.text }]}>
                    Create Blank Note
                  </Text>
                  <Text style={[styles.modalOptionDesc, { color: colors.textLight }]}>
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
                onPress={importDocument}
                disabled={processing}
              >
                <View
                  style={[
                    styles.modalOptionIcon,
                    {
                      backgroundColor: processing ? colors.border : colors.primaryLight,
                    },
                  ]}
                >
                  <FileText
                    size={24}
                    color={processing ? colors.textLight : colors.primaryDark}
                  />
                </View>
                <View style={styles.modalOptionText}>
                  <Text
                    style={[
                      styles.modalOptionTitle,
                      {
                        color: processing ? colors.textLight : colors.text,
                      },
                    ]}
                  >
                    Import Document
                  </Text>
                  <Text style={[styles.modalOptionDesc, { color: colors.textLight }]}>
                    {processing ? "Processing document..." : "Upload Image, PDF, or DOCX"}
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