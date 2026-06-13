import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, StickyNote, User } from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';
import NotesScreen from '../screens/NotesScreen';
import AccountScreen from '../screens/AccountScreen';
import CreateNoteScreen from '../screens/CreateNoteScreen';
import EditNoteScreen from '../screens/EditNoteScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function NotesStack({ notes, setNotes }) {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen name="NotesList">
        {(props) => <NotesScreen {...props} notes={notes} setNotes={setNotes} />}
      </Stack.Screen>
      <Stack.Screen 
        name="CreateNote" 
        component={CreateNoteScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="EditNote" 
        component={EditNoteScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

export default function TabNavigator({ notes, setNotes }) {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconProps = { color, size, strokeWidth: 2 };
          
          if (route.name === 'Home') {
            return <Home {...iconProps} />;
          } else if (route.name === 'Notes') {
            return <StickyNote {...iconProps} />;
          } else if (route.name === 'Account') {
            return <User {...iconProps} />;
          }
          
          return null;
        },
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 12,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notes">
        {(props) => <NotesStack {...props} notes={notes} setNotes={setNotes} />}
      </Tab.Screen>
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}