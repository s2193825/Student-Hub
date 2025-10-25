export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  // FIX: Add optional password to align with mock data
  password?: string;
  // Student-specific
  grade?: number;
  studentId?: string;
  enrollmentDate?: string;
  loginStreak?: number;
  achievements?: Achievement[];
  // Teacher-specific
  subject?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: 'Trophy' | 'Star' | 'Target';
}

export type StudentAssignmentStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Graded' | 'Late' | 'Missing';

export interface StudentAssignment {
  id: string;
  studentId: string;
  masterAssignmentId: string;
  title: string;
  subject: string;
  instructions: string;
  dueDate: string;
  status: StudentAssignmentStatus;
  grade: string | null;
  feedback: string | null;
  submittedAt: string | null;
  isExempt: boolean;
  exemptionReason: string | null;
}

export interface MasterAssignment {
  id: string;
  teacherId: string;
  title: string;
  subject: string;
  instructions: string;
  dueDate: string;
  assignedStudentIds: string[];
  assignedStudentCount?: number;
}

export interface Message {
  id: string;
  sender: 'student' | string; // 'student' or teacher's id
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  teacherId: string;
  messages: Message[];
}

export interface ForumReply {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  upvotes: number;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  timestamp: string;
  tags: string[];
  replies: ForumReply[];
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

export interface Activity {
  id: string;
  type: 'assignment' | 'grade' | 'forum';
  description: string;
  timestamp: string;
}