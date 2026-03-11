# 📝 LiveCodingStorage - Step-by-Step Tasks

Complete checklist for building the AsyncStorage tutorial project.

---

## 📦 Phase 0: Project Setup

### ✅ Task 0.1: Create Project
```bash
cd c:\Users\Youcode\Desktop\ALL\courese\react\react native\z-learn
npx create-expo-app@latest LiveCodingStorage -e with-router
```

**Expected Result:**
- New folder `LiveCodingStorage` created
- Project initialized with TypeScript and Expo Router

---

### ✅ Task 0.2: Navigate to Project
```bash
cd LiveCodingStorage
```

---

### ✅ Task 0.3: Install AsyncStorage
```bash
npx expo install @react-native-async-storage/async-storage
```

**Expected Result:**
- Package added to `package.json`
- Native dependencies installed

---

### ✅ Task 0.4: Start Development Server
```bash
npx expo start
```

**Expected Result:**
- Metro bundler starts
- QR code appears
- Press `a` for Android or scan QR with Expo Go

---

### ✅ Task 0.5: Clean Up Project
```bash
cd app\(tabs)
del explore.tsx
cd ..\..
```

**Expected Result:**
- `explore.tsx` file deleted

---

## 🌓 Phase 1: Theme Persistence (Simple String Storage)

### ✅ Task 1.1: Update Tab Layout

**File:** `app/(tabs)/_layout.tsx`

**Action:** Replace entire file content with:

```typescript
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Theme',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paintbrush.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

**Expected Result:**
- Two tabs: "Theme" and "Profile"
- Icons updated

---

### ✅ Task 1.2: Create Theme Screen - Basic Structure

**File:** `app/(tabs)/index.tsx`

**Action:** Replace entire file content with:

```typescript
import { useState, useEffect } from 'react';
import { StyleSheet, Switch, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ThemeScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        Theme Settings
      </Text>
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
});
```

**Expected Result:**
- Screen shows "Theme Settings" title
- White background

**Test:** Run app, go to "Theme" tab

---

### ✅ Task 1.3: Add Switch Component

**File:** `app/(tabs)/index.tsx`

**Action:** Update the return statement and add styles:

```typescript
export default function ThemeScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
          onValueChange={setIsDarkMode}
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
```

**Expected Result:**
- Switch appears below title
- Toggle switch changes background color
- BUT: Closing app resets to light mode (not saved yet)

**Test:** Toggle switch, see background change

---

### ✅ Task 1.4: Add Save Function

**File:** `app/(tabs)/index.tsx`

**Action:** Add `toggleTheme` function and update Switch:

```typescript
export default function ThemeScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

// ... same styles
```

**Expected Result:**
- Toggle switch saves to AsyncStorage
- Console shows: `✅ Theme saved: dark` or `✅ Theme saved: light`
- BUT: Still resets on app restart (need to load)

**Test:** Toggle switch, check console

---

### ✅ Task 1.5: Add Load Function

**File:** `app/(tabs)/index.tsx`

**Action:** Add `useEffect` and `loadTheme` function:

```typescript
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
    // ... same JSX
  );
}

// ... same styles
```

**Expected Result:**
- App loads saved theme on startup
- Console shows: `📖 Loaded theme: dark` (or `light` or `null`)
- Theme persists after closing and reopening app ✅

**Test:**
1. Toggle to dark mode
2. Close app completely
3. Reopen app
4. Should open in dark mode ✅

---

## 👤 Phase 2: User Profile (Complex Object Storage)

### ✅ Task 2.1: Create Profile Screen File

```bash
cd app\(tabs)
type nul > profile.tsx
```

**Expected Result:**
- Empty `profile.tsx` file created

---

### ✅ Task 2.2: Basic Structure with Form

**File:** `app/(tabs)/profile.tsx`

**Action:** Add complete basic structure:

```typescript
import { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
          placeholderTextColor="#999"
          keyboardType="numeric"
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
});
```

**Expected Result:**
- Profile screen with two input fields
- Can type in fields

**Test:** Go to "Profile" tab, type in fields

---

### ✅ Task 2.3: Add Save Button

**File:** `app/(tabs)/profile.tsx`

**Action:** Add imports, button, and handleSave function:

```typescript
import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from 'react-native';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!age.trim()) {
      Alert.alert('Error', 'Please enter your age');
      return;
    }

    Alert.alert('Success', 'Saved temporarily');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </Pressable>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
```

**Expected Result:**
- Blue "Save Profile" button appears
- Clicking without data shows error alert
- Clicking with data shows success alert

**Test:**
1. Click save without data → Error alert
2. Enter name and age → Click save → Success alert

---

### ✅ Task 2.4: Add AsyncStorage Save with JSON

**File:** `app/(tabs)/profile.tsx`

**Action:** Import AsyncStorage and update handleSave:

```typescript
import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!age.trim()) {
      Alert.alert('Error', 'Please enter your age');
      return;
    }

    try {
      // 1. Create object
      const user = {
        name: name,
        age: parseInt(age),
      };
      console.log('📦 Object before stringify:', user);

      // 2. Convert object to string
      const jsonValue = JSON.stringify(user);
      console.log('📝 String after stringify:', jsonValue);

      // 3. Save to AsyncStorage
      await AsyncStorage.setItem('@user_profile', jsonValue);
      console.log('✅ Saved to AsyncStorage');

      Alert.alert('Success', 'Profile saved successfully');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  return (
    // ... same JSX
  );
}

// ... same styles
```

**Expected Result:**
- Saves object to AsyncStorage
- Console shows:
  - `📦 Object before stringify: {name: 'John', age: 25}`
  - `📝 String after stringify: '{"name":"John","age":25}'`
  - `✅ Saved to AsyncStorage`

**Test:**
1. Enter name: "John", age: "25"
2. Click save
3. Check console logs

---

### ✅ Task 2.5: Add Load Function

**File:** `app/(tabs)/profile.tsx`

**Action:** Add useEffect and loadProfile:

```typescript
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // 1. Read string from AsyncStorage
      const jsonValue = await AsyncStorage.getItem('@user_profile');
      console.log('📖 Loaded string:', jsonValue);

      // 2. Check if data exists
      if (jsonValue !== null) {
        // 3. Convert string to object
        const user = JSON.parse(jsonValue);
        console.log('📦 Parsed object:', user);

        // 4. Update state
        setName(user.name);
        setAge(user.age.toString());
        console.log('✅ Profile loaded successfully');
      } else {
        console.log('ℹ️ No saved profile found');
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    // ... same as before
  };

  return (
    // ... same JSX
  );
}

// ... same styles
```

**Expected Result:**
- Loads saved profile on app start
- Console shows:
  - `📖 Loaded string: '{"name":"John","age":25}'`
  - `📦 Parsed object: {name: 'John', age: 25}`
  - `✅ Profile loaded successfully`
- Fields populate with saved data

**Test:**
1. Save profile
2. Close app
3. Reopen app
4. Go to Profile tab
5. Fields should show saved data ✅

---

### ✅ Task 2.6: Add Display Section

**File:** `app/(tabs)/profile.tsx`

**Action:** Add display section below form:

```typescript
export default function ProfileScreen() {
  // ... same state and functions

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Enter your age"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </Pressable>
      </View>

      {/* Display saved data */}
      {name && age ? (
        <View style={styles.displayContainer}>
          <Text style={styles.displayTitle}>📋 Saved Data:</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{name}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>{age} years</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.displayContainer}>
          <Text style={styles.emptyText}>No saved data</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  displayContainer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  displayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
```

**Expected Result:**
- Data displays below form in real-time
- Shows "No saved data" when empty
- Shows formatted card with name and age when filled

**Test:**
1. Type in fields → Data appears below
2. Save and reload → Data persists ✅

---

## 🧪 Final Testing Checklist

### Phase 1: Theme Persistence
- [ ] Toggle switch changes background
- [ ] Console shows save message
- [ ] Close and reopen app
- [ ] Theme persists ✅

### Phase 2: Profile Persistence
- [ ] Can type in name and age fields
- [ ] Save button validates empty fields
- [ ] Console shows stringify process
- [ ] Data displays below form
- [ ] Close and reopen app
- [ ] Profile data persists ✅

---

## 📊 Key Concepts Summary

| Concept | Code | Purpose |
|---------|------|---------|
| **Save String** | `AsyncStorage.setItem(key, value)` | Save simple data |
| **Load String** | `AsyncStorage.getItem(key)` | Retrieve simple data |
| **Object → String** | `JSON.stringify(obj)` | Prepare object for storage |
| **String → Object** | `JSON.parse(str)` | Convert back to object |
| **Auto-load** | `useEffect(() => {}, [])` | Load on app start |
| **Error Handling** | `try/catch` | Handle failures |

---

## 🎯 Next Steps

- [ ] Phase 3: Search History (Array management)
- [ ] Phase 4: Auto-save Draft (Real-time persistence)
- [ ] Phase 5: Context API + AsyncStorage

---

## ✅ Project Complete!

You've successfully learned:
- ✅ AsyncStorage basics
- ✅ String storage
- ✅ Object storage with JSON
- ✅ useEffect for loading
- ✅ Error handling
- ✅ Real-world persistence patterns

**Happy Coding! 🚀**
