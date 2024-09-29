import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import FirstTab from '../../components/sidetab/FirstTab';
import SecondTab from '../../components/sidetab/SecondTab';
import ThirdTab from '../../components/sidetab/ThirdTab'; 


const ReportScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'First Tab' },
    { key: 'second', title: 'Second Tab' },
    { key: 'third', title: 'Third Tab' },
  ]);

  const renderScene = SceneMap({
    first: FirstTab,
    second: SecondTab,
    third: ThirdTab,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={() => null} // Hide the top navigation bar
    />
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ReportScreen;