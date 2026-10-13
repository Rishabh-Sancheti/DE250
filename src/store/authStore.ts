import { create } from 'zustand';
import { StudentProfile } from '../types';

interface AuthState {
  currentRole: 'student' | 'staff' | null;
  studentProfile: StudentProfile | null;
  isStudentAuthenticated: boolean;
  isStaffAuthenticated: boolean;
  demoOtp: string;
  
  // Actions
  loginStudent: (profile: StudentProfile) => void;
  loginStaff: () => void;
  logout: () => void;
  switchRole: (role: 'student' | 'staff') => void;
}

const AUTH_STORAGE_KEY = 'replate_auth_v1';

const getInitialState = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse auth from localStorage', err);
  }
  return {
    currentRole: null,
    studentProfile: null,
    isStudentAuthenticated: false,
    isStaffAuthenticated: false,
  };
};

export const useAuthStore = create<AuthState>((set, get) => {
  const initial = getInitialState();

  const persist = (data: Partial<AuthState>) => {
    try {
      const current = get();
      const updated = {
        currentRole: data.currentRole !== undefined ? data.currentRole : current.currentRole,
        studentProfile: data.studentProfile !== undefined ? data.studentProfile : current.studentProfile,
        isStudentAuthenticated: data.isStudentAuthenticated !== undefined ? data.isStudentAuthenticated : current.isStudentAuthenticated,
        isStaffAuthenticated: data.isStaffAuthenticated !== undefined ? data.isStaffAuthenticated : current.isStaffAuthenticated,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist auth', e);
    }
  };

  return {
    currentRole: initial.currentRole,
    studentProfile: initial.studentProfile,
    isStudentAuthenticated: initial.isStudentAuthenticated,
    isStaffAuthenticated: initial.isStaffAuthenticated,
    demoOtp: '123456',

    loginStudent: (profile: StudentProfile) => {
      const update = {
        currentRole: 'student' as const,
        studentProfile: profile,
        isStudentAuthenticated: true,
      };
      set(update);
      persist(update);
    },

    loginStaff: () => {
      const update = {
        currentRole: 'staff' as const,
        isStaffAuthenticated: true,
      };
      set(update);
      persist(update);
    },

    logout: () => {
      const reset = {
        currentRole: null,
        studentProfile: null,
        isStudentAuthenticated: false,
        isStaffAuthenticated: false,
      };
      set(reset);
      persist(reset);
    },

    switchRole: (role: 'student' | 'staff') => {
      if (role === 'staff') {
        const update = { currentRole: 'staff' as const, isStaffAuthenticated: true };
        set(update);
        persist(update);
      } else {
        // If switching to student without profile, set a default demo student profile
        const currentProfile = get().studentProfile || {
          name: 'Rohan Sharma',
          hostelNumber: 'Hostel 4, Room 302',
          phoneNumber: '9876543210',
        };
        const update = {
          currentRole: 'student' as const,
          studentProfile: currentProfile,
          isStudentAuthenticated: true,
        };
        set(update);
        persist(update);
      }
    },
  };
});
