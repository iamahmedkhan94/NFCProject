import React, {useCallback, useMemo, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

function App() {
  const [nfcTag, setNfcTag] = useState<any>({});
  // Initialize NFCManager when the component mounts
  useEffect(() => {
    NfcManager.start();
    return () => {
      // Stop NFC scanning when the component un-mounts
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  // Memoize the readNdef function to prevent unnecessary renders
  const readNdef = useCallback(async () => {
    try {
      // Request NFC technology for NDEF tags
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // Get the tag information
      const tag = await NfcManager.getTag();
      setNfcTag(JSON.stringify(tag));
      console.warn('Tag found', tag);
    } catch (ex) {
      console.warn('Error reading NFC tag', ex);
      // Display an error message to the user
      Alert.alert('Error', 'Failed to read NFC tag. Please try again.');
    } finally {
      // Stop NFC scanning
      NfcManager.cancelTechnologyRequest();
    }
  }, []);

  // Check if the device supports NFC
  const isNfcSupported = useMemo(() => {
    return NfcManager.isSupported;
  }, []);

  // Display a message if the device does not support NFC
  if (!isNfcSupported) {
    return (
      <View style={styles.wrapper}>
        <Text>NFC is not supported on this device.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={readNdef}>
        <Text>Scan a Tag</Text>
        {nfcTag && <Text> NFC Tag: {nfcTag}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
