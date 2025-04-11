import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useRouter, Redirect } from "expo-router";
import SearchBar from "@/app/components/SearchBar";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { user, token } = useAuth();
  const router = useRouter();

  if (!token) {
    return <Redirect href="../screen/register" />;
  }

  const categories = ["Programming", "Math", "Science", "AI", "Design"];

  return (
    <View style={{ flex: 1, backgroundColor: "#0D0D0D" }}>
      {/* Background Image */}
      <Image
        source={images.bg}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
        resizeMode="cover"
        blurRadius={2}
      />

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Logo */}
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

        {/* Search Bar */}
        <View style={{ marginBottom: 30 }}>
          <SearchBar
            onPress={() => router.push("/search")}
            placeholder="Search for any topic"
          />
        </View>

        {/* Welcome Text */}
        <Text style={{ color: "#fff", fontSize: 26, fontWeight: "700", marginBottom: 4 }}>
          Hey, Learner 👋
        </Text>
        <Text style={{ color: "#bbb", fontSize: 15, marginBottom: 24 }}>
          Let’s dive into something new today!
        </Text>

        {/* Categories */}
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
          Categories
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: "#1A1A1A",
                paddingVertical: 10,
                paddingHorizontal: 18,
                borderRadius: 24,
                marginRight: 12,
                shadowColor: "#8000FF",
                shadowOpacity: 0.2,
                shadowRadius: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 14 }}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Courses */}
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "600",
            marginTop: 30,
            marginBottom: 15,
          }}
        >
          Featured Courses
        </Text>

        {[1, 2, 3].map((item) => (
          <TouchableOpacity
            key={item}
            style={{
              backgroundColor: "#1C1C1C",
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              shadowColor: "#9A40FF",
              shadowOpacity: 0.15,
              shadowRadius: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Course Title {item}
              </Text>
              <Text style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
                by Instructor Name
              </Text>
            </View>
            <Image
              source={{ uri: "https://via.placeholder.com/60" }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 12,
                marginLeft: 10,
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
