import React, { useState, useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    Image,
    StyleSheet,
    Alert
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Navigators
import TabNavigator from './TabNavigator';

// Custom Components
import { Colors } from "../Styles/Colors";

// Images

const EXPIRY_DATE = new Date("2030-04-14"); 

export default function MainNavigator() {
    const [loading, setLoading] = useState(true);
    const [expired, setExpired] = useState(false);

    const logo = require('../assets/Images/Logos/logo.png');

    useEffect(() => {
        // Expiry check
        const today = new Date();
        if (today > EXPIRY_DATE) {
            Alert.alert("App Expired", "Contact the developer.");
            setExpired(true);
            return; 
        }

        // Fake loading for splash screen
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    if (expired) {
        return null; // Stops rendering if expired
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={logo} style={Styles.Logo} />
                <View style={{ paddingTop: 10 }}>
                    <ActivityIndicator size={hp(4)} color={Colors.AdditonalBlue} style={Styles.Indicator} />
                </View>
            </View>
        );
    }

    return <TabNavigator />;
}

const Styles = StyleSheet.create({
    Indicator: {},
    Logo: {
        width: hp(30),
        height: hp(20),
        resizeMode: "contain"
    },
});
