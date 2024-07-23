import {
  View,
  Text,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { ProfilImage } from "@/components/common/ProfilImage";

import styles from "./nameandprofile.style"



export default function NameAndProfile()  {
  const {user} = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View style={styles.container}>
        <Text style={styles.welcomeMessage}>Profile,</Text>
        <View style={styles.header}>
            {user?.username ? <Text style={styles.userName}>{user?.username}!</Text> : <Text>Chargement...</Text>}
            <ProfilImage imageState={imageLoaded} source={user?.profileImageUrl} style={styles.profileImage} setImageState={setImageLoaded} />
        </View>
    </View>
  );
};


