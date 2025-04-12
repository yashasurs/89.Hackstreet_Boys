import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";
import SearchBar from "@/app/components/SearchBar";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth for authentication

interface Section {
  title: string;
  content: string;
  key_points: string[];
}

interface Content {
  topic: string;
  summary: string;
  sections: Section[];
  references: string[];
  difficulty_level: string;
}

interface Video {
  title: string;
  url: string;
  thumbnail_url: string;
}

const SearchContentScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<Content | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const { token } = useAuth(); // Get the token from AuthContext
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a topic to search.");
      return;
    }

    setLoading(true);
    try {
      // Fetch content
      const contentResponse = await fetch("http://172.16.14.94:8000/api/generate-content/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`, // Add the token to the Authorization header
        },
        body: JSON.stringify({ topic: searchQuery }),
      });
      const contentData: Content = await contentResponse.json();
      setContent(contentData);

      // Fetch video links
      const videoResponse = await fetch("http://172.16.14.94:8000/api/video-links/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`, // Add the token to the Authorization header
        },
        body: JSON.stringify({ topic: searchQuery }),
      });
      const videoData = await videoResponse.json();
      setVideos(videoData.videos);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderVideoItem = ({ item }: { item: Video }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => Linking.openURL(item.url)} // Use Linking to open external URLs
    >
      <Image source={{ uri: item.thumbnail_url }} style={styles.videoThumbnail} />
      <Text style={styles.videoTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      {/* Background Image */}
      <Image
        source={images.bg}
        style={{ position: "absolute", width: "100%", height: "100%", zIndex: 0 }}
        resizeMode="cover"
      />

      {/* Search Bar */}
      <View style={{ padding: 16, zIndex: 1 }}>
        <SearchBar
          placeholder="Search for a topic..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Submit Button */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16, zIndex: 1 }}>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20, zIndex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#8B5CF6" />
        ) : (
          <>
            {/* Render Videos */}
            {videos.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF", marginBottom: 8 }}>
                  Related Videos
                </Text>
                <FlatList
                  data={videos}
                  renderItem={renderVideoItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}

            {/* Render Content */}
            {content ? (
              <View>
                {/* Topic */}
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#FFFFFF", marginBottom: 16 }}>
                  {content.topic}
                </Text>

                {/* Summary */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF" }}>Summary</Text>
                  <Text style={{ color: "#A8B5DB" }}>{content.summary}</Text>
                </View>

                {/* Sections */}
                {content.sections.map((section, index) => (
                  <View
                    key={index}
                    style={{
                      marginBottom: 24,
                      borderBottomWidth: 1,
                      borderColor: "#374151",
                      paddingBottom: 16,
                      backgroundColor: "#2E2E3E",
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#FFFFFF",
                        marginBottom: 8,
                      }}
                    >
                      {section.title}
                    </Text>
                    <Text style={{ color: "#A8B5DB", marginBottom: 8 }}>{section.content}</Text>
                    <Text style={{ fontWeight: "bold", color: "#FFFFFF" }}>Key Points:</Text>
                    <View style={{ marginTop: 8 }}>
                      {section.key_points.map((point, idx) => (
                        <Text key={idx} style={{ color: "#A8B5DB", paddingLeft: 16 }}>
                          • {point}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}

                {/* References */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF" }}>References</Text>
                  {content.references.map((reference, idx) => (
                    <Text key={idx} style={{ color: "#A8B5DB" }}>
                      • {reference}
                    </Text>
                  ))}
                </View>

                {/* Difficulty Level */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFFFFF" }}>
                    Difficulty Level
                  </Text>
                  <Text style={{ color: "#A8B5DB" }}>{content.difficulty_level}</Text>
                </View>

                {/* Take a Test Button */}
                <View style={{ marginTop: 20, alignItems: "center" }}>
                  <TouchableOpacity
                    style={styles.testButton}
                    onPress={() =>
                      router.push({
                        pathname: "../screen/take-test",
                        params: { content: JSON.stringify(content) },
                      })
                    }
                  >
                    <Text style={styles.testButtonText}>Take a Test</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={{ textAlign: "center", color: "#A8B5DB" }}>
                {content ? content : "No content to display. Search for a topic to get started."}
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "relative",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 6,
    backgroundColor: "#7d2ae8",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  testButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  testButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  videoItem: {
    marginRight: 16,
    alignItems: "center",
    width: 200,
  },
  videoThumbnail: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  videoTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default SearchContentScreen;