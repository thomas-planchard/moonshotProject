import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./dealscard.style";

export default function DealsCard({ handleNavigate }: { handleNavigate: () => void }) {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <TouchableOpacity style={styles.logoContainer}>
      <TouchableOpacity>
            <Image source={require('@/assets/images/blablacar.png')} style={styles.logoImage}></Image>
            <Image source={require('@/assets/images/logosncf.png')} style={styles.logoImage}></Image>
          </TouchableOpacity>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

