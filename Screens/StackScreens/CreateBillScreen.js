import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    Platform
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import ThermalPrinterModule from 'react-native-thermal-printer';

// Custom Components
import { Colors } from "../../Styles/Colors";
import { TextStyles } from "../../Styles/TextStyles";
import usePrinterStore from '../../Src/zustand';

// SVGs
import PlusIcon from "../../assets/SVG/BillScreen/plus.svg";
import MinusIcon from "../../assets/SVG/BillScreen/minus.svg";

// Images

const BillItem = ({ item, onUpdate, index, onDelete }) => {
    const handleUpdate = (field, value) => {
        onUpdate(item.id, field, value);
    };

    return (
        <View style={Styles.descriptionCont}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {/* Title */}
                <Text style={[TextStyles.M16G900, { paddingLeft: hp(1) }]}>
                    Description {index + 1}
                </Text>
                {/* Delete Item Button*/}
                <TouchableOpacity
                    onPress={() => onDelete(item.id)}
                    activeOpacity={0.5}
                >
                    <Text style={[TextStyles.SB15G900, { marginRight: hp(2), paddingTop: hp(0.5) }]}>✕</Text>
                </TouchableOpacity>
            </View>
            <View style={Styles.descriptionC}>
                <TextInput
                    style={[TextStyles.R14G500, item.description.length > 0 && TextStyles.SB14G900, { paddingHorizontal: hp(2.05), textAlignVertical: 'top', paddingTop: hp(1) }]}
                    placeholder={`Enter description`}
                    placeholderTextColor={"#979797"}
                    value={item.description || ''}
                    multiline
                    numberOfLines={4}
                    onChangeText={(text) => handleUpdate('description', text.replace(/[,:*]/g, ''))}
                />
            </View>
            <View style={Styles.QPCont}>
                {/* Quantity */}
                <View style={Styles.quantityCont}>
                    <TouchableOpacity
                        onPress={() => handleUpdate('count', Math.min(10, item.count + 1))}
                        activeOpacity={0.7}
                        style={[Styles.btn1, item.count === 10 && { opacity: 0.3 }]}
                    >
                        <PlusIcon width={hp(2.6)} height={hp(2.6)} />
                    </TouchableOpacity>
                    <View style={Styles.quantityShow}>
                        <Text style={[TextStyles.SB14G900, { textAlign: "center" }]}>{item.count}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleUpdate('count', Math.max(0, item.count - 1))}
                        activeOpacity={0.7}
                        style={[Styles.btn2, item.count === 0 && { opacity: 0.3 }]}
                    >
                        <MinusIcon width={hp(2.6)} height={hp(2.6)} />
                    </TouchableOpacity>
                </View>
                {/* Price */}
                <View style={Styles.priceCont}>
                    <Text style={[TextStyles.SM14G900]}>Price -</Text>
                    <View style={Styles.priceTextField}>
                        <TextInput
                            style={[TextStyles.R14G500, item.price.length > 0 && TextStyles.SB14G900, { paddingHorizontal: hp(1), paddingTop: hp(0.8) }]}
                            placeholder='LKR'
                            placeholderTextColor={'#999'}
                            value={item.price}
                            maxLength={6}
                            keyboardType='numeric'
                            onChangeText={(text) => handleUpdate('price', text.replace(/[^0-9]/g, ''))}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const CreateBillScreen = () => {
    const logo = require('../../assets/Images/Logos/logo.png');
    const [billItems, setBillItems] = useState([]);
    const [petName, setPetName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const { printerIP, printerPort } = usePrinterStore();
    const [isPrinting, setIsPrinting] = useState(false);

    const handleTextChange = (setter, text) => {
        setter(text);
    };

    const addNewItem = () => {
        setBillItems([
            ...billItems,
            { id: Date.now(), description: '', count: 0, price: '' }
        ]);
    };

    const updateItem = (id, field, value) => {
        setBillItems(billItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const deleteItem = (id) => {
        setBillItems(billItems.filter(item => item.id !== id));
    };

    // Generate Receipt as an ESC/POS formatted string
    const fetchLocalImageAsBase64 = async (imageAsset) => {
        try {
            const imageUri = Image.resolveAssetSource(imageAsset).uri; // Get the local image URI
            const response = await fetch(imageUri); // Fetch image data
            const blob = await response.blob();
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result.split(",")[1]); // Extract Base64 part
                reader.onerror = reject;
                reader.readAsDataURL(blob); // Convert to Base64
            });
        } catch (error) {
            console.error("Image Fetch Error:", error);
            return null;
        }
    };

    const generateReceipt = async () => {
        let receipt = "\x1B\x40"; // Initialize Printer
        receipt += "\x1B\x61\x01"; // Center Align

        // Convert the local image to Base64
        const base64Image = await fetchLocalImageAsBase64(logo);
        if (base64Image) {
            receipt += `\x1D\x76\x30\x00${base64Image}`; // ESC/POS command for image printing
        }

        receipt += "HelloWorld\n";
        receipt += "React Native\n";
        receipt += "Location\n";
        receipt += "00000000000 / 00000000000\n";
        receipt += "===========================\n";
        receipt += "       Invoice\n";
        receipt += `Date: ${new Date().toLocaleDateString()}\n`;
        receipt += "===========================\n";
        receipt += `Pet  : ${petName}\n`;
        receipt += `Owner: ${ownerName}\n`;
        receipt += "===========================\n";
        receipt += "Description       QTY    Amount\n";
        receipt += "--------------------------------\n";

        let totalAmount = 0;
        billItems.forEach((item) => {
            let description = item.description.padEnd(16, " ").slice(0, 16);
            let qty = (parseInt(item.count, 10) || 0).toString().padStart(3, " ");
            let amount = (parseFloat(item.price) || 0).toFixed(2).padStart(7, " ");
            receipt += `${description} ${qty}  ${amount}\n`;
            totalAmount += (parseFloat(item.price) || 0) * (parseInt(item.count, 10) || 0);
        });

        receipt += "--------------------------------\n";
        receipt += `Total Amount: ${totalAmount.toFixed(2).padStart(16, " ")}\n`;
        receipt += "===========================\n";
        receipt += "      Thank You!\n\n\n";

        return receipt;
    };

    // Function to send data to the network thermal printer
    const printReceipt = async () => {
        if (!printerIP || !printerPort || isNaN(parseInt(printerPort, 10))) {
            Alert.alert("Invalid Printer Settings", "Please check printer IP and Port.");
            return;
        }

        if (!petName || !ownerName || billItems.length === 0) {
            Alert.alert("Missing Information", "Ensure all fields are filled before printing.");
            return;
        }

        try {
            setIsPrinting(true); // Set to true before starting printing
            const receiptText = await generateReceipt(); // Wait for the receipt text
            console.log("Printing Receipt: ", receiptText);

            await ThermalPrinterModule.printTcp({
                ip: printerIP,
                port: parseInt(printerPort, 10),
                payload: receiptText,
            });

            Alert.alert("Success", "Receipt printed successfully!");
        } catch (error) {
            console.error("Print Error:", error);
            Alert.alert("Print Error", "Failed to print receipt.");
        } finally {
            setIsPrinting(false); 
            setPetName('');
            setOwnerName('');
            setBillItems([{ id: Date.now(), description: '', count: 0, price: '' }]);
        }
    };


    useFocusEffect(
        useCallback(() => {
            setPetName('');
            setOwnerName('');
            setBillItems([{ id: Date.now(), description: '', count: 0, price: '' }]);
            return () => {
                setPetName('');
                setOwnerName('');
                setBillItems([{ id: Date.now(), description: '', count: 0, price: '' }]);
            };
        }, [])
    );

    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: statusBarHeight }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Status Bar */}
                <StatusBar backgroundColor={Colors.White01} barStyle="dark-content" />
                {/* Header */}
                <View style={Styles.header}>
                    <Text style={[TextStyles.SB24G900, { textAlign: "center" }]}>New Bill</Text>
                </View>
                {/* Pet Name */}
                <View style={{ paddingTop: hp(2.05), paddingHorizontal: hp(2.05) }}>
                    <Text style={[TextStyles.M16G900, { paddingLeft: hp(1) }]}>Pet Name</Text>
                    <View style={Styles.PetOwnCont}>
                        <TextInput
                            style={[
                                TextStyles.R14G500,
                                petName.length > 0 && TextStyles.SB14G900,
                                { paddingHorizontal: hp(2.05) }
                            ]}
                            placeholder='Enter the pet name'
                            placeholderTextColor={Colors.Grayscale500}
                            value={petName}
                            onChangeText={(text) => handleTextChange(setPetName, text.replace(/[,:*]/g, ''))}
                        />
                    </View>
                </View>
                {/* Owner Name */}
                <View style={{ paddingTop: hp(2.05), paddingHorizontal: hp(2.05) }}>
                    <Text style={[TextStyles.M16G900, { paddingLeft: hp(1) }]}>Owner Name</Text>
                    <View style={Styles.PetOwnCont}>
                        <TextInput
                            style={[
                                TextStyles.R14G500,
                                ownerName.length > 0 && TextStyles.SB14G900,
                                { paddingHorizontal: hp(2.05) }
                            ]}
                            placeholder='Enter the owner name'
                            placeholderTextColor={Colors.Grayscale500}
                            value={ownerName}
                            onChangeText={(text) => handleTextChange(setOwnerName, text.replace(/[,:*]/g, ''))}
                        />
                    </View>
                </View>
                {/* Bill Items */}
                {billItems.map((item, index) => (
                    <BillItem key={item.id} item={item} index={index} onUpdate={updateItem} onDelete={deleteItem} />
                ))}
                {/* Add another descrition button */}
                <TouchableOpacity
                    onPress={addNewItem}
                    style={Styles.addItemBtn}
                    activeOpacity={0.7}
                >
                    <Text style={[TextStyles.SB14White, { textAlign: "center", fontSize: hp(1.7) }]}>ADD</Text>
                </TouchableOpacity>
                {/* Print Button */}
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    {isPrinting ? (
                        <View style={{ paddingVertical: hp(2) }}>
                            <ActivityIndicator size="large" color="#007AFF" />
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={printReceipt}
                            style={Styles.printBtn}
                            activeOpacity={0.7}
                        >
                            <Text style={[TextStyles.SB14White, { textAlign: "center" }]}>PRINT</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const Styles = StyleSheet.create({
    MainCont: {
        backgroundColor: "#F4F4F4",
    },
    header: {
        borderColor: Colors.Grayscale400,
        borderBottomWidth: 0.5,
        paddingBottom: hp(1.5)
    },
    PetOwnCont: {
        backgroundColor: Colors.Grayscale200,
        height: hp(6.2),
        borderRadius: hp(1),
        justifyContent: "center",
        marginTop: hp(1),
    },
    descriptionCont: {
        marginTop: hp(2.05),
        marginHorizontal: hp(2.05),
        borderWidth: 0.5,
        borderRadius: hp(1),
        borderColor: Colors.Grayscale400,
    },
    descriptionC: {
        backgroundColor: Colors.Grayscale200,
        height: hp(12),
        borderRadius: hp(1),
        marginTop: hp(1),
        marginBottom: hp(1),
        marginHorizontal: hp(1)
    },
    QPCont: {
        flexDirection: 'row',
        paddingBottom: hp(1),
        justifyContent: "space-between"
    },
    quantityCont: {
        flexDirection: 'row',
        paddingLeft: hp(1),
        alignItems: "center",
    },
    quantityShow: {
        width: hp(6.2),
        height: hp(4.5),
        backgroundColor: Colors.Grayscale200,
        justifyContent: "center",
        borderRadius: hp(1)
    },
    btn1: {
        marginRight: hp(0.8)
    },
    btn2: {
        marginLeft: hp(0.8)
    },
    priceCont: {
        alignItems: "center",
        flexDirection: "row"
    },
    priceTextField: {
        backgroundColor: Colors.Grayscale200,
        height: hp(4.5),
        width: hp(15),
        borderRadius: hp(1),
        marginRight: hp(1),
        marginLeft: hp(0.8)
    },
    addItemBtn: {
        height: hp(4),
        width: hp(8),
        justifyContent: "center",
        backgroundColor: Colors.AdditonalBlue,
        borderRadius: hp(1),
        marginLeft: hp(2.05),
        marginTop: hp(1),
    },
    printBtn: {
        backgroundColor: Colors.AdditonalBlue,
        height: hp(6.2),
        borderRadius: hp(1),
        justifyContent: "center",
        marginHorizontal: hp(2.05),
        marginVertical: hp(2)
    }
});

export default CreateBillScreen;