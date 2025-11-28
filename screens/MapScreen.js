import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, ActivityIndicator } from 'react-native';

const API_URL = 'http://172.26.47.72:3000';

export default function MapScreen() {
  const [occurrences, setOccurrences] = useState([]);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_URL}/occurrences`);
      const data = await res.json();
      setOccurrences(data);

      // Filtra ocorrências com coordenadas válidas
      const occurrencesWithCoords = data.filter(occ => 
        occ.latitude && occ.longitude
      );

      if (occurrencesWithCoords.length > 0) {
        const avgLat = occurrencesWithCoords.reduce((sum, p) => sum + Number(p.latitude), 0) / occurrencesWithCoords.length;
        const avgLng = occurrencesWithCoords.reduce((sum, p) => sum + Number(p.longitude), 0) / occurrencesWithCoords.length;

        setRegion({
          latitude: avgLat,
          longitude: avgLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    };

    fetchData();
  }, []);

  if (!region) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={region}>
        {occurrences
          .filter(occ => occ.latitude && occ.longitude)
          .map((occ) => (
            <Marker
              key={occ._id}
              coordinate={{
                latitude: Number(occ.latitude),
                longitude: Number(occ.longitude),
              }}
              title={`Ocorrência: ${occ.codigoOcorrencia}`}
              description={`Grupo: ${occ.grupo} - Vítimas: ${occ.numeroVitimas || 0}`}
              pinColor="red"
            />
          ))}
      </MapView>
    </View>
  );
}