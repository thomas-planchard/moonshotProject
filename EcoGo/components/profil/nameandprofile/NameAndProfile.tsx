import {
  View,
  Text,
  Image,
} from "react-native";
import { useAuth } from "@/context/authContext";
import { useState } from "react";

import styles from "./nameandprofile.style"



export default function NameAndProfile()  {
  const {user} = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View style={styles.container}>
        <Text style={styles.welcomeMessage}>Profile,</Text>
        <View style={styles.header}>
            {user?.username ? <Text style={styles.userName}>{user?.username}!</Text> : <Text>Chargement...</Text>}
            <Image
                source={{ uri: imageLoaded ? user?.profileImageUrl : 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg' }}
                onLoadEnd={() => setImageLoaded(true)}
                style={styles.profileImage}
            />
        </View>
    </View>
  );
};


