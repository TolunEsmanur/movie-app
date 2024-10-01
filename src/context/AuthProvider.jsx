import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../auth/firebase'
import { useNavigate } from 'react-router-dom'
import { toastErrorNotify, toastSuccessNotify, toastWarnNotify } from '../helpers/ToastNotify'

export const AuthContext = createContext()

//Custom Hook ile kullanım:
export const useAuthContext =()=>{
    return useContext(AuthContext)

    
}

const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        userObserver();
    }, [])

const createUser = async(email,password,displayName)=>{
    try {
        //yeni bir kullanıcı oluşturmak için kullanılan firebase metodu
    let userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(auth.currentUser, {
        displayName,
        // displayName:displayName
      });

    


    navigate("/")
    toastSuccessNotify("Registered successfully");
    
    } catch (error) {
        console.log(error);
        toastErrorNotify(error.message);
        
    }
}


const signIn = async(email,password)=>{
    try {
        //mevcut kullanıcının girişi için kullanılan firebase metodu
    let userCredential = await signInWithEmailAndPassword (auth, email, password)

    navigate("/")
    toastSuccessNotify("Loged in successfully");
    
    } catch (error) {
        console.log(error);
        toastErrorNotify(error.message);
        
    }
};

const logOut = ()=>{
    signOut(auth).then(() => {
        // Sign-out successful.
        toastSuccessNotify("Logged out succesfully")
      }).catch((error) => {
        // An error happened.
        toastErrorNotify("error.message")
      });
}

const userObserver = ()=>{
    //kullanıcın sign in olup olmadığını takip eden ve kullanıcı değiştiğinde yeni kullanıcıyı response olarak dönen firebase metodu
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const {email,displayName,photoURL} =user
          setCurrentUser({email,displayName,photoURL})
        } else {
          // User is signed out
          setCurrentUser(false)
        }
      });
}

const googleProvider = ()=>{
  //google ile giriş yapılması için kullanılan firebase metodu
  const provider = new GoogleAuthProvider();
  //açılır pencere ile giriş yapılması için kullanılan firebase metodu
  signInWithPopup(auth, provider)
  .then((result) => {
    console.log(result);
    navigate("/")
    toastSuccessNotify("Logged in successfully")
  }).catch((error) => {
    // Handle Errors here.
    console.log(error);
    toastErrorNotify(error.message)
    
  });
}

const forgotPassword =(email)=>{
  //email ylu ile şifre sıfırlama için kullanılan firebase metodu
  sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent!
    // ..
    toastWarnNotify("please check your mail box")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
    toastErrorNotify(error.message)
  });
}



console.log(currentUser);
const values = {currentUser,createUser,signIn,logOut,googleProvider,forgotPassword}
return (
  <AuthContext.Provider value={values}>
    {children}
  </AuthContext.Provider>
  )
}

export default AuthProvider 
