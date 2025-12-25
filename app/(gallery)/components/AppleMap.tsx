"use client";

import { useEffect, useRef, useState } from "react";

interface AppleMapProps {
  latitude: number;
  longitude: number;
}

declare global {
  interface Window {
    mapkit: any;
    mapkitInitPromise?: Promise<void>;
  }
}

// Global token fetcher to prevent duplicate requests
let tokenPromise: Promise<string> | null = null;
const fetchToken = async (): Promise<string> => {
  if (!tokenPromise) {
    tokenPromise = fetch("/api/mapkit-token")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Token fetch failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.token) {
          throw new Error("No token in response");
        }
        return data.token;
      })
      .catch((error) => {
        tokenPromise = null; // Reset on error so it can retry
        throw error;
      });
  }
  return tokenPromise;
};

export default function AppleMap({ latitude, longitude }: AppleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        // Load MapKit JS script if not already loaded
        if (!window.mapkit) {
          const existingScript = document.querySelector(
            'script[src*="mapkit.js"]'
          );
          if (!existingScript) {
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement("script");
              script.src = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";
              script.crossOrigin = "anonymous";
              script.onload = () => resolve();
              script.onerror = () =>
                reject(new Error("Failed to load MapKit JS"));
              document.head.appendChild(script);
            });
          }

          // Wait for MapKit to be available
          let attempts = 0;
          while (!window.mapkit && attempts < 50) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            attempts++;
          }

          if (!window.mapkit) {
            throw new Error("MapKit failed to load");
          }
        }

        if (!isMounted) return;

        // Initialize MapKit once globally
        if (!window.mapkitInitPromise) {
          window.mapkitInitPromise = new Promise<void>((resolve, reject) => {
            window.mapkit.init({
              authorizationCallback: async (done: (token: string) => void) => {
                try {
                  const token = await fetchToken();
                  done(token);
                  resolve();
                } catch (error) {
                  console.error("Failed to fetch MapKit token:", error);
                  reject(error);
                }
              },
            });
          });
        }

        // Wait for MapKit to be initialized
        await window.mapkitInitPromise;

        if (!isMounted) return;

        // Create map instance
        if (mapRef.current) {
          const coordinate = new window.mapkit.Coordinate(latitude, longitude);

          const map = new window.mapkit.Map(mapRef.current, {
            center: coordinate,
            showsCompass: window.mapkit.FeatureVisibility.Hidden,
            showsMapTypeControl: false,
            showsZoomControl: true,
            showsUserLocationControl: false,
            showsScale: window.mapkit.FeatureVisibility.Hidden,
          });

          mapInstanceRef.current = map;

          // Add marker
          const annotation = new window.mapkit.MarkerAnnotation(coordinate, {
            color: "#3b82f6",
            glyphColor: "#ffffff",
          });
          map.addAnnotation(annotation);

          // Set zoom level
          const span = new window.mapkit.CoordinateSpan(0.01, 0.01);
          const region = new window.mapkit.CoordinateRegion(coordinate, span);
          map.region = region;

          // Hide loading when map is ready
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error("MapKit initialization error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "지도를 불러올 수 없습니다");
          setIsLoading(false);
        }
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  if (error) {
    return (
      <div className="w-full h-[300px] bg-zinc-800 rounded-lg flex items-center justify-center">
        <p className="text-zinc-400 text-sm">지도를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center z-10">
          <p className="text-zinc-400 text-sm">지도 로드 중...</p>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full"
        aria-label={`위치: ${latitude.toFixed(6)}°, ${longitude.toFixed(6)}°`}
      />
    </div>
  );
}
