import React from "react";
import { View, Text, Image, TextInput } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { ProfileButton, ArchiveButton, RectButton } from "./Button";
import { supabase, supabaseUrl } from "../initSupabase";
import { useState, useEffect } from 'react'

import { COLORS, FONTS, SIZES, assets } from "../constants";
//import from from "../../__mocks__/@react-native-async-storage/async-storage";

const HomeHeader = ({ onSearch }) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState();
  const [point, setPoint] = useState("");
  const [session, setSession] = useState(null)
  const isFocused = useIsFocused();

  useEffect(() => {
    const getUsername = async() => {
      try {
        const user = supabase.auth.user();
        if (!user) throw new Error("No user on the session!");
        let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user.id)
        .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.username)
          setAvatarUrl(supabaseUrl + '/storage/v1/object/public/avatars/' + data.avatar_url)
        }
      } catch (error) {
        alert(error);
      } 
    };

    const getPoint = async() => {
      try {
        const user = supabase.auth.user();
        if (!user) throw new Error("No user on the session!");
        let { data, error, status } = await supabase
        .from("profiles")
        .select(`user_points`)
        .eq("id", user.id)
        .single();

        if (error && status !== 406) {
          throw error;
        }
  
        if (data) {
          setPoint(data.user_points)
        }
      } catch (error) {
        alert(error);
      } 
    };

    getUsername();
    getPoint();

  },[isFocused]);

  return (
    <View
      style={{
        backgroundColor: COLORS.primary,
        padding: SIZES.font,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          source={assets.logo}
          resizeMode="contain"
          style={{ width: 80, height: 50 }}
        />

        <Text style={{color: COLORS.white, textAlign: "right", fontSize: SIZES.large}}>{point} Points</Text>
        
        <View style={{ width: 90, height: 45 }}>
          <View style={{alignItems:"flex-start"}}>
          <ArchiveButton 
            imgUrl={assets.box} 
            handlePress={() => navigation.navigate("Expired")}
            />
          </View>

          <View style={{alignItems:"flex-end"}}>
            <ProfileButton 
              imgUrl={avatarUrl} 
              handlePress={() => navigation.navigate("Portfolio")}
              />
          </View>
        </View>
      </View>

      <View style={{ marginVertical: SIZES.font }}>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: SIZES.small,
            color: COLORS.white,
          }}
        >
          Hello {username} 👋
        </Text>

        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: SIZES.large,
            color: COLORS.white,
            marginTop: SIZES.base / 2,
          }}
        >
          Click on "Place a bid" to start!
        </Text>
      </View>
      {/* <View style = {{
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingRight: 220,
        alignContent: "center",
      }}>
        <RectButton
          minWidth={70}
          fontSize={SIZES.small}
          handlePress={() => navigation.navigate("Details", { data })}
          text = {"Current"}
          backgroundColor={COLORS.white}
          textColor={COLORS.primary}
        />
        <RectButton
          minWidth={70}
          fontSize={SIZES.small}
          handlePress={() => navigation.navigate("Details", { data })}
          text = {"Archive"}
          backgroundColor={COLORS.white}
          textColor={COLORS.primary}
        />
      </View> */}
      <View style={{ marginTop: SIZES.font }}>
        <View
          style={{
            width: "100%",
            borderRadius: SIZES.font,
            backgroundColor: COLORS.gray,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: SIZES.font,
            paddingVertical: SIZES.small - 2,
          }}
        >
          <Image
            source={assets.search}
            resizeMode="contain"
            style={{ width: 20, height: 20, marginRight: SIZES.base }}
          />
          <TextInput
            placeholder="Search Categories"
            style={{ flex: 1 }}
            onChangeText={onSearch}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
