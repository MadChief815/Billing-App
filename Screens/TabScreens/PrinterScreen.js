import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Image,
    TextInput,
    TouchableOpacity,
    Platform
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import { Colors } from "../../Styles/Colors";
import { TextStyles } from '../../Styles/TextStyles';

// Zustand Store
import usePrinterStore from '../../Src/zustand';

// Images

const PrinterConnectScreen = () => {

    const logo = require('../../assets/Images/printer.png');

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

    // Printer IP & Port Number
    const { printerIP, printerPort, setPrinterIP, setPrinterPort, loadPrinterSettings } = usePrinterStore();

    // TextInput Text Handler
    const handleTextChange = (setter, text) => {
        setter(text);
    };

    // Load printer settings on component mount
    useEffect(() => {
        loadPrinterSettings();
    }, []);

    // Save Printer Data
    const handlSaveData = () => {
        setPrinterIP(printerIP);
        setPrinterPort(printerPort);
    };

    return (
        <SafeAreaView style={[Styles.MainCont, { paddingTop: statusBarHeight }]}>
            {/* StatusBar */}
            <StatusBar backgroundColor={Colors.White01} barStyle={"dark-content"} />
            {/* Header */}
            <View style={Styles.header}>
                <Text style={[TextStyles.SB24G900, { textAlign: "center" }]}>Printer</Text>
            </View>
            {/* Printer Image */}
            <Image
                source={logo}
                style={Styles.image}
            />
            {/* Connect Printer */}
            {/* IP */}
            <View style={{ paddingHorizontal: hp(2.05) }}>
                <Text style={[TextStyles.M16G900, { paddingLeft: hp(1) }]}>Enter Your Printer IP & Port</Text>
                <View style={Styles.textInputCont}>
                    <TextInput
                        style={[
                            TextStyles.R14G500,
                            printerIP.length > 0 && TextStyles.SB14G900,
                            { paddingHorizontal: hp(2.05) }
                        ]}
                        placeholder='Enter the printer IP address'
                        placeholderTextColor={Colors.Grayscale500}
                        value={printerIP}
                        keyboardType='numeric'
                        maxLength={15}
                        onChangeText={(text) => handleTextChange(setPrinterIP, text.replace(/[^0-9.]/g, ''))}
                    />
                </View>
            </View>
            {/* Port */}
            <View style={{ paddingHorizontal: hp(2.05) }}>
                <View style={Styles.textInputCont}>
                    <TextInput
                        style={[
                            TextStyles.R14G500,
                            printerPort.length > 0 && TextStyles.SB14G900,
                            { paddingHorizontal: hp(2.05) }
                        ]}
                        placeholder='Enter the printer PORT number'
                        placeholderTextColor={Colors.Grayscale500}
                        value={printerPort}
                        keyboardType='numeric'
                        maxLength={6}
                        onChangeText={(text) => handleTextChange(setPrinterPort, text.replace(/[^0-9.]/g, ''))}
                    />
                </View>
            </View>
            {/* Saved */}
            {printerIP && printerPort ? (
                <View style={Styles.savedCont}>
                    <Text style={[TextStyles.SB14G900, { textAlign: "center" }]}>Saved</Text>
                </View>
            ) : null}

            {/* Connect Button */}
            <View style={Styles.connectBtnCont}>
                <TouchableOpacity
                    onPress={handlSaveData}
                    activeOpacity={0.7}
                    style={Styles.connectBtn}
                >
                    <Text style={[TextStyles.SB14White, { textAlign: "center" }]}>SAVE</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const Styles = StyleSheet.create({
    MainCont: {
        flex: 1,
        backgroundColor: "#F4F4F4"
    },
    header: {
        borderColor: Colors.Grayscale400,
        borderBottomWidth: 0.5,
        paddingBottom: hp(1.5)
    },
    image: {
        resizeMode: "contain",
        height: hp(30),
        width: hp(30),
        alignSelf: "center",
    },
    textInputCont: {
        backgroundColor: Colors.Grayscale200,
        height: hp(6.2),
        borderRadius: hp(1),
        justifyContent: "center",
        marginTop: hp(1),
    },
    connectBtnCont: {
        flex: 1,
        paddingHorizontal: hp(2.05),
        paddingVertical: hp(2),
        justifyContent: "flex-end"
    },
    connectBtn: {
        height: hp(6.2),
        borderRadius: hp(1),
        justifyContent: "center",
        backgroundColor: Colors.AdditonalBlue
    },
    savedCont: {
        height: hp(4),
        width: hp(8),
        borderRadius: hp(1),
        backgroundColor: Colors.AdditionalGreen,
        justifyContent: "center",
        marginTop: hp(1),
        marginLeft: hp(2.05)
    }
});

export default PrinterConnectScreen;