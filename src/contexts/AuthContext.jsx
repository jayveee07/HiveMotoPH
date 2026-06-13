import { createContext, useContext, useEffect, useState, useRef } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider, facebookProvider } from '../lib/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function createUserProfile(user, additionalData = {}) {
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const profile = {
        uid: user.uid,
        email: user.email,
        displayName: additionalData.displayName || user.displayName || '',
        phone: additionalData.phone || '',
        role: 'customer',
        shippingAddresses: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        loyaltyPoints: 0,
        avatar: user.photoURL || '',
      }
      await setDoc(userRef, profile)
      return profile
    }
    return userSnap.data()
  }

  async function register(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    await createUserProfile(result.user, { displayName })
    return result
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function setOnLogout(cb) { onLogoutRef.current = cb }
  function setOnAdminLogin(cb) { onAdminLoginRef.current = cb }

  async function logout() {
    setUserProfile(null)
    await signOut(auth)
    onLogoutRef.current?.()
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    await createUserProfile(result.user)
    return result
  }

  async function signInWithFacebook() {
    const result = await signInWithPopup(auth, facebookProvider)
    await createUserProfile(result.user)
    return result
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          const profile = userSnap.data()
          setUserProfile(profile)
          if (profile.role === 'admin') onAdminLoginRef.current?.()
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    signInWithFacebook,
    createUserProfile,
    setOnLogout,
    setOnAdminLogin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
