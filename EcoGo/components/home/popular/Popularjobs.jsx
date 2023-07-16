import {useState} from 'react'

import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'

import { useRouter } from 'expo-router'

import styles from './popularjobs.style'

import{COLORS, SIZES} from '../../../constants'

import useFetch from '../../../hook/useFetch'

import PopularjobCard from '../../common/cards/popular/PopularJobCard'

const Popularjobs = () => {
  const router = useRouter();
  const { data , isLoading, error} = useFetch(
    'search', {
      query: 'React developer',
      num_pages: 1,
    })

    console.log(data);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Popular Jobs</Text>
        <TouchableOpacity>
          <Text style={styles.headerBtn}>Show all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator colors={COLORS.primary} size="large" />
        ): error ?(
          <Text>Something went wrong</Text>
        ): (
          <FlatList
            data={data}
            renderItem={({item}) => (
              <PopularjobCard 
                item ={item}
                selectedJob={selectedJob}
                handleCardPress={handleCardPress}
              />
            )} 
            keyExtractor={item => item?.job_id}
            contentContainerStyle={{columnGap: SIZES.medium}}
            horizontal
          />
        )}
      </View>
    </View>
  )
}

export default Popularjobs