import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

// Custom Components
import { Colors } from "../../Styles/Colors";
import { TextStyles } from "../../Styles/TextStyles";
import CButton from "../../Components/HomeScreen/Button";


const BillScreen = () => {

    // Navigation
    const navigation = useNavigation();

    const logo = require('../../assets/Images/Logos/logo.png');

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

    return (
        <SafeAreaView style={[Styles.MainCont, { paddingTop: statusBarHeight }]}>
            {/* StatusBar */}
            <StatusBar backgroundColor={Colors.White01} barStyle={"dark-content"} />
            {/* Logo */}
            <View style={Styles.logoCont}>
                <Image
                    source={logo}
                    style={Styles.logo}
                />
            </View>
            {/* Main Cont */}
            <View style={{ paddingTop: hp(4), paddingHorizontal: hp(2.05) }}>
                {/* Title */}
                <Text style={[TextStyles.M16G800]}>Create A New Bill</Text>
                {/* Button */}
                <TouchableOpacity 
                    onPress={() => navigation.navigate('CreateBill')}
                    activeOpacity={0.8}
                    style={{ paddingTop: hp(2.05) }}
                >
                    <CButton />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const Styles = StyleSheet.create({
    MainCont: {
        flex: 1,
        backgroundColor: "#F4F4F4",
    },
    logoCont: {
        alignItems: "center",
        marginTop: hp(2)
    },
    logo: {
        resizeMode: "contain",
        width: hp(30),
        height: hp(10),
    }
});

export default BillScreen;