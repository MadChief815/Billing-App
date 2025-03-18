import React, {useState, useEffect} from 'react';
import {
  View,
  Keyboard
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Tab Screens
import HomeScreen from "../Screens/TabScreens/HomeScreen";
import PrinterScreen from "../Screens/TabScreens/PrinterScreen";

// Stack Screens
import CreateBillScreen from "../Screens/StackScreens/CreateBillScreen";

// SVGs
import PrinterIcon from "../assets/SVG/printer.svg";
import ReceiptIcon from "../assets/SVG/receipt.svg";
import FocusedPrinterIcon from "../assets/SVG/Focusedprinter.svg";
import FocusedReceiptIcon from "../assets/SVG/Focusedreceipt.svg";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

// Custom Tab Bar Icon Component
const TabBarIcon = ({ focused, IconComponent, DefaultIconComponent }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    {focused && IconComponent ? (
      <IconComponent width={hp(3.6)} height={hp(3.6)} />
    ) : DefaultIconComponent ? (
      <DefaultIconComponent width={hp(3.1)} height={hp(3.1)} />
    ) : null}
  </View>
);

// Main App Stack
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ animation: "fade" }} />
      <Stack.Screen name="CreateBill" component={CreateBillScreen} options={{ animation: "fade_from_bottom" }} />
    </Stack.Navigator>
  );
}

// Tab Navigator
function TabNavigator({ navigation }) {

  // Keyboard Hide
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Bill"
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        swipeEnabled: true,
        animationEnabled: true,
        tabBarIndicatorStyle: {
          backgroundColor: "transparent",
        },
        tabBarPressColor: 'rgba(179, 179, 182, 0.66)',
        tabBarPressOpacity: 0.8,
        tabBarStyle: isKeyboardVisible ? { display: 'none' } : {
          // borderTopLeftRadius: hp(2.6),
          // borderTopRightRadius: hp(2.6),
          backgroundColor: "#FFFFFF",
        },
        tabBarLabelStyle: { display: 'none' },
        tabBarIcon: ({ focused }) => {
          let IconComponent;
          let DefaultIconComponent;

          // Default behavior for other tabs
          switch (route.name) {
            case 'Bill':
              DefaultIconComponent = ReceiptIcon;
              IconComponent = FocusedReceiptIcon;
              break;
            case 'Printer':
              DefaultIconComponent = PrinterIcon;
              IconComponent = FocusedPrinterIcon;
              break;
            default:
              DefaultIconComponent = View; // Prevent undefined errors
              IconComponent = View; // Default to an empty view if undefined
          }

          return <TabBarIcon focused={focused} IconComponent={IconComponent} DefaultIconComponent={DefaultIconComponent} />;
        },
      })}
    >
      <Tab.Screen name="Bill" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Printer" component={PrinterScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return <MainStack />;
}