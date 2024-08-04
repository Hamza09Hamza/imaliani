import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signOut,
    signInWithEmailAndPassword,
    
} from "firebase/auth";
import { DB, auth } from "./Initialisation";
import { setDoc, doc } from "firebase/firestore";
const provider = new GoogleAuthProvider();

auth.useDeviceLanguage();

export const FireSignUp = async (userData) => {
    const userDoc = {
        displayName: userData.displayName,
        Chart: [
            {
                ProductID: "",
                Quantity: 0,
            },
        ],
        Ratings: [""],
        Orders: [""],
        email: userData.email,
        phoneNumber: userData.phoneNumber 
    };
    await setDoc(doc(DB, "Users", auth.currentUser.uid), { ...userDoc });
    
};

const handleUserSignUp = async (userData) => {
    await updateProfile(auth.currentUser, { displayName: userData.firstName + ' ' + userData.lastName });
    console.log("Done Setting Name");

    await sendEmailVerification(auth.currentUser);
    console.log("Verification email sent");

    sessionStorage.setItem('userData', JSON.stringify(
        {
            displayName: userData.firstName+' '+userData.lastName,
            email:userData.email,
            phoneNumber:userData.phoneNumber
        }
    ));

    
    window.location.assign('/verify-email/'+auth.currentUser.uid);

};

export const GoogleSignUp = async () => {
    try {
        console.log("Trying sign up with Google");
        await signInWithPopup(auth, provider);
        console.log("Done in FireAuth");
        await FireSignUp({
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            phoneNumber: auth.currentUser.phoneNumber
        });
        console.log("Done in FireStore");
        localStorage.setItem('UserID', JSON.stringify(auth.currentUser.uid));
        window.location.assign("/")

    } catch (error) {
        console.log(error);
    }
};

export const EmailSignUp = async (userData) => {
    try {
        console.log("Trying sign up with Email & Password");
        await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        console.log("Done in FireAuth");
        console.log(userData.phoneNumber)
        await handleUserSignUp(userData);
        console.log("Done in FireStore");
        return ""
    } catch (error) {
        console.error("Error during Email SignUp:", error);
        if (error.code === 'auth/email-already-in-use') {
            return "An account with this email already exists.";
        } else if (error.code === 'auth/invalid-email') {
            return "The email address is badly formatted.";
        } else if (error.code === 'auth/weak-password') {
            return "The password is too weak.";
        } else {
            return "An unexpected error occurred. Please try again later.";
        }
    }
};

export const  UserSignout =async ()=>{
    try {
        await signOut(auth)
        localStorage.removeItem("UserID")
        sessionStorage.clear();
        window.location.assign("/")

    } catch (error) {
        console.log("Error during  Sign out",error)
    }
}

export const EmailSignIn=async({email,password})=>{
    try {
       await  signInWithEmailAndPassword(auth,email,password)
       localStorage.setItem('UserID', JSON.stringify(auth.currentUser.uid));
       window.location.assign("/")
    } catch (error) {
        console.error("Error during Email SignIn:", error);
        if (error.code === 'auth/user-not-found') {
            return "No account found with this email.";
        } else if (error.code === 'auth/wrong-password') {
            return "Incorrect password. Please try again.";
        } else if (error.code === 'auth/invalid-email') {
            return "The email address is badly formatted.";
        } else {
            return "An unexpected error occurred. Please try again later.";
        }
    }
}
export const GoogleSignIn=async()=>{
    try {
        await signInWithPopup(auth, provider);
        localStorage.setItem('UserID', JSON.stringify(auth.currentUser.uid));

    } catch (error) {
        console.log("Error during Google Sign In",error)

    }
}