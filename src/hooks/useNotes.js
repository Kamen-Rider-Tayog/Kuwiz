import { useState, useEffect } from "react";
import { getNotes } from "../services/database";

export const useNotes = (route, navigation, setNotes) => {
  const loadNotes = async () => {
    console.log("Loading notes from database...");
    const loadedNotes = await getNotes();
    console.log("Notes loaded:", loadedNotes.length, "notes found");
    setNotes(loadedNotes);
  };

  useEffect(() => {
    if (route.params?.refresh) {
      console.log("Refresh triggered, reloading notes...");
      loadNotes();
      navigation.setParams({ refresh: null });
    }
  }, [route.params?.refresh]);

  useEffect(() => {
    console.log("Initial load - screen opened");
    loadNotes();
  }, []);

  return { loadNotes };
};