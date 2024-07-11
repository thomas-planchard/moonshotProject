import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Linking } from "react-native";
import styles from "./recommendation.style";

const images = [
  { source: require('../../../assets/images/blablacar.png'), name: 'BlaBlaCar', url: "https://blablacardaily.com/" },
  { source: require('../../../assets/images/logosncf.png'), name: 'SNCF Connect', url: "https://www.sncf-connect.com/" },
];

function handleNavigate(website: string) {
  Linking.openURL(website);
}

const Recommendation = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Good deals in your area</Text>
      </View>
      <View style={styles.cardsContainer}>
        {images.map((item, index) => (
          <RecommendationCard
            key={index}
            handleNavigate={() => handleNavigate(item.url)}
            imageSource={item.source}
            logoName={item.name}
          />
        ))}
      </View>
    </View>
  );
};

const RecommendationCard = ({ handleNavigate, imageSource, logoName }) => {
  const [isBanner, setIsBanner] = useState<boolean | null>(null);

  useEffect(() => {
    Image.getSize(
      Image.resolveAssetSource(imageSource).uri,
      (width, height) => {
        setIsBanner(width / height > 2.5); // Considering a banner as an image with width more than twice the height
      },
      (error) => {
        console.error('Error fetching image dimensions:', error);
      }
    );
  }, [imageSource]);

  return (
    <TouchableOpacity onPress={handleNavigate}>
      {isBanner === null ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : isBanner ? (
          <Image source={imageSource} style={styles.imageDeals} />
      ) : (
        <View style={styles.textLogoContainer}>
          <Image source={imageSource} style={styles.smallLogoImage} />
          <Text style={styles.logoName}>{logoName}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Recommendation;