import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/context/ThemeContext';
import TabNavigator from './src/navigation/TabNavigator';
import { initDatabase, getNotes } from './src/services/database';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const setupDatabase = async () => {
      await initDatabase();
      const loadedNotes = await getNotes();
      setNotes(loadedNotes);
      setDbReady(true);
    };
    setupDatabase();
  }, []);

  if (!dbReady) {
    return null; // Or a loading screen
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <TabNavigator notes={notes} setNotes={setNotes} />
      </NavigationContainer>
    </ThemeProvider>
  );
}