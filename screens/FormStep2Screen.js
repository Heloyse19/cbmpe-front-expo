import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, Picker } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/styles';

const API_URL = 'http://172.26.47.72:3000';

export default function FormStep2Screen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { formStep1 } = route.params;

  const [formData, setFormData] = useState({
    localMergulho: '',
    visibilidadeAgua: '',
    ambiente: '',
    tipoFundo: '',
    correnteza: false,
    coordenadasLat: '',
    coordenadasLong: '',
    numeroMergulhadores: ''
  });

  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        setFormData(prev => ({
          ...prev,
          coordenadasLat: loc.coords.latitude.toString(),
          coordenadasLong: loc.coords.longitude.toString()
        }));
      }
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão para acessar a câmera foi negada!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const locaisMergulho = [
    'Selecione uma Opção',
    'Rio',
    'Lago',
    'Mar',
    'Piscina',
    'Represa',
    'Outro'
  ];

  const handleSubmit = async () => {
    if (formData.localMergulho === 'Selecione uma Opção') {
      Alert.alert('Erro', 'Por favor, selecione um tipo de localidade.');
      return;
    }

    const occurrenceData = {
      ...formStep1,
      ...formData,
      numeroVitimas: formStep1.numeroVitimas ? parseInt(formStep1.numeroVitimas) : 0,
      numeroMergulhadores: formData.numeroMergulhadores ? parseInt(formData.numeroMergulhadores) : 0,
      coordenadasLat: formData.coordenadasLat ? parseFloat(formData.coordenadasLat) : null,
      coordenadasLong: formData.coordenadasLong ? parseFloat(formData.coordenadasLong) : null
    };

    const submitData = new FormData();
    submitData.append('data', JSON.stringify(occurrenceData));

    if (image) {
      submitData.append('photo', {
        uri: image.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
    }

    if (location) {
      submitData.append('latitude', location.latitude.toString());
      submitData.append('longitude', location.longitude.toString());
    }

    try {
      const response = await fetch(`${API_URL}/occurrences`, {
        method: 'POST',
        body: submitData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Ocorrência cadastrada com sucesso!');
        navigation.navigate('Home');
      } else {
        throw new Error('Erro ao cadastrar ocorrência');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar ocorrência: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Operações de Mergulho</Text>

      <Text style={styles.label}>Local de mergulho *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.localMergulho}
          onValueChange={(value) => setFormData({...formData, localMergulho: value})}
          style={styles.picker}
        >
          {locaisMergulho.map((local, index) => (
            <Picker.Item key={index} label={local} value={local} />
          ))}
        </Picker>
      </View>

      <TextInput
        label="Coordenadas Latitude"
        value={formData.coordenadasLat}
        onChangeText={(text) => setFormData({...formData, coordenadasLat: text})}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />

      <TextInput
        label="Coordenadas Longitude"
        value={formData.coordenadasLong}
        onChangeText={(text) => setFormData({...formData, coordenadasLong: text})}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Correnteza?</Text>
      <RadioButton.Group
        onValueChange={(value) => setFormData({...formData, correnteza: value === 'true'})}
        value={formData.correnteza.toString()}
      >
        <View style={styles.radioContainer}>
          <RadioButton value="true" />
          <Text>Sim</Text>
          <RadioButton value="false" />
          <Text>Não</Text>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Número de Mergulhadores"
        value={formData.numeroMergulhadores}
        onChangeText={(text) => setFormData({...formData, numeroMergulhadores: text})}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />

      <Button
        mode="outlined"
        onPress={pickImage}
        style={styles.input}
        icon="camera"
      >
        Tirar Foto da Ocorrência
      </Button>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.imagePreview}
        />
      )}

      <Button 
        mode="contained" 
        onPress={handleSubmit}
        style={styles.button}
      >
        Cadastrar Ocorrência
      </Button>

      <Button 
        mode="outlined" 
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Voltar
      </Button>
    </ScrollView>
  );
}