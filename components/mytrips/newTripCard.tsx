import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const NewTripCard = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Ionicons name="location" size={24} color="black" />
      <Text style={styles.textDefault}>Select the Atm nearby</Text>
      <TouchableOpacity
        style={styles.newtripContainer}
        onPress={() => {
          router.push("create-trip/search-place");
        }}
      >
        <Text style={styles.newtripText}>ATM'S</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewTripCard;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "medium",
  },
  textDefault: {
    fontSize: 25,
    fontFamily: "outfitMedium",
    textAlign: "center",
    color: "#7d7d7d",
  },
  newtripText: {
    color: "#fff",
    padding: 15,
    fontSize: 15,
  },
  newtripContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 55,
  },
});
