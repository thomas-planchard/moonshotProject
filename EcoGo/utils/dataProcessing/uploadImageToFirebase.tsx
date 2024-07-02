import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import { storage, db } from "../../FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

// Hashage
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

// Generate Image Path
export const generateImagePath = (uid: string): string => {
    return `images/user/${hashage(uid)}.jpg`;
}

// Upload Image
export const uploadImageToFirebase = async (uri: string, path: string): Promise<string> => {
    const fetchResponse = await fetch(uri);
    const blob = await fetchResponse.blob();
    const imageRef = ref(storage, path);

    const uploadTask = uploadBytesResumable(imageRef, blob);

    return new Promise<string>((resolve, reject) => {
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            }, 
            (error) => {
                reject(error);
            }, 
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('File available at', downloadURL);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}


export const updateImageToFirebase = async (
    uri: string,
    path: string,
    uid: string,
    setIsUploading: (value: boolean) => void,
    setProgress: (value: number) => void
): Promise<string> => {
    setIsUploading(true);
    const fetchResponse = await fetch(uri);
    const blob = await fetchResponse.blob();
    const docRef = doc(db, 'users', uid);
    const imageRef = ref(storage, path);

    const uploadTask = uploadBytesResumable(imageRef, blob);

    return new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Your connection is too slow to upload the image"));
        }, 10000);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
                setProgress(progress);
            }, 
            (error) => {
                clearTimeout(timeout);
                reject(error);
            }, 
            async () => {
                clearTimeout(timeout);
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await updateDoc(docRef, { profileImageUrl: downloadURL });
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                } finally {
                    setProgress(0);
                    setIsUploading(false);
                }
            }
        );
    });
}