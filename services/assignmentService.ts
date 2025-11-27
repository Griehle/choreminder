import { FamilyMember, Chore, Assignment, DailyAssignments } from '@/types';

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates random assignments for the given date
 * Each family member gets either a chore or a day off
 * @param familyMembers - List of family members
 * @param chores - List of available chores
 * @param date - Date string in YYYY-MM-DD format
 * @returns DailyAssignments object with assignments for each family member
 */
export function generateAssignments(
  familyMembers: FamilyMember[],
  chores: Chore[],
  date: string
): DailyAssignments {
  if (familyMembers.length === 0) {
    return { date, assignments: [] };
  }

  // Shuffle family members for random order
  const shuffledMembers = shuffleArray(familyMembers);
  
  // Create a pool: chores + "day off" entries
  // Add at least one "day off" option, and more based on ratio
  const dayOffCount = Math.max(1, Math.ceil(familyMembers.length * 0.3));
  const chorePool = [...chores];
  
  // If we have more family members than chores + day offs, we need to allow repeats
  const totalSlots = familyMembers.length;
  const availableSlots = chorePool.length + dayOffCount;
  
  // Build the assignment pool
  let assignmentPool: (Chore | null)[] = [];
  
  if (availableSlots >= totalSlots) {
    // We have enough slots, just shuffle and take what we need
    const dayOffs: null[] = Array(dayOffCount).fill(null);
    assignmentPool = shuffleArray([...chorePool, ...dayOffs]).slice(0, totalSlots);
  } else {
    // Need to repeat some chores
    assignmentPool = shuffleArray([...chorePool, ...Array(dayOffCount).fill(null)]);
    
    // Add random chores until we have enough
    while (assignmentPool.length < totalSlots) {
      const randomChore = chorePool[Math.floor(Math.random() * chorePool.length)];
      assignmentPool.push(randomChore);
    }
    
    // Shuffle again to mix the repeated chores
    assignmentPool = shuffleArray(assignmentPool);
  }

  // Create assignments
  const assignments: Assignment[] = shuffledMembers.map((member, index) => {
    const assignment = assignmentPool[index];
    const isDayOff = assignment === null;

    return {
      id: `${date}-${member.id}`,
      familyMemberId: member.id,
      familyMemberName: member.name,
      choreId: isDayOff ? null : assignment.id,
      choreName: isDayOff ? null : assignment.name,
      date,
      isDayOff,
    };
  });

  return { date, assignments };
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Formats date string to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
