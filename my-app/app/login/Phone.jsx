import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../utils/colors";

const PhoneScreen = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const navigation = useNavigation();

  const handleContinue = async () => {
    if (mobileNumber.length !== 10) {
      ToastAndroid.show(
        "Please enter a valid phone number",
        ToastAndroid.SHORT
      );
      return;
    }
    try {
      // Check if driver exists

      const checkResponse = await fetch(
        "http://192.168.43.199:3000/api/check-driver",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobileNumber }),
        }
      );
      const checkData = await checkResponse.json();

      if (checkData.isValid) {
        // Send OTP
        const otpResponse = await fetch(
          "http://192.168.43.199:3000/api/send-otp",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mobileNumber }),
          }
        );

        if (otpResponse.status === 200) {
          ToastAndroid.show("OTP sent successfully", ToastAndroid.SHORT);
          setTimeout(() => {
            navigation.navigate("login/[mobileNumber]", { mobileNumber });
          }, 1000);
        }
      } else {
        ToastAndroid.show("Driver not found", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error:", error);
      ToastAndroid.show("An error occurred", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} className="my-10">
        <View className="flex flex-row items-center">
          <Ionicons name={"chevron-back"} size={30} color={colors.primary} />
          <Text>Back</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>Sign in to your account</Text>
      <Text style={styles.subtitle}>
        Welcome to DTC driver App, Please enter your phone number to continue
      </Text>
      <View style={styles.inputContainer}>
        <Ionicons
          name={"phone-portrait-outline"}
          size={30}
          color={colors.secondary}
        />
        <TextInput
          keyboardType="numeric"
          style={styles.textInput}
          placeholder="Enter your Phone Number"
          placeholderTextColor={colors.secondary}
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>We'll send you a one-time code.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0e141b",
    textAlign: "center",
    paddingBottom: 12,
    paddingTop: 20,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#4e7397",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#0e141b",
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noteContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  noteText: {
    color: "#4e7397",
    fontSize: 14,
  },
});

export default PhoneScreen;
