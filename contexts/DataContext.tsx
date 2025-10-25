import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User, StudentAssignment, MasterAssignment, ForumPost, Conversation } from '../types';
import { useAuth } from './AuthContext';
import { mockApi } from '../services/mockApi';
import { TOTAL_STUDENT_COUNT, TOTAL_TEACHER_COUNT } from '../constants';

interface DataContextState {
    user: User | null;
    users: User[];
    students: User[];
    teachers: User[];
    assignments: StudentAssignment[];
    studentAssignments: StudentAssignment[];
    masterAssignments: MasterAssignment[];
    forumPosts: ForumPost[];
    conversations: Conversation[];
    loading: boolean;
    totalStudentCount: number;
    totalTeacherCount: number;
    updateForumPost: (post: ForumPost, optimistic?: boolean) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    addUser: (userData: Omit<User, 'id'>) => Promise<void>;
    updateUser: (userData: User) => Promise<void>;
    createMasterAssignment: (data: Omit<MasterAssignment, 'id'>) => Promise<void>;
    gradeStudentAssignment: (id: string, grade: string, feedback: string | null) => Promise<void>;
    exemptStudentAssignment: (id: string, reason: string) => Promise<void>;
}

const DataContext = createContext<DataContextState | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [students, setStudents] = useState<User[]>([]);
    const [teachers, setTeachers] = useState<User[]>([]);
    const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
    const [studentAssignments, setStudentAssignments] = useState<StudentAssignment[]>([]);
    const [masterAssignments, setMasterAssignments] = useState<MasterAssignment[]>([]);
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    
    const fetchData = useCallback(async () => {
        if (!authUser) return;
        setLoading(true);
        try {
            const data = await mockApi.getData(authUser.id, authUser.role);
            setUser(data.user);
            setUsers(data.users);
            setStudents(data.students);
            setTeachers(data.teachers);
            setAssignments(data.studentAssignments); // For student view
            setStudentAssignments(data.studentAssignments); // For teacher view
            setMasterAssignments(data.masterAssignments);
            setForumPosts(data.forumPosts);
            setConversations(data.conversations);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, [authUser]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateForumPost = async (post: ForumPost, optimistic = false) => {
        if (optimistic) {
            setForumPosts(prev => prev.map(p => p.id === post.id ? post : p));
        }
        await mockApi.updateForumPost(post);
        if (!optimistic) {
            setForumPosts(prev => prev.map(p => p.id === post.id ? post : p));
        }
    };
    
    const deleteUser = async (userId: string) => {
        await mockApi.deleteUser(userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const addUser = async (userData: Omit<User, 'id'>) => {
        const newUser = await mockApi.addUser(userData);
        setUsers(prev => [...prev, newUser]);
    };

    const updateUser = async (userData: User) => {
        const updatedUser = await mockApi.updateUser(userData);
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };
    
    const createMasterAssignment = async (data: Omit<MasterAssignment, 'id'>) => {
        await mockApi.createMasterAssignment(data);
        fetchData(); // Refetch all data to get new assignments
    };

    const gradeStudentAssignment = async (id: string, grade: string, feedback: string | null) => {
        const updated = await mockApi.gradeStudentAssignment(id, grade, feedback);
        setStudentAssignments(prev => prev.map(sa => sa.id === id ? updated : sa));
    };
    
    const exemptStudentAssignment = async (id: string, reason: string) => {
        const updated = await mockApi.exemptStudentAssignment(id, reason);
        setStudentAssignments(prev => prev.map(sa => sa.id === id ? updated : sa));
    };

    const value: DataContextState = {
        user,
        users,
        students,
        teachers,
        assignments,
        studentAssignments,
        masterAssignments,
        forumPosts,
        conversations,
        loading,
        totalStudentCount: TOTAL_STUDENT_COUNT,
        totalTeacherCount: TOTAL_TEACHER_COUNT,
        updateForumPost,
        deleteUser,
        addUser,
        updateUser,
        createMasterAssignment,
        gradeStudentAssignment,
        exemptStudentAssignment,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextState => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
