import { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";
import { Platform } from "react-native";

export type GeoCoords = { lat: number; lng: number } | null;

export function useUserLocation(autoRequest = true) {
  const [coords, setCoords] = useState<GeoCoords>(null);
  const [denied, setDenied] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const request = useCallback(async () => {
    setRequesting(true);
    try {
      if (Platform.OS === "web") {
        // expo-location works on web via navigator.geolocation, but only over HTTPS and with user gesture.
        if (typeof navigator !== "undefined" && navigator.geolocation) {
          await new Promise<void>((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                resolve();
              },
              () => {
                setDenied(true);
                resolve();
              },
              { timeout: 8000 }
            );
          });
        } else {
          setDenied(true);
        }
        return;
      }

      const existing = await Location.getForegroundPermissionsAsync();
      let status = existing.status;
      if (status !== "granted") {
        if (!existing.canAskAgain) {
          setDenied(true);
          return;
        }
        const req = await Location.requestForegroundPermissionsAsync();
        status = req.status;
      }
      if (status !== "granted") {
        setDenied(true);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    } catch {
      setDenied(true);
    } finally {
      setRequesting(false);
    }
  }, []);

  useEffect(() => {
    if (autoRequest) {
      request();
    }
  }, [autoRequest, request]);

  return { coords, denied, requesting, request };
}
