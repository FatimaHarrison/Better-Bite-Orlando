import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
    return (
<SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>

    <View style={{ padding:20 }}>

        <Text style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#3D622C"
        }}>
            My Profile 👤
        </Text>

        <Text>
           Manage your account and dietary preferences.
        </Text>

    </View>
    </SafeAreaView>
    );
}