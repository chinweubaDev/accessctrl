import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface GatePass {
  code: string;
  visitorName: string;
  purpose: string;
  validFrom: string;
  validUntil: string;
  status: 'active' | 'expired' | 'pending';
}

const GatePassScreen = () => {
  const navigation = useNavigation();
  const [visitorName, setVisitorName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [validityDays, setValidityDays] = useState('1');
  const [generatedPass, setGeneratedPass] = useState<GatePass | null>(null);

  const generatePassCode = () => {
    // Generate a random 8-character alphanumeric code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleGeneratePass = () => {
    if (!visitorName || !purpose) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setDate(validUntil.getDate() + parseInt(validityDays));

    const pass: GatePass = {
      code: generatePassCode(),
      visitorName,
      purpose,
      validFrom: now.toISOString(),
      validUntil: validUntil.toISOString(),
      status: 'active',
    };

    setGeneratedPass(pass);
  };

  const handleShare = async () => {
    if (!generatedPass) return;

    try {
      const message = `
Gate Pass Details:
Code: ${generatedPass.code}
Visitor: ${generatedPass.visitorName}
Purpose: ${generatedPass.purpose}
Valid Until: ${new Date(generatedPass.validUntil).toLocaleDateString()}
      `;

      await Share.share({
        message,
        title: 'Gate Pass',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share gate pass');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#045555" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generate Gate Pass</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!generatedPass ? (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Visitor Information</Text>
            
            <Text style={styles.label}>Visitor Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter visitor's name"
              value={visitorName}
              onChangeText={setVisitorName}
            />

            <Text style={styles.label}>Purpose of Visit</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter purpose of visit"
              value={purpose}
              onChangeText={setPurpose}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Validity (Days)</Text>
            <TextInput
              style={styles.input}
              placeholder="Number of days"
              value={validityDays}
              onChangeText={setValidityDays}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGeneratePass}
            >
              <Text style={styles.generateButtonText}>Generate Pass</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.passContainer}>
            <View style={styles.passCard}>
              <View style={styles.qrContainer}>
                <QRCode
                  value={generatedPass.code}
                  size={200}
                  color="#045555"
                />
              </View>
              
              <Text style={styles.passCode}>{generatedPass.code}</Text>
              
              <View style={styles.passInfo}>
                <View style={styles.passRow}>
                  <Text style={styles.passLabel}>Visitor:</Text>
                  <Text style={styles.passValue}>{generatedPass.visitorName}</Text>
                </View>
                
                <View style={styles.passRow}>
                  <Text style={styles.passLabel}>Purpose:</Text>
                  <Text style={styles.passValue}>{generatedPass.purpose}</Text>
                </View>
                
                <View style={styles.passRow}>
                  <Text style={styles.passLabel}>Valid Until:</Text>
                  <Text style={styles.passValue}>
                    {new Date(generatedPass.validUntil).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.shareButton]}
                  onPress={handleShare}
                >
                  <Feather name="share-2" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.newPassButton]}
                  onPress={() => setGeneratedPass(null)}
                >
                  <Feather name="plus" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>New Pass</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
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
    backgroundColor: '#045555',
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
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#045555',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passContainer: {
    padding: 16,
  },
  passCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  passCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#045555',
    marginBottom: 20,
    letterSpacing: 2,
  },
  passInfo: {
    width: '100%',
    marginBottom: 24,
  },
  passRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  passLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  passValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 8,
  },
  shareButton: {
    backgroundColor: '#045555',
  },
  newPassButton: {
    backgroundColor: '#666',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default GatePassScreen; 