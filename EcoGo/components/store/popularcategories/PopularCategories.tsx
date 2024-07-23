import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import styles from "./popularcategories.style"


const PopularCategories= () => {

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerTitle}>Popular Categories</Text>
        
    </View>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.cardsContainer}>
        <TouchableOpacity style={styles.cardContainer}>
           <Image style={styles.cardImage} source={require('../../../assets/images/restaurant.jpeg')}></Image>
           <Text style={styles.categoryName}>Restaurant</Text> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardContainer}>
           <Image style={styles.cardImage} source={require('../../../assets/images/clothe.jpeg')}></Image>
           <Text style={styles.categoryName}>Clothes</Text> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardContainer}>
           <Image style={styles.cardImage} source={require('../../../assets/images/travel.jpeg')}></Image>
           <Text style={styles.categoryName}>Trip</Text> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.cardContainer}>
           <Image style={styles.cardImage} source={require('../../../assets/images/beauty.jpeg')}></Image>
           <Text style={styles.categoryName}>Beauty</Text> 
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


export default PopularCategories;