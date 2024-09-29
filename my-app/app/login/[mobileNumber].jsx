import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons"; // FontAwesome for icons
import { useLocalSearchParams } from "expo-router";
import { colors } from "../../utils/colors";
import { useNavigation } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MobileNumber = () => {
  const { mobileNumber } = useLocalSearchParams();
  const navigation = useNavigation();
  console.log(mobileNumber);
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleInputChange = (value, index) => {
    const otpCopy = [...otp];
    otpCopy[index] = value;
    setOtp(otpCopy);
    if (value && index < 5) {
      inputsRef[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    try {
      const response = await fetch("http://192.168.43.199:3000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobileNumber, otp: otpCode }),
      });
      const data = await response.json();
      if (response.status === 200) {
        ToastAndroid.show("OTP verified successfully", ToastAndroid.SHORT);
        await AsyncStorage.setItem('userToken', data.token);
        console.log(data.token); // Store the token in AsyncStorage
        navigation.navigate("(tabs)");
      } else {
        ToastAndroid.show(data.message || "Invalid OTP", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      ToastAndroid.show("An error occurred", ToastAndroid.SHORT);
    }
  };

  const inputsRef = Array(6)
    .fill()
    .map(() => React.createRef());

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} className="my-10">
        <View className="flex flex-row items-center">
          <Ionicons name={"chevron-back"} size={30} color={colors.primary} />
          <Text>Back</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>Enter the code we just texted you</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleInputChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => (inputsRef[index] = ref)}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleVerifyOtp}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendText}>Resend code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  header: {
    fontFamily: "poppins-bold",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
  },
  title: {
    fontFamily: "poppins-bold",
    fontSize: 22,
    fontWeight: "bold",
    color: "#111418",
    paddingVertical: 16,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
  },
  otpInput: {
    height: 56,
    width: 48,
    marginHorizontal: 4,
    textAlign: "center",
    borderRadius: 10,
    backgroundColor: "#f0f2f4",
    fontSize: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    paddingVertical: 16,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  resendButton: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendText: {
    color: "#111418",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MobileNumber;