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
  const [fiftyNotes, setFiftyNotes] = useState<number>(0);
  const [twentyNotes, setTwentyNotes] = useState<number>(0);
  const [tenNotes, setTenNotes] = useState<number>(0);
  const [fiveNotes, setFiveNotes] = useState<number>(0);
  const [oneNotes, setOneNotes] = useState<number>(0);
  const [denominationError, setDenominationError] = useState<string>(""); // New state for denomination error
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

  const calculateTotal = () => {
    return (
      fiftyNotes * 50 +
      twentyNotes * 20 +
      tenNotes * 10 +
      fiveNotes * 5 +
      oneNotes * 1
    );
  };

  const handleSubmit = () => {
    const total = calculateTotal();
    if (selectedAtm && amount) {
      if (isNaN(Number(amount))) {
        setAmountError("Please enter a valid number for the amount.");
        return;
      }
      if (total !== Number(amount)) {
        setDenominationError(
          "The total of the denominations does not match the amount."
        );
        return;
      }
      setAmountError("");
      setDenominationError(""); // Clear denomination error if amounts match
      setPinVisible(true);
    }
  };

  const handlePinSubmit = () => {
    const total = calculateTotal();
    if (total !== Number(amount)) {
      setDenominationError(
        "The total of the denominations does not match the amount."
      );
      return;
    }
    if (pin === "0000") {
      setPinError("");
      const token = generate11DigitToken(); // Generate an 11-digit token
      console.log(`Transaction Token: ${token}`); // Log the token
      navigation.navigate("Booking", {
        atm: selectedAtm!,
        amount: amount,
        date: date.toDateString(),
        token: token,
        denominations: {
          fiftyNotes: fiftyNotes,
          twentyNotes: twentyNotes,
          tenNotes: tenNotes,
          fiveNotes: fiveNotes,
          oneNotes: oneNotes,
        },
      });
      setModalVisible(false);
      setPinVisible(false);
      setPin("");
    } else {
      setPinError("Invalid PIN. Please try again.");
    }
  };

  const generate11DigitToken = () => {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
  };

  const incrementNote = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number
  ) => {
    setter(value + 1);
  };

  const decrementNote = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number
  ) => {
    if (value > 0) {
      setter(value - 1);
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
              <View style={styles.denominationContainer}>
                <Text style={styles.denominationText}>Denominations:</Text>
                <View style={styles.denominationRow}>
                  <Text style={styles.denominationLabel}>$50:</Text>
                  <TouchableOpacity
                    onPress={() => decrementNote(setFiftyNotes, fiftyNotes)}
                  >
                    <Text style={styles.adjustButton}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.denominationInput}
                    keyboardType="numeric"
                    value={fiftyNotes.toString()}
                    onChangeText={(text) => setFiftyNotes(Number(text))}
                  />
                  <TouchableOpacity
                    onPress={() => incrementNote(setFiftyNotes, fiftyNotes)}
                  >
                    <Text style={styles.adjustButton}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.denominationRow}>
                  <Text style={styles.denominationLabel}>$20:</Text>
                  <TouchableOpacity
                    onPress={() => decrementNote(setTwentyNotes, twentyNotes)}
                  >
                    <Text style={styles.adjustButton}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.denominationInput}
                    keyboardType="numeric"
                    value={twentyNotes.toString()}
                    onChangeText={(text) => setTwentyNotes(Number(text))}
                  />
                  <TouchableOpacity
                    onPress={() => incrementNote(setTwentyNotes, twentyNotes)}
                  >
                    <Text style={styles.adjustButton}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.denominationRow}>
                  <Text style={styles.denominationLabel}>$10:</Text>
                  <TouchableOpacity
                    onPress={() => decrementNote(setTenNotes, tenNotes)}
                  >
                    <Text style={styles.adjustButton}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.denominationInput}
                    keyboardType="numeric"
                    value={tenNotes.toString()}
                    onChangeText={(text) => setTenNotes(Number(text))}
                  />
                  <TouchableOpacity
                    onPress={() => incrementNote(setTenNotes, tenNotes)}
                  >
                    <Text style={styles.adjustButton}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.denominationRow}>
                  <Text style={styles.denominationLabel}>$5:</Text>
                  <TouchableOpacity
                    onPress={() => decrementNote(setFiveNotes, fiveNotes)}
                  >
                    <Text style={styles.adjustButton}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.denominationInput}
                    keyboardType="numeric"
                    value={fiveNotes.toString()}
                    onChangeText={(text) => setFiveNotes(Number(text))}
                  />
                  <TouchableOpacity
                    onPress={() => incrementNote(setFiveNotes, fiveNotes)}
                  >
                    <Text style={styles.adjustButton}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.denominationRow}>
                  <Text style={styles.denominationLabel}>$1:</Text>
                  <TouchableOpacity
                    onPress={() => decrementNote(setOneNotes, oneNotes)}
                  >
                    <Text style={styles.adjustButton}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.denominationInput}
                    keyboardType="numeric"
                    value={oneNotes.toString()}
                    onChangeText={(text) => setOneNotes(Number(text))}
                  />
                  <TouchableOpacity
                    onPress={() => incrementNote(setOneNotes, oneNotes)}
                  >
                    <Text style={styles.adjustButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {denominationError ? (
                <Text style={styles.errorText}>{denominationError}</Text>
              ) : null}
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
  denominationContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  denominationText: {
    fontSize: 18,
    marginBottom: 10,
  },
  denominationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  denominationLabel: {
    width: 40,
  },
  denominationInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 8,
    marginHorizontal: 10,
    borderRadius: 5,
    width: 60,
    textAlign: "center",
  },
  adjustButton: {
    fontSize: 20,
    marginHorizontal: 10,
  },
});
