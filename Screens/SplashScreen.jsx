 import React, { useEffect, useState, useRef } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Animated, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const opacity = useRef(new Animated.Value(0)).current; 
  const [displayText, setDisplayText] = useState('');  
  const fullText = "Powered by PCS AGRI"; 

  useEffect(() => {
    // Animate opacity
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1300,
      useNativeDriver: true,
    }).start();
  
    // After 400ms, start the typing effect
    const typingTimeout = setTimeout(() => {
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayText((prev) => prev + fullText[index]);
          index++;
        } else {
          clearInterval(typingInterval); // Stop typing after finishing
        }
      }, 63); // Delay between characters

      // Cleanup for typing interval
      return () => clearInterval(typingInterval);
    }, 1300); // 400ms delay before typing starts

    // Cleanup timeout on unmount
    return () => clearTimeout(typingTimeout);
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require("./logo.png")} 
        style={[styles.logo, { opacity }]} 
      />
      <Text style={styles.typingText}>
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 33,
    marginBottom: 10,
  },
  typingText: {
    fontSize: 15, // Adjust font size as needed
    marginTop: 10,
    fontWeight : "400", 
    color : "#696969",
    fontFamily: 'sans-serif-light', // Light font for contrast with PEST ID

  },
   
});

export default SplashScreen;