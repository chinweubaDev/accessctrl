import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BarcodeScannerProps {
  onCodeScanned: (value: string) => void;
}

const Scanner = ({ onCodeScanned }: BarcodeScannerProps) => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        type="back"
        onBarCodeScanned={({ data }: { data: string }) => onCodeScanned(data)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default Scanner; 