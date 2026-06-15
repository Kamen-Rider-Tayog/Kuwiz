import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StickyNotePlus, X, FileText, PenSquare } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";
import { useOCR, models } from "react-native-executorch";
import { initExecutorch } from "react-native-executorch";
import { ExpoResourceFetcher } from "react-native-executorch-expo-resource-fetcher";
import { useTheme } from "../context/ThemeContext";
import { spacing, typography } from "../styles/theme";
import { getNotes } from "../services/database";

initExecutorch({ resourceFetcher: ExpoResourceFetcher });

export default function NotesScreen({ navigation, route, notes, setNotes }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [processing, setProcessing] = useState(false);

  const model = useOCR({ model: models.ocr.craft({ language: 'en' }) });

  // Load notes from database
  const loadNotes = async () => {
    console.log("Loading notes from database...");
    const loadedNotes = await getNotes();
    console.log("Notes loaded:", loadedNotes.length, "notes found");
    setNotes(loadedNotes);
  };

  // Refresh when route.params.refresh changes (coming from CreateNote)
  React.useEffect(() => {
    if (route.params?.refresh) {
      console.log("Refresh triggered, reloading notes...");
      loadNotes();
      navigation.setParams({ refresh: null });
      console.log("Refresh param cleared");
    }
  }, [route.params?.refresh]);

  // Load notes when screen first opens
  React.useEffect(() => {
    console.log("Initial load - screen opened");
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
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    navigation.navigate("CreateNote");
  };

  const handleImportDocument = async () => {
    console.log("Import Document tapped");
    closeModal();

    if (processing) {
      Alert.alert("Processing", "Please wait, still processing...");
      return;
    }

    // Check if model is still downloading
    if (!model.isReady && model.downloadProgress < 1) {
      Alert.alert(
        "Downloading OCR Model",
        `Please wait while the OCR model downloads (${Math.round(model.downloadProgress * 100)}%). This is a one-time download.`,
        [{ text: "OK" }],
      );
      return;
    }

    if (model.error) {
      Alert.alert("Error", `Failed to load OCR model: ${model.error}`);
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "image/jpg"],
      });

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        console.log("File selected:", file.name);

        setProcessing(true);
        Alert.alert("Processing", `Extracting text from ${file.name}...`);

        // Run OCR
        const ocrDetections = await model.forward(file.uri);

        setProcessing(false);

        if (ocrDetections && ocrDetections.length > 0) {
          const extractedText = ocrDetections
            .map((detection) => detection.text)
            .join("\n");
          console.log("Extracted text length:", extractedText.length);

          navigation
            .getParent()
            ?.setOptions({ tabBarStyle: { display: "none" } });
          navigation.navigate("CreateNote", {
            prefillTitle: file.name.replace(/\.[^/.]+$/, ""),
            prefillContent: extractedText,
          });
        } else {
          Alert.alert(
            "No Text Found",
            "Could not extract text from this image. Try a clearer image with visible text.",
          );
        }
      }
    } catch (error) {
      console.log("Error:", error);
      setProcessing(false);
      Alert.alert(
        "Error",
        "Failed to process image. Make sure the image contains readable text.",
      );
    }
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

  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* OCR Download Progress Indicator */}
      {!model.isReady &&
        model.downloadProgress < 1 &&
        model.downloadProgress > 0 && (
          <View
            style={[
              styles.progressContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.progressText, { color: colors.text }]}>
              Downloading OCR Model...
            </Text>
            <View
              style={[styles.progressBar, { backgroundColor: colors.border }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${model.downloadProgress * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressPercent, { color: colors.textLight }]}>
              {Math.round(model.downloadProgress * 100)}%
            </Text>
          </View>
        )}

      {/* OCR Error */}
      {model.error && (
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: "#FFE5E5", borderColor: "#FF4444" },
          ]}
        >
          <Text style={[styles.errorText, { color: "#FF4444" }]}>
            OCR Error: {model.error}
          </Text>
        </View>
      )}

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
        contentContainerStyle={
          notes.length === 0 ? styles.emptyContainer : null
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={openModal}
      >
        {processing ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <StickyNotePlus size={28} color="#FFFFFF" strokeWidth={2} />
        )}
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
                disabled={!model.isReady && model.downloadProgress < 1}
              >
                <View
                  style={[
                    styles.modalOptionIcon,
                    {
                      backgroundColor:
                        !model.isReady && model.downloadProgress < 1
                          ? colors.border
                          : colors.primaryLight,
                    },
                  ]}
                >
                  <FileText
                    size={24}
                    color={
                      !model.isReady && model.downloadProgress < 1
                        ? colors.textLight
                        : colors.primaryDark
                    }
                  />
                </View>
                <View style={styles.modalOptionText}>
                  <Text
                    style={[
                      styles.modalOptionTitle,
                      {
                        color:
                          !model.isReady && model.downloadProgress < 1
                            ? colors.textLight
                            : colors.text,
                      },
                    ]}
                  >
                    Import Document
                  </Text>
                  <Text
                    style={[
                      styles.modalOptionDesc,
                      { color: colors.textLight },
                    ]}
                  >
                    {!model.isReady && model.downloadProgress < 1
                      ? `Downloading OCR model... ${Math.round(model.downloadProgress * 100)}%`
                      : "Upload Image for OCR"}
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
    paddingVertical: spacing.large + 30,
    paddingHorizontal: spacing.large,
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
  progressContainer: {
    margin: spacing.medium,
    padding: spacing.medium,
    borderRadius: 12,
    borderWidth: 1,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: spacing.small,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    marginTop: spacing.small,
    textAlign: "right",
  },
  errorContainer: {
    margin: spacing.medium,
    padding: spacing.medium,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
  },
});
