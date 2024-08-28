import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, TextInput, Keyboard, FlatList, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { GOOGLE_MAPS_APIKEY } from '@env';
import axios from 'axios';
import styles from './footer.style';
import { COLORS } from '@/constants/theme';

interface FooterMapProps {
  footerVisible: boolean; 
  setModalVisible: (modalVisible: boolean) => void; 
  setIsMapTouched: (isMapTouched: boolean) => void;
  isMapTouched: boolean;
  distance: string;
  duration: string;
  arrivalTime: string;
  userLocation: Location.LocationObject | null;
  countryCode: string | null;
  getRoute: () => void;
  setDestination: (destination: string) => void;
  destination: string;
  resetMapState: (cancel:boolean ) => void;
}

const FooterMap: React.FC<FooterMapProps> = ({ 
  footerVisible,
  setModalVisible,
  setIsMapTouched,
  isMapTouched,
  distance,
  duration,
  arrivalTime,
  userLocation,
  countryCode,
  getRoute,
  setDestination,
  destination,
  resetMapState
  }) => {

  // State variables
  const [expanded, setExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('')

  // Animation variables
  const heightAnim = useRef(new Animated.Value(hp(20))).current;


  // Toggle expand state for the footer 
  const toggleExpand = () => {
    if(expanded) {
     return;
    }
    setIsMapTouched(false);
    Animated.timing(heightAnim, {
      toValue: expanded ? hp(20) : hp(90),
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  // Handle suggestion press event
  const handleSuggestionPress = useCallback(async (placeId: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_APIKEY}`
      );
      const { lat, lng } = response.data.result.geometry.location;
      setDestination(`${lat},${lng}`);
      Animated.timing(heightAnim, {
        toValue: hp(20),
        duration: 300,
        useNativeDriver: false,
      }).start();
      setExpanded(false);
      setSuggestions([]);
      Keyboard.dismiss();
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  }, [setDestination]);


  // Fetch suggestions from Google Maps API
  const fetchSuggestions = async (input: string) => {
    setInputValue(input)
    if (input.length > 0 && userLocation) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&location=${userLocation.coords.latitude},${userLocation.coords.longitude}&radius=50000&key=${GOOGLE_MAPS_APIKEY}`
        );
        
        // Sort suggestions to favor those from the user's country
        const sortedSuggestions = response.data.predictions.sort((a, b) => {
          const aCountry = a.terms[a.terms.length - 1].value;
          const bCountry = b.terms[b.terms.length - 1].value;
          if (aCountry === countryCode && bCountry !== countryCode) {
            return -1;
          }
          if (aCountry !== countryCode && bCountry === countryCode) {
            return 1;
          }
          return 0;
        });
        setSuggestions(sortedSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

// Effect to handle map touch events
  useEffect(() => {
    if (isMapTouched) {
      Animated.timing(heightAnim, {
        toValue: hp(20),
        duration: 300,
        useNativeDriver: false,
      }).start();
      setExpanded(false);
      Keyboard.dismiss();
    }
  }, [isMapTouched]);


  // Effect to handle changes to the destination
  useEffect(() => {
    if (destination) {
      getRoute();
      setModalVisible(true); 
    }
  }, [destination]);


  if (!footerVisible) {
    return null;
  }

  const handlePausePress = () => {
    // Show a confirmation alert before resetting the map state
    Alert.alert(
      'Reset Map',
      'Are you sure you want to reset the map?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Reset canceled'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            resetMapState(true);
            setInputValue('')
          },
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <Animated.View style={[styles.footerContainer, { height: heightAnim }]}>
      {arrivalTime ? (
        <>
        <TouchableOpacity style={styles.magnifierButton} onPress={handlePausePress}>
          <MaterialIcons name="pause" size={34} color="red" />
        </TouchableOpacity>
        <View style={styles.infoSection}>
          <View style={styles.infoSectionRow}>
              <Text style={styles.infoArrivalTime}>{arrivalTime}</Text>
            </View>
            <View style={styles.infoSectionRow}>
              <Text style={styles.infoTextLeft}>{duration} </Text>
              {duration && <Entypo name="dot-single" size={24} color='black' style={styles.dot}/>}
              <Text numberOfLines={1} style={styles.infoTextRight}>{distance}</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color={COLORS.blueGreen} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where do you want to go ?"
            placeholderTextColor={COLORS.gray}
            onFocus={toggleExpand}
            onChangeText={fetchSuggestions}
            value={inputValue}
          />
        </View>
      )}
       {suggestions.length > 0 && (!distance || distance === '') &&(
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggestionItem}  onPress={() => handleSuggestionPress(item.place_id)}>
                  <MaterialIcons name="place" size={30} color={COLORS.blueGreen} style={styles.suggestionIcon} />
                  <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionTitle}>{item.structured_formatting.main_text}</Text>
                    <Text style={styles.suggestionSubtitle}>{item.structured_formatting.secondary_text}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.customBorder} />}
            />
        )}
    </Animated.View>
  );
};

export default FooterMap;