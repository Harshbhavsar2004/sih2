import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
const App = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View className='flex flex-row px-4 pt-10 pb-5'>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className='text-black text-lg'>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Handover to a driver</Text>

      <HandoverOption icon={<MapPinIcon />} text="Select handover location" />
      <HandoverOption icon={<CalendarIcon />} text="Additional shift details" />
      <HandoverOption icon={<UserIcon />} text="Receiving driver" />
      <HandoverOption icon={<ClockIcon />} text="Handover time slot" />

      <View style={styles.confirmButtonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.navigate('Handover/index')}>
          <Text style={styles.confirmButtonText}>Confirm Handover</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}></View>
    </View>
  );
};

const HandoverOption = ({ icon, text }) => {
  return (
    <View style={styles.optionContainer}>
      <View style={styles.optionIconContainer}>{icon}</View>
      <Text style={styles.optionText}>{text}</Text>
    </View>
  );
};

const MapPinIcon = () => (
  <Svg width="24" height="24" fill="black" viewBox="0 0 256 256">
    <Path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="24" height="24" fill="black" viewBox="0 0 256 256">
    <Path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z" />
  </Svg>
);

const UserIcon = () => (
  <Svg width="24" height="24" fill="black" viewBox="0 0 256 256">
    <Path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
  </Svg>
);

const ClockIcon = () => (
  <Svg width="24" height="24" fill="black" viewBox="0 0 256 256">
    <Path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    paddingLeft: 48,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  optionIconContainer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
  },
  optionText: {
    color: 'black',
    fontSize: 16,
    flex: 1,
  },
  confirmButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: 'black',
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    height: 20,
    backgroundColor: 'white',
  },
});

export default App;