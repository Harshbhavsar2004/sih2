import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const Index = () => {
  const navigation = useNavigation();

  return (
    <View className="flex flex-row justify-between items-center p-4">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text>index</Text>
    </View>
  );
};

export default Index;