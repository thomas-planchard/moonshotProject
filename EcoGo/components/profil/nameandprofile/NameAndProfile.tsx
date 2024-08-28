import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ProfilImage } from "@/components/common/ProfilImage";
import {ICONS} from "@/constants";
import styles from "./nameandprofile.style"



export default function NameAndProfile()  {
  const {user} = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  const routing = useRouter();

  const goToinfoUser = () => {
    routing.navigate("screens/InfoUser");
  }


  return (
    <View style={styles.container}>
        <Text style={styles.welcomeMessage}>Profile,</Text>
        <View style={styles.header}>
            {user?.username ? <Text style={styles.userName}>{user?.username}!</Text> : <Text>Chargement...</Text>}
            <ProfilImage imageState={imageLoaded} source={user?.profileImageUrl} style={styles.profileImage} setImageState={setImageLoaded} />
        </View>
        <View style={{alignItems: "flex-end"}}>
          <TouchableOpacity onPress={goToinfoUser} style={styles.row}>
          <Image source={ICONS.icEdit} style={styles.editImage}></Image>
          <Text style={styles.edit}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};


