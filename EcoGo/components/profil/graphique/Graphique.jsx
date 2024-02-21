import { useState } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ViewBase,
} from "react-native";

import styles from "./graphique.style"

import { COLORS, SIZES } from "../../../constants";
import ActivitiesCard from "../../common/cards/activitiescard/ActivitiesCard";
import useFetch from "../../../hook/useFetch";

const Graphique = () => {

  return (
    <View style={styles.container}>
        <Text style={styles.text}>CO2 emissions</Text>
        <Text style={styles.text2}>past 7 days</Text>
        <View style={styles.graphique}>
            <View style={styles.column}>
                <View style={styles.tailleh20}></View>
                <Text style={styles.days}>Mon</Text>
            </View>
            <View style={styles.column}>
                <View style={styles.tailleh50}></View>
                <Text style={styles.days}>Tue</Text>
            </View>
            <View style={styles.column}>
                <View style={styles.tailleh50}></View>
                <Text style={styles.days}>Wed</Text>
            </View>
            <View style={styles.column}>
                <View style={styles.tailleh80}></View>
                <Text style={styles.days}>Thu</Text>
            </View>
            <View style={styles.column}>
                <View style={styles.tailleh80}></View>
                <Text style={styles.days}>Fri</Text>
            </View>
            <View style={styles.column}>
                <View style={styles.tailleh60}></View>
                <Text style={styles.days}>Sat</Text>
            </View>
            <View style={styles.column}>
                <View style={styles.tailleh50}></View>
                <Text style={styles.days}>Sun</Text>
            </View>
        </View>
    </View>
  );
};

export default Graphique;
