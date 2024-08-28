import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import { storage, db } from "../FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

// Hashing function to create a unique identifier based on a string
const hashage = (str: string): number => {
    let hash = 0;
    if (!str || str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash &= hash; // Convert to 32-bit integer
    }
    return hash;
}

// Generate the path for storing user images
export const generateImagePath = (uid: string): string => {
    return `images/user/${hashage(uid)}.jpg`;
}



// Upload an image to Firebase Storage and return the download URL
const uploadImage = async (
    uri: string,
    path: string,
    timeoutDuration: number,
    setProgress?: (value: number) => void
): Promise<string> => {
    const fetchResponse = await fetch(uri);
    const blob = await fetchResponse.blob();
    const imageRef = ref(storage, path);

    const uploadTask = uploadBytesResumable(imageRef, blob);

    return new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Your connection is too slow to upload the image"));
        }, timeoutDuration);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (setProgress) {
                    setProgress(progress);
                }
            },
            (error) => {
                clearTimeout(timeout);
                console.error("Upload error:", error);
                reject(error);
            },
            async () => {
                clearTimeout(timeout);
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    console.error("Error getting download URL:", error);
                    reject(error);
                }
            }
        );
    });
}

// Upload image to Firebase Storage
export const uploadImageToFirebase = async (uri: string, path: string): Promise<string> => {
    return await uploadImage(uri, path, 10000); // 10 seconds timeout
}



// Update user's profile image in Firebase Storage and Firestore
export const updateImageToFirebase = async (
    uri: string,
    path: string,
    uid: string,
    setIsUploading: (value: boolean) => void,
    setProgress: (value: number) => void
): Promise<string> => {
    setIsUploading(true);

    try {
        const downloadURL = await uploadImage(uri, path, 10000, setProgress); // 10 seconds timeout
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, { profileImageUrl: downloadURL });
        return downloadURL;
    } catch (error) {
        console.error("Error updating image:", error);
        throw error;
    } finally {
        setProgress(0); // Reset progress after upload completion
        setIsUploading(false);
    }
}