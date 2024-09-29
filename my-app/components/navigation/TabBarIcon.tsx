import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

interface TabBarIconProps extends IconProps<ComponentProps<typeof Ionicons>['name']> {
  focused: boolean;
  label: string;
}

export function TabBarIcon({ style, focused, label, ...rest }: TabBarIconProps) {
  const scale = useSharedValue(1);
  const color = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(focused ? 1.2 : 1, { duration: 200 });
    color.value = withTiming(focused ? 1.5 : 0, { duration: 200 });
  }, [focused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(color.value, [0, 1], ['transparent', '#0891b2']),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(color.value, [0, 1], ['#737373', '#0891b2']),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
        <Ionicons size={28} style={[{ marginBottom: -3 }, style]} color={focused ? 'white' : '#737373'} {...rest} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center', // Center the content vertically
  },
  iconContainer: {
    padding: 5,
    borderRadius: 25,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});