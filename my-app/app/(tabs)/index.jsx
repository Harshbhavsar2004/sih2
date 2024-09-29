import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "expo-router";

const ScheduleScreen = () => {
  const navigation = useNavigation();
  const { user, loading } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://192.168.43.199:3000/api/schedule/driverspecific",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ driverName: user?.DriverName }),
          }
        );
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          setData(result);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user?.DriverName) {
      fetchData();
    }
  }, [user]);

  const handleViewPress = (trip) => {
    setSelectedTrip(trip);
    bottomSheetRef.current?.expand();
  };

  const handleClosePress = () => {
    setSelectedTrip(null);
    bottomSheetRef.current?.close();
  };

  const handleStartTrip = () => {
    navigation.navigate("Trips/index");
  };

  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Date().toLocaleDateString(undefined, dateOptions);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          style={styles.profileImage}
          source={{
            uri: "https://cdn.usegalileo.ai/stability/56aafb96-74ee-48b8-9c7e-def21086d3a1.png",
          }}
        />
        <View style={styles.profileText}>
          <Text style={styles.name}>{user?.DriverName}, 34</Text>
          <Text style={styles.duration}>
            Scheduled time: {data?.totalScheduledTime}
          </Text>
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today</Text>
        <Text style={styles.dateText}>Date: {formattedDate}</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {data && data.trips && data.trips.length > 0 ? (
          data.trips.map((trip, index) => (
            <View key={index} style={styles.tripCard}>
              <View style={styles.tripInfo}>
                <Text style={styles.tripName}>
                  Trip ID: {data.tripIDs[index]}
                </Text>
                <Text style={styles.tripTime}>
                  Duration: {trip.tripDuration}
                </Text>
                <Text style={styles.tripRoute}>
                  Start: {trip.startLocation}
                  {"\n"}End: {trip.endLocation}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewPress(trip)}
              >
                <Text style={styles.buttonTextInactive}>View</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No data available</Text>
        )}
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["25%", "50%", "83%"]}
        onClose={() => setSelectedTrip(null)}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContent}
        >
          {selectedTrip && (
            <>
              <View style={styles.bottomSheetHeader}>
                <Text style={styles.tripName}>
                  Start: {selectedTrip.startLocation} {"\n"}
                  End: {selectedTrip.endLocation}
                </Text>
                <TouchableOpacity
                  onPress={handleClosePress}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <Text style={styles.tripTime}>{selectedTrip.tripDuration}</Text>
              <View style={styles.timelineContainer}>
                {selectedTrip.stops.map((stop, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.stopName}>{stop}</Text>
                      <Text style={styles.stopTime}>
                        {selectedTrip.stopTimes[index]}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
      {!selectedTrip && (
        <View style={styles.startTripButtonContainer}>
          <TouchableOpacity
            style={styles.startTripButton}
            onPress={handleStartTrip}
          >
            <Text style={styles.startTripButtonText}>Start Today's Trip</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  dateText: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eeeeee",
  },
  profileText: {
    marginLeft: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
  },
  duration: {
    fontSize: 16,
    color: "#6B6B6B",
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  tripCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: "#EEEEEE",
    marginBottom: 10,
  },
  tripInfo: {
    flex: 1,
  },
  tripName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  tripTime: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  tripRoute: {
    fontSize: 12,
    color: "#6B6B6B",
  },
  viewButton: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#EEEEEE",
  },
  buttonTextInactive: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  bottomSheetContent: {
    padding: 16,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    padding: 8,
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 16,
  },
  timelineContainer: {
    marginTop: 25,
    borderLeftWidth: 2,
    borderLeftColor: "#000",
    paddingLeft: 16,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  stopName: {
    fontSize: 14,
    fontWeight: "500",
  },
  stopTime: {
    fontSize: 12,
    color: "#6B6B6B",
  },
  startTripButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  startTripButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  startTripButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ScheduleScreen;