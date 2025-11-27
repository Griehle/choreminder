import { StyleSheet, ScrollView, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { storageService } from '@/services/storage';
import { Chore } from '@/types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ChoresScreen() {
  const [chores, setChores] = useState<Chore[]>([]);
  const [newChoreName, setNewChoreName] = useState('');
  const [newChoreDescription, setNewChoreDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingChoreId, setEditingChoreId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useFocusEffect(
    useCallback(() => {
      loadChores();
    }, [])
  );

  const loadChores = async () => {
    setLoading(true);
    const choresList = await storageService.getChores();
    setChores(choresList);
    setLoading(false);
  };

  const handleAddChore = async () => {
    if (!newChoreName.trim()) {
      Alert.alert('Error', 'Please enter a chore name');
      return;
    }

    const newChore: Chore = {
      id: Date.now().toString(),
      name: newChoreName.trim(),
      description: newChoreDescription.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedChores = [...chores, newChore];
    await storageService.saveChores(updatedChores);
    setChores(updatedChores);
    setNewChoreName('');
    setNewChoreDescription('');
  };

  const handleDeleteChore = (id: string, name: string) => {
    Alert.alert(
      'Delete Chore',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedChores = chores.filter((c) => c.id !== id);
              await storageService.saveChores(updatedChores);
              setChores(updatedChores);
            } catch (e) {
              console.error('Failed to delete chore', e);
              Alert.alert('Error', 'Failed to delete chore. Please try again.');
            }
          },
        },
      ]
    );
  };

  const startEditChore = (chore: Chore) => {
    setEditingChoreId(chore.id);
    setEditName(chore.name);
    setEditDescription(chore.description ?? '');
  };

  const cancelEditChore = () => {
    setEditingChoreId(null);
    setEditName('');
    setEditDescription('');
  };

  const saveEditChore = async () => {
    if (!editingChoreId) return;
    const name = editName.trim();
    if (!name) {
      Alert.alert('Error', 'Please enter a chore name');
      return;
    }
    const updatedChores = chores.map((c) =>
      c.id === editingChoreId
        ? { ...c, name, description: editDescription.trim() || undefined }
        : c
    );
    await storageService.saveChores(updatedChores);
    setChores(updatedChores);
    cancelEditChore();
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Chores</ThemedText>
        <ThemedText style={styles.subtitle}>
          Manage the chores that will be assigned to family members
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
              color: colorScheme === 'dark' ? '#fff' : '#000',
            },
          ]}
          placeholder="Chore name (e.g., Wash dishes)"
          placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
          value={newChoreName}
          onChangeText={setNewChoreName}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
              color: colorScheme === 'dark' ? '#fff' : '#000',
            },
          ]}
          placeholder="Description (optional)"
          placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
          value={newChoreDescription}
          onChangeText={setNewChoreDescription}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={handleAddChore}
        >
          <Text style={styles.addButtonText}>+ Add Chore</Text>
        </TouchableOpacity>
      </ThemedView>

      {chores.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>📋 No chores yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Add chores to assign to family members
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.choresList}>
          {chores.map((chore) => (
            <View
              key={chore.id}
              style={[
                styles.choreCard,
                { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5' },
              ]}
            >
              <View style={styles.choreInfo}>
                {editingChoreId === chore.id ? (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colorScheme === 'dark' ? '#111' : '#eee',
                          color: colorScheme === 'dark' ? '#fff' : '#000',
                          marginBottom: 8,
                        },
                      ]}
                      placeholder="Chore name"
                      placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
                      value={editName}
                      onChangeText={setEditName}
                    />
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colorScheme === 'dark' ? '#111' : '#eee',
                          color: colorScheme === 'dark' ? '#fff' : '#000',
                          marginBottom: 8,
                        },
                      ]}
                      placeholder="Description (optional)"
                      placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
                      value={editDescription}
                      onChangeText={setEditDescription}
                    />
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.tint }]}
                        onPress={saveEditChore}
                        accessibilityLabel="Save chore"
                        testID={`save-chore-${chore.id}`}
                      >
                        <Text style={styles.actionButtonText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#888' }]}
                        onPress={cancelEditChore}
                        accessibilityLabel="Cancel edit"
                        testID={`cancel-edit-chore-${chore.id}`}
                      >
                        <Text style={styles.actionButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View>
                    <ThemedText style={styles.choreName}>{chore.name}</ThemedText>
                    {chore.description && (
                      <ThemedText style={styles.choreDescription}>{chore.description}</ThemedText>
                    )}
                    <ThemedText style={styles.choreDate}>
                      Added {new Date(chore.createdAt).toLocaleDateString()}
                    </ThemedText>
                  </View>
                )}
              </View>
              <View style={styles.actions}>
                {editingChoreId !== chore.id && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => startEditChore(chore)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${chore.name}`}
                    testID={`edit-chore-${chore.id}`}
                  >
                    <Text style={styles.actionIcon}>✏️</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteChore(chore.id, chore.name)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${chore.name}`}
                  testID={`delete-chore-${chore.id}`}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ThemedView>
      )}

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Total: {chores.length} {chores.length === 1 ? 'chore' : 'chores'}
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
    opacity: 0.7,
  },
  inputContainer: {
    gap: 10,
    marginBottom: 20,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  choresList: {
    gap: 12,
  },
  choreCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  choreInfo: {
    flex: 1,
  },
  choreName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  choreDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  choreDate: {
    fontSize: 14,
    opacity: 0.6,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 24,
  },
  editButton: {
    padding: 8,
    marginRight: 4,
  },
  actionIcon: {
    fontSize: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
