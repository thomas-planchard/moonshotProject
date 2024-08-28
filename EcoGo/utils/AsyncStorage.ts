import AsyncStorage from '@react-native-async-storage/async-storage';


interface Activity {
    movement: string;      // The type of movement detected (e.g., 'Walking', 'Driving', etc.)
    // duration: number;      // The duration of the activity in seconds
    // distance: number;      // The distance traveled during the activity in kilometers
    timestamp: number;     // The timestamp when the activity was recorded
  }

  const storeActivity = async (activity: Activity): Promise<void> => {
    try {
      const storedActivities = await AsyncStorage.getItem('activities');
      const activities: Activity[] = storedActivities ? JSON.parse(storedActivities) : [];
      activities.push(activity);
      console.log('Storing Activity:', activity); // Debug log
      //console.log('All Activities after push:', activities); // Debug log
      await AsyncStorage.setItem('activities', JSON.stringify(activities));
    } catch (error) {
      console.error('Error storing activity:', error);
    }
  };
  
  const getStoredActivities = async (): Promise<Activity[]> => {
    try {
      const storedActivities = await AsyncStorage.getItem('activities');
      const activities = storedActivities ? JSON.parse(storedActivities) : [];
      console.log('Retrieved Activities:', activities); // Debug log
      return activities;
    } catch (error) {
      console.error('Error retrieving activities:', error);
      return [];
    }
  };

  export { storeActivity, getStoredActivities };