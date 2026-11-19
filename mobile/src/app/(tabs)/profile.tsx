import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useRouter } from "expo-router";



export default function ProfileScreen() {

        const router = useRouter();

return (

<SafeAreaView

    style={{
        flex: 1,
        backgroundColor: "#FAF6F1"
        }}
   >

    <View style={{ padding:24 }}>

        {/* Profile header */ }
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

        {/* Guest profile card */}
        <View 
         style={{
                        backgroundColor: "#A5C2A2",
                        borderRadius: 24,
                        padding: 24,
                        alignItems: "center",
                    }}
                >
        <Text 
            style={{
                fontSize: 24,
                fontWeight: "800",
                color: "#315A29",
                textAlign: "center",
                marginBottom: 15,
            }}
            >
                Welcome to Better Bite! 
            </Text>
            
            <Text 
                        style={{
            fontSize: 14,
            color: "#315A29",
            textAlign: "center",
            lineHeight: 22,
            marginBottom: 25,
        }}
        >
            Sign in to manage your profile, 
            save your favorite places, and personalize your experience. 
        </Text>

        {/* Sign In Button */}

            <Pressable
            onPress={() => router.push("/sign-in")}
            accessibilityRole="button"
            style={({ pressed }) => ({
                backgroundColor:"#315A29",
                borderRadius: 14,
                paddingVertical: 16,
                width: "100%",
                alignItems: "center",
                opacity: pressed ? 0.85 : 1,
            })}
            >
                <Text 
                    style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: "700",
                    }}
                >
                    Sign In
                </Text>
            
            </Pressable>

                {/* Sign up navigation */}

                <View 
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                           marginTop: 25,
                            flexWrap: "wrap",
                        }}
                    >
                        <Text 
                                                    style={{
                                color: "#315A29",
                                fontSize: 14,
                            }}
                        >
                            Dont have an account? {""}
                        </Text>
   
 <Link
                            href="/sign-up"
                            style={{
                                color: "#E87522",
                                fontSize: 14,
                                fontWeight: "700",
                                textDecorationLine: "underline",
                            }}
                        >
                            Sign Up
                        </Link>


                </View>
        </View>    

    </View>
    </SafeAreaView>
    );
}