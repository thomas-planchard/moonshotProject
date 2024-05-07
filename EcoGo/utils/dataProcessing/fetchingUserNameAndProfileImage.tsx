import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage, getDownloadURL, ref } from "firebase/storage";


export const fetchingUserNameAndProfileImage = () => {
    const [username, setUsername] = useState("");
    const [profileImage , setProfileImage] = useState("");
    useEffect(() => {
    const fetchUserData = async () => {
        const auth = getAuth();
        const db = getFirestore();
        const storage = getStorage();
        const user = auth.currentUser;

        if (user) {
        const userRef = doc(db, 'users', user.uid); // Users collection
        try {
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
            setUsername(userDoc.data().username); // Get the username from the user document
            // get the profile image from the storage
            const profileImageUrl = await getDownloadURL(ref(storage, userDoc.data().profileUrl));
            setProfileImage(profileImageUrl);

            } else {
            console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        }
    };

    fetchUserData();
    }, []);
    return {username, profileImage};
}