import { useState, useEffect } from 'react';
import { StyleSheet, Switch, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ThemeScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme_mode');
      console.log('📖 Loaded theme:', savedTheme);
      
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      }
    } catch (error) {
      console.error('❌ Error loading theme:', error);
    }
  };

  const toggleTheme = async (value: boolean) => {
    setIsDarkMode(value);
    
    const theme = value ? 'dark' : 'light';
    await AsyncStorage.setItem('@theme_mode', theme);
    console.log('✅ Theme saved:', theme);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        Theme Settings
      </Text>

      <View style={styles.switchContainer}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>
          Dark Mode
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 18,
    color: '#000',
  },
});
