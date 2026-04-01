import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
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
  const [selectedDisplayMode, setSelectedDisplayMode] = useState('standard');
  const [selectedAssistiveControls, setSelectedAssistiveControls] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

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

  const canProceedFromStep2 = selectedSituations.length >= 0 && selectedSituations.length <= 3;
  const canProceedFromStep3 = firstName.trim() !== '' && lastName.trim() !== '' && email.trim() !== '';

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Langue & Préférences</Text>
      
      {/* Sélection de la langue */}
      <Text style={styles.sectionTitle}>Langue</Text>
      <View style={styles.optionContainer}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.optionCard, selectedLanguage === lang.code && styles.selectedOptionCard]}
            onPress={() => setSelectedLanguage(lang.code)}
          >
            <Text style={styles.optionCardFlag}>{lang.flag}</Text>
            <Text style={[styles.optionCardText, selectedLanguage === lang.code && styles.selectedOptionCardText]}>
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Modes d'affichage */}
      <Text style={styles.sectionTitle}>Mode d'affichage</Text>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[styles.optionCard, selectedDisplayMode === 'standard' && styles.selectedOptionCard]}
          onPress={() => setSelectedDisplayMode('standard')}
        >
          <Text style={styles.optionCardIcon}>Aa</Text>
          <Text style={[styles.optionCardLabel, selectedDisplayMode === 'standard' && styles.selectedOptionCardText]}>
            Standard Mode
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionCard, selectedDisplayMode === 'simplified' && styles.selectedOptionCard]}
          onPress={() => setSelectedDisplayMode('simplified')}
        >
          <Text style={styles.optionCardIcon}>Aa</Text>
          <Text style={[styles.optionCardLabel, selectedDisplayMode === 'simplified' && styles.selectedOptionCardText]}>
            Simplified Mode
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionCard, styles.highContrastCard, selectedDisplayMode === 'contrasted' && styles.selectedOptionCard]}
          onPress={() => setSelectedDisplayMode('contrasted')}
        >
          <Text style={styles.optionCardIconHighContrast}>Aa</Text>
          <Text style={[styles.optionCardLabelHighContrast, selectedDisplayMode === 'contrasted' && styles.selectedOptionCardText]}>
            High Contrast Mode
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Contrôle Assisté */}
      <Text style={styles.sectionTitle}>Mode de navigation</Text>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={[styles.optionCard, styles.navCard, selectedAssistiveControls.includes('voice') && styles.selectedOptionCard]}
          onPress={() => {
            setSelectedAssistiveControls(prev => 
              prev.includes('voice') 
                ? prev.filter(c => c !== 'voice')
                : [...prev, 'voice']
            );
          }}
        >
          <Text style={styles.navCardIcon}>🎤</Text>
          <Text style={[styles.navCardLabel, selectedAssistiveControls.includes('voice') && styles.selectedOptionCardText]}>
            Voice Control
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionCard, selectedAssistiveControls.includes('touch') && styles.selectedOptionCard]}
          onPress={() => {
            setSelectedAssistiveControls(prev => 
              prev.includes('touch') 
                ? prev.filter(c => c !== 'touch')
                : [...prev, 'touch']
            );
          }}
        >
          <Text style={styles.optionCardIcon}>👆</Text>
          <Text style={[styles.optionCardLabel, selectedAssistiveControls.includes('touch') && styles.selectedOptionCardText]}>
            Touch
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionCard, selectedAssistiveControls.includes('switch') && styles.selectedOptionCard]}
          onPress={() => {
            setSelectedAssistiveControls(prev => 
              prev.includes('switch') 
                ? prev.filter(c => c !== 'switch')
                : [...prev, 'switch']
            );
          }}
        >
          <Text style={styles.optionCardIcon}>🔄</Text>
          <Text style={[styles.optionCardLabel, selectedAssistiveControls.includes('switch') && styles.selectedOptionCardText]}>
            Switch Access
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Vous avez déjà un compte ?</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep(1)}>
          <Ionicons name="arrow-back" size={30} color="#00C2FF" />
        </TouchableOpacity>
        <Text style={styles.title}>Votre situation</Text>
        <View style={{width: 30}} />
      </View>
      <Text style={styles.subtitle}>Sélectionnez vos handicaps (optionnel)</Text>
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
        {selectedSituations.length}/3 sélectionnés
      </Text>
      <TouchableOpacity 
        style={[styles.button]} 
        onPress={() => setStep(3)}
        disabled={!canProceedFromStep2}
      >
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep(2)}>
          <Ionicons name="arrow-back" size={30} color="#00C2FF" />
        </TouchableOpacity>
        <Text style={styles.title}>À propos de vous</Text>
        <View style={{width: 30}} />
      </View>
      <Text style={styles.subtitle}>Remplissez vos informations personnelles</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Téléphone (optionnel)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={[styles.input, styles.addressInput]}
        placeholder="Adresse (optionnel)"
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={3}
        placeholderTextColor="#999"
      />
      
      <TouchableOpacity 
        style={[styles.button, !canProceedFromStep3 && styles.disabledButton]} 
        onPress={() => navigation.navigate('Map')}
        disabled={!canProceedFromStep3}
      >
        <Text style={styles.buttonText}>Terminer l'inscription</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
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
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  linkText: {
    color: '#00C2FF',
    fontSize: 16,
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  /* New styles for option cards layout */
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionCard: {
    width: '31%',
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  selectedOptionCard: {
    backgroundColor: '#00C2FF',
    borderColor: '#00C2FF',
  },
  optionCardFlag: {
    fontSize: 48,
    marginBottom: 10,
  },
  optionCardIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  optionCardIconHighContrast: {
    fontSize: 32,
    marginBottom: 10,
    color: '#fff',
  },
  optionCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionCardText: {
    color: '#fff',
  },
  optionCardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  optionCardLabelHighContrast: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  highContrastCard: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  navCard: {
    backgroundColor: '#E0F7FF',
    borderColor: '#00C2FF',
  },
  navCardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  navCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00C2FF',
    textAlign: 'center',
  },
});

export default SignUpScreen;
