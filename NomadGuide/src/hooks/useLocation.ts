import { useState, useEffect } from 'react';
import * as ExpoLocation from 'expo-location';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

interface UseLocationReturn {
  location: LocationData | null;
  error: string | null;
  loading: boolean;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationData | null>;
  watchLocation: () => void;
  stopWatching: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [watcher, setWatcher] = useState<ExpoLocation.LocationSubscription | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup watcher on unmount
      if (watcher) {
        watcher.remove();
      }
    };
  }, [watcher]);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permissão de localização negada');
        return false;
      }
      
      setError(null);
      return true;
    } catch (err) {
      setError('Erro ao solicitar permissão de localização');
      console.error('Erro ao solicitar permissão:', err);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    try {
      // Verificar se a localização está habilitada
      const enabled = await ExpoLocation.hasServicesEnabledAsync();
      if (!enabled) {
        setError('Serviços de localização não estão habilitados');
        return null;
      }

      // Verificar permissões
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        return null;
      }

      // Obter localização atual
      const result = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 10,
      });

      const locationData: LocationData = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy,
      };

      setLocation(locationData);
      return locationData;
    } catch (err) {
      const errorMessage = 'Erro ao obter localização atual';
      setError(errorMessage);
      console.error('Erro ao obter localização:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const watchLocation = async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        return;
      }

      // Parar qualquer watcher anterior
      if (watcher) {
        watcher.remove();
      }

      const newWatcher = await ExpoLocation.watchPositionAsync(
        {
          accuracy: ExpoLocation.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 10,
        },
        (result) => {
          const locationData: LocationData = {
            latitude: result.coords.latitude,
            longitude: result.coords.longitude,
            accuracy: result.coords.accuracy,
          };
          
          setLocation(locationData);
          setError(null);
        }
      );

      setWatcher(newWatcher);
    } catch (err) {
      setError('Erro ao iniciar monitoramento de localização');
      console.error('Erro no watch location:', err);
    }
  };

  const stopWatching = () => {
    if (watcher) {
      watcher.remove();
      setWatcher(null);
    }
  };

  return {
    location,
    error,
    loading,
    requestPermission,
    getCurrentLocation,
    watchLocation,
    stopWatching,
  };
};
