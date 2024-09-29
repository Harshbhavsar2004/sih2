import { View, Text, StyleSheet } from 'react-native';

export default function SecondTab() {
  return (
    <View style={styles.container}>
      <Text>Second Tab Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});