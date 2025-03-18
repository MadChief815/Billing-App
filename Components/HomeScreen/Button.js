import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import { Colors } from '../../Styles/Colors';
import { TextStyles } from '../../Styles/TextStyles';

const Button = () => {
    return (
        <View style={Styles.MainCont}>
            <Text style={[TextStyles.M16White, { textAlign: "center" }]}>New Bill</Text>
        </View>
    );
};

const Styles = StyleSheet.create({
    MainCont: {
        height: hp(5.9),
        backgroundColor: Colors.AdditonalBlue,
        borderRadius: hp(1.3),
        justifyContent: "center",
    }
});

export default Button;