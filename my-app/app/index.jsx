import { Image, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { useNavigation } from "expo-router";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");

const Index = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    "poppins": require("../assets/fonts/Poppins-Regular.ttf"), // Poppins Regular
    "poppins-bold": require("../assets/fonts/Poppins-Bold.ttf"), // Poppins Bold
    "poppins-medium": require("../assets/fonts/Poppins-Medium.ttf"), // Poppins Medium
    "poppins-light": require("../assets/fonts/Poppins-Light.ttf"), // Poppins Light
    "poppins-semi-bold": require("../assets/fonts/Poppins-SemiBold.ttf"), // Poppins SemiBold
  });

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  const handleLogin = () => {
    navigation.navigate("login/Phone");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image source={require("../assets/images/clipart-bus-84-travel-bus-clipart-download.png")} style={styles.bannerImage} />
      <Text style={styles.title}>Welcome to The DTC Drivers</Text>
      <Text style={styles.subTitle}>
        This is a platform for DTC Drivers to manage their bookings and deliveries.
      </Text>
      <Text 
        style={styles.loginButton}
        onPress={handleLogin}
      >
        Login
      </Text>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    alignItems: "center",
    paddingTop: height * 0.1,
  },
  logo: {
    height: height * 0.05,
    width: width * 0.35,
    marginVertical: height * 0.03,
  },
  bannerImage: {
    marginVertical: height * 0.02,
    height: height * 0.32,
    width: width,
  },
  title: {
    fontSize: width * 0.1,
    fontFamily: "poppins-bold",
    paddingHorizontal: width * 0.05,
    textAlign: "center",
    color: colors.primary,
    marginTop: height * 0.04,
  },
  subTitle: {
    fontSize: width * 0.045,
    fontFamily: "poppins-light",
    paddingHorizontal: width * 0.05,
    textAlign: "center",
    color: colors.secondary,
    marginVertical: height * 0.02,
  },
  buttonContainer: {
    marginTop: height * 0.02,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    width: width * 0.8,
    height: height * 0.08,
    borderRadius: 100,
  },
  loginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    borderRadius: 98,
  },
  loginButton: {
    fontFamily: "poppins-medium",
    fontSize: width * 0.045,
    textAlign: "center",
    borderWidth: 2,
    borderColor: "black",
    width: width * 0.56,
    padding: height * 0.015,
    borderRadius: 50,
    backgroundColor: "black",
    color: "white",
  },
  signupButtonText: {
    fontSize: width * 0.045,
  },
});