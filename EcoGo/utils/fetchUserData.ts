import { db } from '@/FirebaseConfig';
import { doc, getDoc, DocumentReference } from 'firebase/firestore';

// Define the shape of user data
interface UserData {
  consumption?: number;
  carType?: string;
  carbonFootprint?: string;
  distance?: number;
  calories?: number;  
  carSize?: string;
  steps?: number;
}

// Function to initialize user data with selected fields
const initializeUserData = async (
  userId: string,
  fieldsToFetch: Array<keyof UserData> = []
): Promise<Partial<UserData> | null> => {
  if (!userId) return null;

  const userDataRef: DocumentReference = doc(db, "userData", userId);

  try {
    // Fetch user data from the database
    const userDoc = await getDoc(userDataRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      const selectedData: Partial<UserData> = {};

      // Populate selectedData with the fields specified in fieldsToFetch
      fieldsToFetch.forEach(field => {
        if (userData.hasOwnProperty(field)) {
          selectedData[field] = userData[field];
        }
      });

      return selectedData;
    }
  } catch (error) {
    console.error("Error initializing user data:", error);
    return null;
  }

  return null; // In case the document does not exist
};

export default initializeUserData;