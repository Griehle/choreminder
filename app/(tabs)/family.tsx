import { StyleSheet, ScrollView, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { storageService } from '@/services/storage';
import { FamilyMember } from '@/types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function FamilyScreen() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useFocusEffect(
    useCallback(() => {
      loadMembers();
    }, [])
  );

  const loadMembers = async () => {
    setLoading(true);
    const members = await storageService.getFamilyMembers();
    setFamilyMembers(members);
    setLoading(false);
  };

  const handleAddMember = async () => {
    if (!newMemberName.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedMembers = [...familyMembers, newMember];
    await storageService.saveFamilyMembers(updatedMembers);
    setFamilyMembers(updatedMembers);
    setNewMemberName('');
  };

  const handleDeleteMember = (id: string, name: string) => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedMembers = familyMembers.filter(m => m.id !== id);
            await storageService.saveFamilyMembers(updatedMembers);
            setFamilyMembers(updatedMembers);
          },
        },
      ]
    );
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
        <ThemedText type="title">Family Members</ThemedText>
        <ThemedText style={styles.subtitle}>
          Manage your family members who will be assigned chores
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
          placeholder="Enter family member name"
          placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
          value={newMemberName}
          onChangeText={setNewMemberName}
          onSubmitEditing={handleAddMember}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={handleAddMember}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </ThemedView>

      {familyMembers.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>👥 No family members yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Add family members to start assigning chores
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.membersList}>
          {familyMembers.map((member) => (
            <View
              key={member.id}
              style={[
                styles.memberCard,
                { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5' },
              ]}
            >
              <View style={styles.memberInfo}>
                <ThemedText style={styles.memberName}>{member.name}</ThemedText>
                <ThemedText style={styles.memberDate}>
                  Added {new Date(member.createdAt).toLocaleDateString()}
                </ThemedText>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteMember(member.id, member.name)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ThemedView>
      )}

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Total: {familyMembers.length} {familyMembers.length === 1 ? 'member' : 'members'}
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
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
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
  membersList: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberDate: {
    fontSize: 14,
    opacity: 0.6,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 24,
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
