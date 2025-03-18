import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Zustand store with AsyncStorage
const usePrinterStore = create((set) => ({
  printerIP: '',
  printerPort: '9100', // Default port

  setPrinterIP: async (ip) => {
    set({ printerIP: ip });
    await AsyncStorage.setItem('printerIP', ip);
  },

  setPrinterPort: async (port) => {
    set({ printerPort: port });
    await AsyncStorage.setItem('printerPort', port);
  },

  loadPrinterSettings: async () => {
    const savedIP = await AsyncStorage.getItem('printerIP');
    const savedPort = await AsyncStorage.getItem('printerPort');
    set({
      printerIP: savedIP || '',
      printerPort: savedPort || '9100',
    });
  },
}));

export default usePrinterStore;
