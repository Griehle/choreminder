import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { storageService } from '@/services/storage';
import { generateAssignments, getTodayDate, formatDate } from '@/services/assignmentService';
import { FamilyMember, Chore, DailyAssignments } from '@/types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [todayAssignments, setTodayAssignments] = useState<DailyAssignments | null>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    const members = await storageService.getFamilyMembers();
    const choresList = await storageService.getChores();
    const allAssignments = await storageService.getAssignments();
    
    setFamilyMembers(members);
    setChores(choresList);

    const today = getTodayDate();
    const existingToday = allAssignments.find(a => a.date === today);
    
    setTodayAssignments(existingToday || null);
    setLoading(false);
  };

  const handleGenerateAssignments = async () => {
    if (familyMembers.length === 0) {
      Alert.alert('No Family Members', 'Please add family members first.');
      return;
    }
    if (chores.length === 0) {
      Alert.alert('No Chores', 'Please add chores first.');
      return;
    }

    const today = getTodayDate();
    const newAssignments = generateAssignments(familyMembers, chores, today);
    
    const allAssignments = await storageService.getAssignments();
    const filtered = allAssignments.filter(a => a.date !== today);
    filtered.push(newAssignments);
    
    await storageService.saveAssignments(filtered);
    setTodayAssignments(newAssignments);
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
        <ThemedText type="title">Chore Assignments</ThemedText>
        <ThemedText style={styles.date}>{formatDate(getTodayDate())}</ThemedText>
      </ThemedView>

      {familyMembers.length === 0 || chores.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>👋 Welcome to Chore Manager!</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            {familyMembers.length === 0 && 'Add family members in the Family tab.'}
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            {chores.length === 0 && 'Add chores in the Chores tab.'}
          </ThemedText>
        </ThemedView>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={handleGenerateAssignments}
          >
            <Text style={styles.buttonText}>
              {todayAssignments ? '🔄 Regenerate Assignments' : '✨ Generate Today\'s Assignments'}
            </Text>
          </TouchableOpacity>

          {todayAssignments && (
            <ThemedView style={styles.assignmentsList}>
              {todayAssignments.assignments.map((assignment) => (
                <View
                  key={assignment.id}
                  style={[
                    styles.assignmentCard,
                    { 
                      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
                      borderLeftColor: assignment.isDayOff ? '#4CAF50' : colors.tint,
                    }
                  ]}
                >
                  <ThemedText style={styles.memberName}>{assignment.familyMemberName}</ThemedText>
                  <ThemedText style={styles.choreAssignment}>
                    {assignment.isDayOff ? '🎉 Day Off!' : `📋 ${assignment.choreName}`}
                  </ThemedText>
                </View>
              ))}
            </ThemedView>
          )}
        </>
      )}

      <ThemedView style={styles.stats}>
        <ThemedText style={styles.statsText}>👨‍👩‍👧‍👦 {familyMembers.length} Family Members</ThemedText>
        <ThemedText style={styles.statsText}>✅ {chores.length} Chores</ThemedText>
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
  date: {
    fontSize: 14,
    marginTop: 5,
    opacity: 0.7,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  assignmentsList: {
    gap: 12,
  },
  assignmentCard: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  choreAssignment: {
    fontSize: 16,
    opacity: 0.8,
  },
  stats: {
    marginTop: 30,
    padding: 20,
    gap: 10,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
