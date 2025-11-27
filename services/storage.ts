import AsyncStorage from '@react-native-async-storage/async-storage';
import { FamilyMember, Chore, DailyAssignments } from '@/types';

const KEYS = {
  FAMILY_MEMBERS: '@family_members',
  CHORES: '@chores',
  ASSIGNMENTS: '@assignments',
};

export const storageService = {
  // Family Members
  async getFamilyMembers(): Promise<FamilyMember[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.FAMILY_MEMBERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading family members:', error);
      return [];
    }
  },

  async saveFamilyMembers(members: FamilyMember[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.FAMILY_MEMBERS, JSON.stringify(members));
    } catch (error) {
      console.error('Error saving family members:', error);
    }
  },

  // Chores
  async getChores(): Promise<Chore[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CHORES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading chores:', error);
      return [];
    }
  },

  async saveChores(chores: Chore[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CHORES, JSON.stringify(chores));
    } catch (error) {
      console.error('Error saving chores:', error);
    }
  },

  // Assignments
  async getAssignments(): Promise<DailyAssignments[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.ASSIGNMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading assignments:', error);
      return [];
    }
  },

  async saveAssignments(assignments: DailyAssignments[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    } catch (error) {
      console.error('Error saving assignments:', error);
    }
  },
};
