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

interface TripData {
  atm: AtmData;
  amount: string;
  date: string;
  token: string;
  denominations: {
    fiftyNotes: number;
    twentyNotes: number;
    tenNotes: number;
    fiveNotes: number;
    oneNotes: number;
  };
}

type RootStackParamList = {
  Booking: {
    atm: AtmData;
    amount: string;
    date: string;
    token: string;
    denominations: {
      fiftyNotes: number;
      twentyNotes: number;
      tenNotes: number;
      fiveNotes: number;
      oneNotes: number;
    };
  };
};

type BookingRouteProp = RouteProp<RootStackParamList, "Booking">;

const Booking = () => {
  const [userTrips, setUserTrips] = useState<TripData[]>([]);
  const route = useRoute<BookingRouteProp>();

  useEffect(() => {
    if (
      route.params?.atm &&
      route.params?.amount &&
      route.params?.date &&
      route.params?.token &&
      route.params?.denominations
    ) {
      const newTrip: TripData = {
        atm: route.params.atm,
        amount: route.params.amount,
        date: route.params.date,
        token: route.params.token,
        denominations: route.params.denominations,
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
            <Text>Reservation Id: {trip.token}</Text>
            <Text>Denominations:</Text>
            {trip.denominations.fiftyNotes > 0 && (
              <Text>$50 Notes: {trip.denominations.fiftyNotes}</Text>
            )}
            {trip.denominations.twentyNotes > 0 && (
              <Text>$20 Notes: {trip.denominations.twentyNotes}</Text>
            )}
            {trip.denominations.tenNotes > 0 && (
              <Text>$10 Notes: {trip.denominations.tenNotes}</Text>
            )}
            {trip.denominations.fiveNotes > 0 && (
              <Text>$5 Notes: {trip.denominations.fiveNotes}</Text>
            )}
            {trip.denominations.oneNotes > 0 && (
              <Text>$1 Notes: {trip.denominations.oneNotes}</Text>
            )}
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
