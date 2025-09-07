import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, ActivityIndicator, Text } from 'react-native-paper';
import { useLocation } from '../hooks/useLocation';

interface MapComponentProps {
  onLocationSelect?: (latitude: number, longitude: number) => void;
  showCurrentLocation?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  onLocationSelect,
  showCurrentLocation = true,
}) => {
  const { location, error, loading, getCurrentLocation, requestPermission } = useLocation();
  const [hasPermission, setHasPermission] = useState(false);

  const checkPermissions = useCallback(async () => {
    const granted = await requestPermission();
    setHasPermission(granted);
    
    if (granted && showCurrentLocation) {
      getCurrentLocation();
    }
  }, [requestPermission, showCurrentLocation, getCurrentLocation]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  const handleGetLocation = async () => {
    const currentLocation = await getCurrentLocation();
    if (currentLocation && onLocationSelect) {
      onLocationSelect(currentLocation.latitude, currentLocation.longitude);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Permissão de localização necessária
          </Text>
          <Button mode="contained" onPress={checkPermissions}>
            Conceder Permissão
          </Button>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={handleGetLocation}>
            Tentar Novamente
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Obtendo localização...</Text>
        </View>
      )}
      
      {location && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Latitude: {location.latitude.toFixed(6)}
          </Text>
          <Text style={styles.infoText}>
            Longitude: {location.longitude.toFixed(6)}
          </Text>
          {location.accuracy && (
            <Text style={styles.infoText}>
              Precisão: {Math.round(location.accuracy)}m
            </Text>
          )}
        </View>
      )}

      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>
          🗺️ Mapa será implementado aqui
        </Text>
        <Text style={styles.placeholderSubtext}>
          (Requer configuração com Google Maps ou Mapbox)
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleGetLocation}
          disabled={loading}
          icon="crosshairs-gps"
        >
          Obter Localização Atual
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#f44336',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  infoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 100,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    margin: 10,
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 24,
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    padding: 15,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
