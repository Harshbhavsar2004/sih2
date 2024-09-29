import { TouchableOpacity, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from 'expo-router'
const index = () => {
  const navigation = useNavigation();
  return (
    <View className='flex flex-row px-4 pt-10 pb-5'>
     <TouchableOpacity onPress={() => navigation.goBack()}>
      <Text>index</Text>
     </TouchableOpacity>
    </View>
  )
}

export default index
