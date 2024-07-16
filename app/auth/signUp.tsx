import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/Configs/FirebaseConfig";

const SignUp = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const [err, setErr] = useState<string>("");

  const onAccountCreation = () => {
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    if (!username || !email || !password || !confirmPassword) {
      setErr("Please fill all the fields");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        router.navigate("auth/signIn");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErr(errorMessage);
        console.log(errorCode, errorMessage);
        // ..
      });
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordsMatch(text === confirmPassword);
    setErr("");
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setPasswordsMatch(text === password);
    setErr("");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.backbutton}>
        <TouchableOpacity onPress={() => router.back()}>
          <Entypo name="back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.signUpText}>Create an Account</Text>
        <Text style={styles.subText}>Join us today</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.heading}>Username</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setErr(""); // Clear error message
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.heading}>Email</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          textContentType="emailAddress"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErr(""); // Clear error message
          }}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.heading}>Password</Text>
        <TextInput
          style={[
            styles.textInput,
            !passwordsMatch && password && confirmPassword
              ? { borderColor: "red" }
              : null,
          ]}
          placeholder="Password"
          textContentType="password"
          secureTextEntry={true}
          value={password}
          onChangeText={handlePasswordChange}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.heading}>Confirm Password</Text>
        <TextInput
          style={[
            styles.textInput,
            !passwordsMatch && password && confirmPassword
              ? { borderColor: "red" }
              : null,
          ]}
          placeholder="Confirm Password"
          textContentType="password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
        />
      </View>
      {!passwordsMatch && password && confirmPassword && (
        <Text style={styles.errorText}>Passwords do not match</Text>
      )}
      {err && <Text style={styles.errorText}>{err}</Text>}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onAccountCreation}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <Text>Or</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.navigate("auth/signIn");
          }}
        >
          <Text style={styles.buttonText}>SignIn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backbutton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  signUpText: {
    fontSize: 50,
    fontFamily: "outfitMedium",
  },
  subText: {
    fontSize: 40,
    color: "#7d7d7d",
    fontFamily: "outfitMedium",
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  heading: {
    alignSelf: "flex-start",
    marginLeft: 20,
    fontSize: 20,
    fontFamily: "outfitMedium",
  },
  textInput: {
    width: "90%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 20,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    width: "90%",
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "outfitMedium",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
