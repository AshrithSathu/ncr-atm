import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import NewTripCard from "@/components/mytrips/newTripCard";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useRouter } from "expo-router";

interface AtmData {
  id: string;
  name: string;
  location: string;
}

type RootStackParamList = {
  Booking: { atm: AtmData; amount: string; date: string; token: string };
};

type BookingRouteProp = RouteProp<RootStackParamList, "Booking">;

const Booking = () => {
  const [userTrips, setUserTrips] = useState<
    { atm: AtmData; amount: string; date: string; token: string }[]
  >([]);
  const route = useRoute<BookingRouteProp>();

  useEffect(() => {
    if (
      route.params?.atm &&
      route.params?.amount &&
      route.params?.date &&
      route.params?.token
    ) {
      const newTrip = {
        atm: route.params.atm,
        amount: route.params.amount,
        date: route.params.date,
        token: route.params.token,
      };
      setUserTrips((prevTrips) => [...prevTrips, newTrip]);
    }
  }, [route.params]);

  const router = useRouter();

  const deleteTrip = (index: number) => {
    setUserTrips((prevTrips) => prevTrips.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.innercontainer}>
        <Text style={styles.text}>Book Your Cash</Text>
        <TouchableOpacity
          onPress={() => {
            router.push("create-trip/search-place");
          }}
        >
          <Ionicons name="add-circle" size={30} color="black" />
        </TouchableOpacity>
      </View>
      {userTrips.length === 0 ? (
        <NewTripCard />
      ) : (
        userTrips.map((trip, index) => (
          <View key={index} style={styles.tripCard}>
            <Text>ATM: {trip.atm.name}</Text>
            <Text>Location: {trip.atm.location}</Text>
            <Text>Amount: {trip.amount}</Text>
            <Text>Date: {trip.date}</Text>
            <Text>Token: {trip.token}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTrip(index)}
            >
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
};

export default Booking;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 25,
    paddingTop: 60,
    backgroundColor: "white",
  },
  innercontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontFamily: "outfitBold",
    fontSize: 30,
  },
  tripCard: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    position: "relative",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
