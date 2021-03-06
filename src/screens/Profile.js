import { useState, useEffect } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  View,
  Alert,
  StatusBar
} from "react-native";
import { supabase } from "../initSupabase";
import { ApiError, Session } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto'
import { Userpoint } from "../components/Userpoint";

import {
  Layout,
  Text,
  TextInput,
  Button,
} from "react-native-rapi-ui";
import { CircleButton, FocusedStatusBar } from "../components";
import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { useNavigation } from "@react-navigation/native";
import Avatar from "../components/Avatar";
import { fonts } from "react-native-elements/dist/config";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");

  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (!user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("profiles")
        .select('username, avatar_url')
        .eq("id", user.id)
        .single();
      
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      Alert.alert(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({username}) {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      if (!user) throw new Error("No user on the session!");

      const updates = {
        id: user.id,
        username,
        // avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase
        .from("profiles")
        .upsert(updates, { returning: "minimal" });

      if (error) {
        throw new Error;
      } else {
        Alert.alert("Update successful")
      }
    } catch (error) {
      Alert.alert(error);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      alert(error.message);
    }
  }
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <FocusedStatusBar backgroundColor={ COLORS.primary } />
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}>
            <View style = {{
              flexDirection: "row",
              justifyContent: "space-evenly"
            }}>
              <CircleButton
                imgUrl={assets.left}
                handlePress={() => navigation.goBack()}
                left={15}
                top={StatusBar.currentHeight}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  alignSelf: "center",
                  marginTop: 45,
                  color:COLORS.white,
                  fontSize: SIZES.large
                }}
              >
                Profile
              </Text>
            </View>
            <Avatar  
              url={avatar_url}
              size={150}
              onUpload={(url) => {
                setAvatarUrl(url)
                updateProfile({ username, website, avatar_url: url })
              }}
              />
            <Text style={{ 
              marginTop: 60,
              color: COLORS.primary,
              fontFamily: FONTS.bold,
              }}>Username
            </Text>
            <TextInput
             containerStyle={{ marginTop: 15 }}
             placeholder="Enter your username"
             value={username || ""}
             autoCapitalize="none"
             autoCompleteType="off"
             autoCorrect={false}
             keyboardType="default"
             onChangeText={(text) => setUsername(text)}
            />
            <Button
              color={COLORS.primary}
              text= {loading ? "Loading ..." : "Update"}
              onPress={() => {
                if (username.length > 3) {
                  updateProfile({ username });
                } else {
                  Alert.alert("Username too short!")
                }
              }}
              style = {{
                marginTop: 40
              }}
              disabled={loading}
            />
            <Button
              color={COLORS.primary}
              text= "Sign Out"
              onPress={() => {
                logout();
              }}
              style = {{
                marginTop: 20
              }}
              disabled={loading}
            />
          </View> 
          <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          <View
            style={{ 
              height: 280, 
              backgroundColor: COLORS.primary, 
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15}} />
          <View style={{ flex: 1, backgroundColor: COLORS.white }} />
        </View>
    </KeyboardAvoidingView>)
};

export default Profile;
