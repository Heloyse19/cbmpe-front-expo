import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import { FAB, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';

const API_URL = 'http://172.26.47.72:3000';

export default function HomeScreen() {
  const [occurrences, setOccurrences] = useState([]);
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/occurrences`);
      const data = await res.json();
      setOccurrences(data);
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatEventos = (eventos) => {
    return eventos && eventos.length > 0 ? eventos.join(', ') : 'Nenhum evento';
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={occurrences}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Ocorrência: {item.codigoOcorrencia}</Title>
              <Paragraph>Grupo: {item.grupo}</Paragraph>
              <Paragraph>Vítimas: {item.numeroVitimas || 0}</Paragraph>
              <Paragraph>Eventos: {formatEventos(item.eventos)}</Paragraph>
              {item.localMergulho && (
                <Paragraph>Local Mergulho: {item.localMergulho}</Paragraph>
              )}
            </Card.Content>
            {item.photo && (
              <Card.Cover source={{ uri: `${API_URL}/${item.photo}` }} style={styles.image} />
            )}
          </Card>
        )}
      />
      <FAB 
        icon="plus" 
        style={styles.fab} 
        onPress={() => navigation.navigate('FormStep1')} 
      />
      <FAB 
        icon="map" 
        style={styles.mapButton} 
        onPress={() => navigation.navigate('Mapa')} 
      />
    </View>
  );
}