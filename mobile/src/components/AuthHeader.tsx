import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { colors } from "../theme/colors";

export default function AuthHeader() {
    const router = useRouter();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/");
        }
    };

    return (
        <View style={styles.header}>
            <Pressable 
                onPress={handleBack}
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                >
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  backIcon: {
    fontSize: 25,
    color: colors.primary,
    fontWeight: "600",
  },
});