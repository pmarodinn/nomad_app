import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { MapComponent } from '@/src/components/MapComponent';

export default function ExploreScreen() {
  const handleLocationSelect = (latitude: number, longitude: number) => {
    console.log('Localização selecionada:', { latitude, longitude });
    // Aqui você pode implementar a lógica para mostrar locais próximos
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Explorar" />
        <Appbar.Action icon="magnify" onPress={() => console.log('Buscar')} />
        <Appbar.Action icon="filter-variant" onPress={() => console.log('Filtrar')} />
      </Appbar.Header>
      
      <MapComponent 
        onLocationSelect={handleLocationSelect}
        showCurrentLocation={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
