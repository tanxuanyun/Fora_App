import React, { useState } from "react";
// import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { supabase } from "../initSupabase";
import { AuthStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";

import * as Linking from 'expo-linking';

const ResetPassword = ({ navigation }) => {
    const { isDarkmode, setTheme } = useTheme();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // async function forget() {
    //     setLoading(true);
    //     const { data, error } = await supabase.auth.api.resetPasswordForEmail(
    //       email
    //     );
    //     if (!error) {
    //       setLoading(false);
    //       alert("Check your email to reset your password!");
    //     }
    //     if (error) {
    //       setLoading(false);
    //       alert(error.message);
    //     }
    //   }

    async function reset({password}) {
        setLoading(true);
        const { user, error } = await supabase.auth.update({password: password})

        if (!error) {
            setLoading(false);
            navigation.navigate("Login");
        }
        if (error) {
            setLoading(false);
            alert(error.message);
        }
    }

      return (
        <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
          <Layout>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
                }}
              >
                <Image
                  resizeMode="contain"
                  style={{
                    height: 220,
                    width: 220,
                  }}
                  source={require("../assets/images/forget.png")}
                />
              </View>
              <View
                style={{
                  flex: 3,
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                  backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
                }}
              >
                <Text
                  size="h3"
                  fontWeight="bold"
                  style={{
                    alignSelf: "center",
                    padding: 30,
                  }}
                >
                  Reset Password
                </Text>
                <Text>Password</Text>
                <TextInput
                containerStyle={{ marginTop: 15 }}
                placeholder="Enter your password"
                value={password}
                autoCapitalize="none"
                autoCompleteType="off"
                autoCorrect={false}
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                />
                <Button
                  text={loading ? "Loading" : "Set password"}
                  onPress={() => {
                    reset(password);
                  }}
                  style={{
                    marginTop: 20,
                  }}
                  disabled={loading}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 30,
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      isDarkmode ? setTheme("light") : setTheme("dark");
                    }}
                  >
                    <Text
                      size="md"
                      fontWeight="bold"
                      style={{
                        marginLeft: 5,
                      }}
                    >
                      {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </Layout>
        </KeyboardAvoidingView>
      );
}

export default ResetPassword;