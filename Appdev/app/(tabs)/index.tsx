import { Text, View, Image, ScrollView } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import SearchBar from "@/app/components/SearchBar";

export default function Index() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <Image
        source={images.bg}
        style={{ position: "absolute", width: "100%", zIndex: 0 }}
        resizeMode="cover"
      />
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image
          source={icons.logo}
          style={{
            width: 48,
            height: 40,
            marginTop: 80,
            marginBottom: 20,
            alignSelf: "center",
          }}
        />
        <View style={{ flex: 1, marginTop: 20 }}>
          <SearchBar
            onPress={() => {
              router.push("/search");
            }}
            placeholder="Search for any topic"
          />
        </View>
      </ScrollView>
    </View>
  );
}
