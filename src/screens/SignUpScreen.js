import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const languages = [
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

const situations = [
    { name: 'Wheelchair user', icon: 'body' },
    { name: 'Visual impairment', icon: 'eye' },
    { name: 'Hearing impairment', icon: 'ear' },
    { name: 'Temporary injury', icon: 'medkit' },
    { name: 'Cognitive disability', icon: 'brain' },
    { name: 'Walking difficulty', icon: 'walk' },
    { name: 'Blind', icon: 'eye-off' },
    { name: 'Deaf', icon: 'ear-off' },
    { name: 'Stroller/parent', icon: 'people' },
];


const SignUpScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedSituations, setSelectedSituations] = useState([]);

  const handleSituationToggle = (situationName) => {
    setSelectedSituations(prevSituations => {
      if (prevSituations.includes(situationName)) {
        return prevSituations.filter(s => s !== situationName);
      } else if (prevSituations.length < 3) {
        return [...prevSituations, situationName];
      }
      return prevSituations;
    });
  };

  const canProceedFromStep2 = selectedSituations.length >= 2 && selectedSituations.length <= 3;

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Language & Display Preferences</Text>
      {languages.map(lang => (
        <TouchableOpacity
          key={lang.code}
          style={[styles.optionButton, selectedLanguage === lang.code && styles.selectedOption]}
          onPress={() => setSelectedLanguage(lang.code)}
        >
          <Text style={styles.optionText}>{lang.flag} {lang.name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>What best describes your situation?</Text>
      <Text style={styles.subtitle}>Please select 2 to 3 disabilities</Text>
      <View style={styles.situationContainer}>
        {situations.map(sit => (
          <TouchableOpacity
            key={sit.name}
            style={[styles.situationBox, selectedSituations.includes(sit.name) && styles.selectedSituationBox]}
            onPress={() => handleSituationToggle(sit.name)}
          >
            <Ionicons name={sit.icon} size={40} color={selectedSituations.includes(sit.name) ? '#fff' : '#000'} />
            <Text style={[styles.situationText, selectedSituations.includes(sit.name) && {color: '#fff'}]}>{sit.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectionCounter}>
        {selectedSituations.length}/3 selected
      </Text>
      {selectedSituations.length < 2 && (
        <Text style={styles.errorText}>Please select at least 2 disabilities</Text>
      )}
      <TouchableOpacity 
        style={[styles.button, !canProceedFromStep2 && styles.disabledButton]} 
        onPress={() => setStep(3)}
        disabled={!canProceedFromStep2}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Le rendu de l'étape 3 (Tell us about you) sera ajouté ici

  return (
    <ScrollView style={styles.container}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {/* {step === 3 && renderStep3()} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  stepContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    borderColor: '#00C2FF',
    backgroundColor: '#e0f7ff',
  },
  optionText: {
    fontSize: 18,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#00C2FF',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  situationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  situationBox: {
    width: '30%',
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
  },
  selectedSituationBox: {
      backgroundColor: '#00C2FF',
      borderColor: '#00C2FF',
  },
  situationText: {
      marginTop: 10,
      textAlign: 'center',
  },
  selectionCounter: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
});

export default SignUpScreen;
