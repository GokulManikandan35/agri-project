import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import components
// import UserTypeSelector from './components/UserTypeSelector';
// import SignupForm from './components/SignupForm';
// import PageHeader from './components/PageHeader';
// import LoginLink from './components/LoginLink';

const Signup = () => {
  const router = useRouter();
  const [userType, setUserType] = useState("farmer");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (userData) => {
    try {
      setLoading(true);
      
      // Mock signup - in a real app, you'd call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data (simplified for demo)
      await AsyncStorage.setItem("userRegistered", "true");
      await AsyncStorage.setItem("userType", userType);
      await AsyncStorage.setItem("userData", JSON.stringify({
        ...userData,
        userType
      }));
      
      // Create a default PIN for the user
      await AsyncStorage.setItem("userPin", "1234");
      
      setLoading(false);
      
      // Navigate to PIN setup or directly to home
      router.replace("/auth/login");
    } catch (error) {
      setLoading(false);
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <PageHeader 
            title="Create Account"
            subtitle="Join the Agri community today"
            showBackButton
            onBackPress={() => router.back()}
          />

          <Animated.View
            entering={FadeIn.duration(600)}
            style={styles.logoContainer}
          >
            <Image
              source={require("../../../assets/images/agri_logo.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View 
            entering={FadeIn.duration(600).delay(150)}
          >
            <UserTypeSelector 
              userType={userType}
              onSelectUserType={setUserType}
            />
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(600).delay(200)}
          >
            <SignupForm 
              onSubmit={handleSignup}
              userType={userType}
              loading={loading}
            />
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(600).delay(300)}
          >
            <LoginLink />
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
});

export default Signup;
