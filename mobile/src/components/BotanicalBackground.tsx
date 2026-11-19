import { View, Image, StyleSheet } from "react-native";

export default function BotanicalBackground() {
    return (
        <View
            style={styles.background}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
    >
       {/* Decorative background leaves */}
          <Image 
            source={require("../../assets/images/leaf-top-left.png")}
            style={styles.leafTopLeft}
            resizeMode="contain"
            />

         <Image 
        source={require("../../assets/images/leaf-top-right.png")}
        style={styles.leafTopRight}
        resizeMode="contain"
        />

         <Image 
        source={require("../../assets/images/leaf-mid-left.png")}
        style={styles.leafMidLeft}
        resizeMode="contain"
        />
            </View>
    );
}

const styles = StyleSheet.create({

    background: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },

    
  leafTopLeft: {
    position: "absolute",
    top: 35,
    left: -10,
    width: 85,
    height: 130,
    opacity: 0.5,
  },

  leafTopRight: {
    position: "absolute",
    top: 45,
    right: -10,
    width: 85,
    height: 130,
    opacity: 0.5,
  },

  leafMidLeft: {
    position: "absolute",
    top: 250,
    left: -15,
    width: 75,
    height: 120,
    opacity: 0.35,
  },

});