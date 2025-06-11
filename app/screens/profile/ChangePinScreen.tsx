import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const PIN_LENGTH = 4;

const ChangePinScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<'current' | 'new' | 'confirm'>('current');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const getActivePin = () => {
    switch (step) {
      case 'current':
        return currentPin;
      case 'new':
        return newPin;
      case 'confirm':
        return confirmPin;
    }
  };

  const setActivePin = (value: string) => {
    switch (step) {
      case 'current':
        setCurrentPin(value);
        break;
      case 'new':
        setNewPin(value);
        break;
      case 'confirm':
        setConfirmPin(value);
        break;
    }
  };

  const handleNumberPress = (number: number) => {
    const currentValue = getActivePin();
    if (currentValue.length < PIN_LENGTH) {
      const newValue = currentValue + number;
      setActivePin(newValue);

      if (newValue.length === PIN_LENGTH) {
        if (step === 'current') {
          // Validate current PIN here
          setTimeout(() => {
            setStep('new');
          }, 300);
        } else if (step === 'new') {
          setTimeout(() => {
            setStep('confirm');
          }, 300);
        } else if (step === 'confirm') {
          if (newValue === newPin) {
            // Implement PIN change logic here
            Alert.alert(
              'Success',
              'PIN changed successfully',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          } else {
            Alert.alert('Error', 'PINs do not match');
            setConfirmPin('');
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    const currentValue = getActivePin();
    if (currentValue.length > 0) {
      setActivePin(currentValue.slice(0, -1));
    }
  };

  const renderPinDots = () => {
    const pin = getActivePin();
    return (
      <View style={styles.dotsContainer}>
        {Array(PIN_LENGTH).fill(0).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index < pin.length ? styles.dotFilled : null
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKeypadButton = (number: number | string) => (
    <TouchableOpacity
      style={styles.keypadButton}
      onPress={() => {
        if (typeof number === 'number') {
          handleNumberPress(number);
        }
      }}
    >
      <Text style={styles.keypadButtonText}>{number}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change PIN</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.pinSection}>
          <Text style={styles.instruction}>
            {step === 'current' ? 'Enter current PIN' :
             step === 'new' ? 'Enter new PIN' :
             'Confirm new PIN'}
          </Text>
          {renderPinDots()}
        </View>

        <View style={styles.keypad}>
          <View style={styles.keypadRow}>
            {renderKeypadButton(1)}
            {renderKeypadButton(2)}
            {renderKeypadButton(3)}
          </View>
          <View style={styles.keypadRow}>
            {renderKeypadButton(4)}
            {renderKeypadButton(5)}
            {renderKeypadButton(6)}
          </View>
          <View style={styles.keypadRow}>
            {renderKeypadButton(7)}
            {renderKeypadButton(8)}
            {renderKeypadButton(9)}
          </View>
          <View style={styles.keypadRow}>
            <View style={styles.keypadButton} />
            {renderKeypadButton(0)}
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={handleBackspace}
            >
              <Feather name="delete" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#045555',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  pinSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  instruction: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#045555',
  },
  dotFilled: {
    backgroundColor: '#045555',
  },
  keypad: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  keypadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  keypadButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: '600',
  },
});

export default ChangePinScreen; 