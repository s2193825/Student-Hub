import { User, MasterAssignment, StudentAssignment, ForumPost, Conversation, UserRole } from '../types';
import { TOTAL_STUDENT_COUNT, TOTAL_TEACHER_COUNT } from '../constants';

// --- MOCK DATABASE ---
const db: {
    users: User[],
    masterAssignments: Omit<MasterAssignment, 'assignedStudentCount'>[],
    studentAssignments: StudentAssignment[],
    forumPosts: ForumPost[],
    conversations: Conversation[],
} = {
    users: [],
    masterAssignments: [],
    studentAssignments: [],
    forumPosts: [],
    conversations: [],
};

// --- REALISTIC NAME GENERATION ---
const firstNames = ["Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Charlotte", "William", "Sophia", "James", "Amelia", "Benjamin", "Isabella", "Lucas", "Mia", "Henry", "Evelyn", "Alexander", "Harper"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

const generateRandomName = () => `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;


// --- INITIALIZE USERS ---
const initialUsers: User[] = [
    // Multi-role Aryan Sharma Account
    { id: 'user-student-aryan', name: 'Aryan Sharma', email: 'aryan.s@school.edu', password: '1234', role: 'student', avatarUrl: 'https://i.imgur.com/8b20GzT.png', grade: 7, studentId: 'S78901', enrollmentDate: '2022-08-15', loginStreak: 23, achievements: [{id: 'ach-1', name: 'Perfect Score', description: 'Got 100% on a test', icon: 'Trophy'}, {id: 'ach-2', name: 'Helping Hand', description: 'Answered 5 forum posts', icon: 'Star'}]},
    { id: 'user-teacher-aryan', name: 'Aryan Sharma', email: 'aryan.s@school.edu', password: '1234', role: 'teacher', avatarUrl: 'https://i.imgur.com/8b20GzT.png', subject: 'History' },
    { id: 'user-admin-aryan', name: 'Aryan Sharma', email: 'aryan.s@school.edu', password: '1234', role: 'admin', avatarUrl: 'https://i.imgur.com/8b20GzT.png' },
    
    // Standard Accounts
    { id: 'user-admin-1', name: 'Jane Doe', email: 'admin@test.com', password: 'password', role: 'admin', avatarUrl: 'https://i.pravatar.cc/150?u=admin' },
    { id: 'user-teacher-1', name: 'John Smith', email: 'teacher@test.com', password: 'password', role: 'teacher', avatarUrl: 'https://i.pravatar.cc/150?u=teacher', subject: 'History' },
];

db.users = [...initialUsers];

// Generate a larger pool of sample students
const sampleStudents: User[] = Array.from({ length: 100 }, (_, i) => {
    const name = generateRandomName();
    const id = `user-student-${i + 1}`;
    return {
        id,
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@school.edu`,
        password: 'password',
        role: 'student',
        avatarUrl: `https://i.pravatar.cc/150?u=${id}`,
        grade: 7,
        studentId: `S${10000 + i}`,
        enrollmentDate: '2022-09-01',
        loginStreak: Math.floor(Math.random() * 30),
        achievements: [],
    }
});

db.users.push(...sampleStudents);

// --- INITIALIZE ASSIGNMENTS ---
db.masterAssignments = [
    // FIX: Removed assignedStudentCount property to align with the Omit type definition. The value was also incorrect.
    { id: 'ma-1', teacherId: 'user-teacher-aryan', title: 'The Roman Empire', subject: 'History', instructions: 'Write a 5-page essay on the rise and fall of the Roman Empire.', dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), assignedStudentIds: ['user-student-aryan', ...sampleStudents.slice(0, 50).map(s => s.id)] },
    { id: 'ma-2', teacherId: 'user-teacher-1', title: 'World War II Causes', subject: 'History', instructions: 'Create a presentation on the main causes of World War II.', dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), assignedStudentIds: ['user-student-aryan', ...sampleStudents.slice(50, 100).map(s => s.id)] },
];

db.studentAssignments = db.masterAssignments.flatMap(ma =>
    ma.assignedStudentIds.map(studentId => {
        const student = db.users.find(u => u.id === studentId);
        if (!student) return null;

        let status: StudentAssignment['status'] = 'Not Started';
        let grade = null;
        let feedback = null;
        if(student.id === 'user-student-aryan' && ma.id === 'ma-2') {
            status = 'Graded';
            grade = 'A+';
            feedback = `Excellent work, Aryan! Your presentation was well-researched and clearly presented. One of the best I've seen.`;
        }

        // FIX: Explicitly type the object to satisfy the type guard in .filter()
        const assignment: StudentAssignment = {
            id: `sa-${ma.id}-${student.id}`,
            studentId: student.id,
            masterAssignmentId: ma.id,
            title: ma.title,
            subject: ma.subject,
            instructions: ma.instructions,
            dueDate: ma.dueDate,
            status,
            grade,
            feedback,
            submittedAt: null,
            isExempt: false,
            exemptionReason: null,
        };
        return assignment;
    }).filter((item): item is StudentAssignment => item !== null)
);


// --- API SIMULATION ---
export const mockApi = {
    authenticate: async (email: string, password: string): Promise<User[]> => {
        await new Promise(res => setTimeout(res, 500));
        const matchingUsers = db.users.filter(u => u.email === email && u.password === password);
        return matchingUsers;
    },

    getData: async (userId: string, role: UserRole) => {
        await new Promise(res => setTimeout(res, 1000));
        const user = db.users.find(u => u.id === userId);
        if (!user) throw new Error("User not found");
    
        let dataPackage: any = {
            user,
            users: [],
            students: [],
            teachers: [],
            studentAssignments: [],
            masterAssignments: [],
            forumPosts: db.forumPosts,
            conversations: db.conversations,
        };
    
        if (role === 'admin') {
            dataPackage.users = db.users;
        } else if (role === 'teacher') {
            dataPackage.students = db.users.filter(u => u.role === 'student');
            dataPackage.masterAssignments = db.masterAssignments.filter(ma => ma.teacherId === userId);
            dataPackage.studentAssignments = db.studentAssignments.filter(sa => dataPackage.masterAssignments.some((ma: MasterAssignment) => ma.id === sa.masterAssignmentId));
        } else if (role === 'student') {
            dataPackage.studentAssignments = db.studentAssignments.filter(sa => sa.studentId === userId);
            dataPackage.teachers = db.users.filter(u => u.role === 'teacher');
        }
    
        return dataPackage;
    },

    addUser: async (userData: Omit<User, 'id'>): Promise<User> => {
        await new Promise(res => setTimeout(res, 500));
        if (db.users.some(u => u.email === userData.email)) {
            throw new Error("Email already exists");
        }
        const newUser: User = {
            id: `user-${Date.now()}`,
            ...userData,
            password: 'password', // Default password for admin-created users
        };
        db.users.push(newUser);
        return newUser;
    },

    updateUser: async (userData: User): Promise<User> => {
        await new Promise(res => setTimeout(res, 500));
        const index = db.users.findIndex(u => u.id === userData.id);
        if (index === -1) throw new Error("User not found");
        db.users[index] = { ...db.users[index], ...userData };
        return db.users[index];
    },

    deleteUser: async (userId: string): Promise<void> => {
        await new Promise(res => setTimeout(res, 500));
        const originalLength = db.users.length;
        db.users = db.users.filter(u => u.id !== userId);
        if (db.users.length === originalLength) {
            // To prevent silent failures if user not found, though UI should prevent this.
            throw new Error("User not found for deletion");
        }
    },
    
    // Other API methods...
    updateForumPost: async (post: ForumPost) => { /* ... */ },
    createMasterAssignment: async (data: Omit<MasterAssignment, 'id'>) => { /* ... */ },
    gradeStudentAssignment: async (id: string, grade: string, feedback: string | null) => { 
         const assignment = db.studentAssignments.find(sa => sa.id === id);
         if(assignment){
             assignment.grade = grade;
             assignment.feedback = feedback;
             assignment.status = 'Graded';
             return assignment;
         }
         throw new Error("Assignment not found");
    },
    exemptStudentAssignment: async (id: string, reason: string) => {
        const assignment = db.studentAssignments.find(sa => sa.id === id);
         if(assignment){
             assignment.isExempt = true;
             assignment.exemptionReason = reason;
             return assignment;
         }
         throw new Error("Assignment not found");
    },
};