import Login from "@/components/login/Login";
import { auth } from "@/Configs/FirebaseConfig";
import { Redirect, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const user = auth.currentUser;

  // setTimeout(() => {
  //   router.push("auth/signIn");
  // }, 100);
  {
    console.log(user);
  }
  return (
    // <SafeAreaView
    //   style={{
    //     backgroundColor: "black",
    //   }}
    // >
    <View
      style={{
        backgroundColor: "black",
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      {user ? <Redirect href={"(tabs)/Booking"} /> : <Login />}
    </View>
    // </SafeAreaView>
  );
}
