import { StyleSheet } from "react-native";
import { spacing } from "./theme";

export const notesStyles = StyleSheet.create({
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