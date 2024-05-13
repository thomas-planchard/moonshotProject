import { ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { storage } from "../../FirebaseConfig";
import { getAuth } from "firebase/auth";
import { useAuth } from "@/context/authContext";


// Hashage
const hashage = (str: string) => {
    let hash = 0;
    if (typeof str === 'undefined' || str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}


// Generate Image Path
export const generateImagePath = (uid: string) => {
    return `images/user/${hashage(uid)}.jpg`;
}


  
  // Upload Image
export const uploadImageToFirebase = async (uri, path) => {
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();
    
    const imageRef = ref(storage, path);

    const uploadTask = uploadBytesResumable(imageRef, theBlob);

    return imageRef && new Promise((resolve, reject) => {
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
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                resolve(downloadURL);
            
            });
        });
    });
}


