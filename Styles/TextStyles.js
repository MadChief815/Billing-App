import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';


export const TextStyles = StyleSheet.create({

    // FontSize 14 Regular
    R14G500: {
        color: Colors.Grayscale500,
        fontSize: hp(1.8),
        fontWeight: "400"
    },

    // FontSize 14 Semi Medium
    SM14G900: {
        color: Colors.Grayscale900,
        fontSize: hp(1.8),
        fontWeight: "500"
    },

    // FontSize 14 Medium
    M14G500: {
        color: Colors.Grayscale500,
        fontSize: hp(1.8),
        fontWeight: "600"
    },
    M14Orange: {
        color: Colors.PrimaryOrange,
        fontSize: hp(1.8),
        fontWeight: "600"
    },

    // FontSize 14 Medium
    M16White: {
        color: Colors.AdditionalWhite,
        fontSize: hp(2),
        fontWeight: "800"
    },

    // FontSize 14 Semi Bold
    SB14G900: {
        color: Colors.Grayscale800,
        fontSize: hp(1.8),
        fontWeight: "800"
    },
    SB14White: {
        color: Colors.AdditionalWhite,
        fontSize: hp(1.8),
        fontWeight: "800"
    },

    // FontSize 15 Semi Bold
    SB15G900: {
        color: Colors.Grayscale900,
        fontSize: hp(1.9),
        fontWeight: "900"
    },

    // FontSize 16 Regular
    R16G300: {
        color: Colors.Grayscale300,
        fontSize: hp(2.05),
        fontWeight: "400"
    },

    // FontSize 16 Medium
    M16G600: {
        color: Colors.Grayscale500,
        fontSize: hp(2.05),
        fontWeight: "600"
    },
    M16G800: {
        color: Colors.Grayscale800,
        fontSize: hp(2.05),
        fontWeight: "600"
    },
    M16G900: {
        color: Colors.Grayscale900,
        fontSize: hp(2.05),
        fontWeight: "600"
    },
    M16Orange: {
        color: Colors.PrimaryOrange,
        fontSize: hp(2.05),
        fontWeight: "600"
    },

    // FontSize 24 Semi Bold
    SB24white: {
        color: Colors.AdditionalWhite,
        fontSize: hp(3.1),
        fontWeight: "800"
    },
    SB24G900: {
        color: Colors.Grayscale900,
        fontSize: hp(3.1),
        fontWeight: "800"
    },
    
});