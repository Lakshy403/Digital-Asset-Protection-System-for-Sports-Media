/* eslint-disable react-refresh/only-export-components */
import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { auth } from '../firebase';

const AuthContext = createContext(null);

function getAuthPersistence(rememberMe) {
  return rememberMe ? browserLocalPersistence : browserSessionPersistence;
}

function normalizeAuthError(error) {
  const code = error?.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists for this email address.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'The email or password is incorrect.';
    case 'auth/weak-password':
      return 'Choose a stronger password with at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts were made. Please wait and try again.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(() => Boolean(auth));

  useEffect(() => {
    if (!auth) {
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      authLoading,
      async login({ email, password, rememberMe }) {
        if (!auth) {
          throw new Error('Firebase Auth is not initialized.');
        }

        await setPersistence(auth, getAuthPersistence(rememberMe));
        return signInWithEmailAndPassword(auth, email, password);
      },
      async signup({ name, email, password, rememberMe }) {
        if (!auth) {
          throw new Error('Firebase Auth is not initialized.');
        }

        await setPersistence(auth, getAuthPersistence(rememberMe));
        const credential = await createUserWithEmailAndPassword(auth, email, password);

        if (name?.trim()) {
          await updateProfile(credential.user, {
            displayName: name.trim(),
          });
          setCurrentUser(credential.user);
        }

        return credential;
      },
      async forgotPassword(email) {
        if (!auth) {
          throw new Error('Firebase Auth is not initialized.');
        }

        return sendPasswordResetEmail(auth, email);
      },
      async logout() {
        if (!auth) {
          return;
        }

        return signOut(auth);
      },
      normalizeAuthError,
    }),
    [authLoading, currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
