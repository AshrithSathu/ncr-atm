import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface AtmData {
  id: string;
  name: string;
  location: string;
}

const dummyAtmData: AtmData[] = [
  { id: "1", name: "ATM 1", location: "Manhattan" },
  { id: "2", name: "ATM 2", location: "Brooklyn" },
  { id: "3", name: "ATM 3", location: "Queens" },
  { id: "4", name: "ATM 4", location: "Bronx" },
  { id: "5", name: "ATM 5", location: "Staten Island" },
];

type RootStackParamList = {
  SearchPlace: undefined;
  Booking: { atm: AtmData; amount: string; date: string; token: string };
};

type SearchPlaceNavigationProp = NavigationProp<
  RootStackParamList,
  "SearchPlace"
>;

const SearchPlace = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<AtmData[]>(dummyAtmData);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAtm, setSelectedAtm] = useState<AtmData | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [pinVisible, setPinVisible] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>("");
  const navigation = useNavigation<SearchPlaceNavigationProp>();

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const newData = dummyAtmData.filter((item) => {
        const itemData = item.location
          ? item.location.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(dummyAtmData);
    }
  };

  const handleItemPress = (item: AtmData) => {
    setSelectedAtm(item);
    setModalVisible(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    if (currentDate < new Date()) {
      setDateError("The selected date cannot be before today.");
      return;
    }
    setDateError("");
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleSubmit = () => {
    if (selectedAtm && amount) {
      if (isNaN(Number(amount))) {
        setAmountError("Please enter a valid number for the amount.");
        return;
      }
      setAmountError("");
      setPinVisible(true);
    }
  };

  const handlePinSubmit = () => {
    if (pin === "0000") {
      setPinError("");
      const token = Math.random().toString(36).substring(2, 9); // Generate a random token
      console.log(`Transaction Token: ${token}`); // Log the token
      navigation.navigate("Booking", {
        atm: selectedAtm!,
        amount: amount,
        date: date.toDateString(),
        token: token, // Pass the token to the Booking screen
      });
      setModalVisible(false);
      setPinVisible(false);
      setPin("");
    } else {
      setPinError("Invalid PIN. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.textInput}
        placeholder="Search"
        value={searchText}
        onChangeText={(text) => handleSearch(text)}
      />
      <FlatList
        data={dummyAtmData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isVisible = filteredData.some(
            (filteredItem) => filteredItem.id === item.id
          );
          return (
            <TouchableOpacity
              style={[styles.item, !isVisible && styles.hiddenItem]}
              onPress={() => handleItemPress(item)}
            >
              <Text>{item.name}</Text>
              <Text>{item.location}</Text>
            </TouchableOpacity>
          );
        }}
      />
      {selectedAtm && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Book ATM: {selectedAtm.name}</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => setAmount(text)}
              />
              {amountError ? (
                <Text style={styles.errorText}>{amountError}</Text>
              ) : null}
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>
                  Select Date: {date.toDateString()}
                </Text>
              </TouchableOpacity>
              {dateError ? (
                <Text style={styles.errorText}>{dateError}</Text>
              ) : null}
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              {pinVisible && (
                <>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="Enter PIN"
                    keyboardType="numeric"
                    secureTextEntry
                    value={pin}
                    onChangeText={(text) => setPin(text)}
                  />
                  {pinError ? (
                    <Text style={styles.errorText}>{pinError}</Text>
                  ) : null}
                  <Button title="Submit PIN" onPress={handlePinSubmit} />
                </>
              )}
              {!pinVisible && (
                <View style={styles.buttonContainer}>
                  <Button title="Submit" onPress={handleSubmit} />
                  <Button
                    title="Close"
                    onPress={() => setModalVisible(false)}
                    color="red"
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default SearchPlace;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 90,
    backgroundColor: "#fff",
    height: "100%",
  },
  backButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  hiddenItem: {
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalTextInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 20,
    borderRadius: 5,
    width: "100%",
  },
  dateText: {
    marginBottom: 20,
    textAlign: "center",
    color: "blue",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
