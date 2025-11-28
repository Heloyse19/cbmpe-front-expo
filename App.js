import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import FormStep1Screen from './screens/FormStep1Screen';
import FormStep2Screen from './screens/FormStep2Screen';
import MapScreen from './screens/MapScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ocorrências' }} />
          <Stack.Screen name="FormStep1" component={FormStep1Screen} options={{ title: 'Formulário - Etapa 1' }} />
          <Stack.Screen name="FormStep2" component={FormStep2Screen} options={{ title: 'Formulário - Etapa 2' }} />
          <Stack.Screen name="Mapa" component={MapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}