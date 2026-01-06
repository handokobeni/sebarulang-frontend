"use client";

import { useEffect, useRef, useState, memo } from "react";
import { MapPin, AlertCircle, Loader2 } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxMapProps {
  latitude: number;
  longitude: number;
  location: string;
  className?: string;
}

function MapboxMapComponent({
  latitude,
  longitude,
  location,
  className,
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const isLoadingRef = useRef(true);
  
  // Check for errors before initializing state
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const hasValidToken = !!mapboxToken;
  const hasValidCoords = !!latitude && !!longitude;
  
  const [isLoading, setIsLoading] = useState(hasValidToken && hasValidCoords);
  const [error, setError] = useState<string | null>(
    !hasValidToken 
      ? "Mapbox token tidak ditemukan" 
      : !hasValidCoords 
      ? "Koordinat lokasi tidak valid" 
      : null
  );

  useEffect(() => {
    // Reset loading ref
    isLoadingRef.current = true;
    
    // Early return if validation fails
    if (!hasValidToken || !hasValidCoords || !mapContainer.current) {
      isLoadingRef.current = false;
      return;
    }

    // Initialize map
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        accessToken: mapboxToken!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [longitude!, latitude!],
        zoom: 14,
        attributionControl: false,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Wait for map to load
      const handleLoad = () => {
        if (!isLoadingRef.current) return; // Already handled
        
        isLoadingRef.current = false;
        setIsLoading(false);
        setError(null);
        
        // Add marker and popup after map is loaded
        if (map.current && !marker.current) {
          marker.current = new mapboxgl.Marker({
            color: "#10b981",
            scale: 1.2,
          })
            .setLngLat([longitude!, latitude!])
            .addTo(map.current);

          // Add popup with location info
          new mapboxgl.Popup({ offset: 25, closeOnClick: false })
            .setLngLat([longitude!, latitude!])
            .setHTML(`<div class="p-2"><strong class="text-sm">${location}</strong></div>`)
            .addTo(map.current);
        }
      };

      // Handle map errors
      const handleError = (e: { type: "error"; target: mapboxgl.Map; error: Error }) => {
        console.error("Mapbox error:", e.error);
        isLoadingRef.current = false;
        setIsLoading(false);
        setError("Gagal memuat peta");
      };

      // Attach event listeners immediately
      map.current.on("error", handleError);
      
      // Check if map is already loaded (race condition)
      // Use requestAnimationFrame to ensure map is fully initialized
      requestAnimationFrame(() => {
        if (map.current) {
          if (map.current.loaded()) {
            handleLoad();
          } else {
            map.current.on("load", handleLoad);
          }
        }
      });

      // Fallback timeout - jika map tidak load dalam 10 detik
      const timeoutId = setTimeout(() => {
        if (isLoadingRef.current) {
          console.warn("Map load timeout");
          isLoadingRef.current = false;
          setIsLoading(false);
          setError("Peta membutuhkan waktu terlalu lama untuk dimuat");
        }
      }, 10000);

      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        if (marker.current) {
          marker.current.remove();
        }
        if (map.current) {
          map.current.off("load", handleLoad);
          map.current.off("error", handleError);
          map.current.remove();
        }
      };
    } catch (err) {
      console.error("Error initializing map:", err);
      // Use setTimeout to avoid setState in effect
      setTimeout(() => {
        setError("Gagal menginisialisasi peta");
        setIsLoading(false);
      }, 0);
    }
  }, [latitude, longitude, location, hasValidToken, hasValidCoords, mapboxToken]);

  // Render map container (always visible for initialization)
  // Map container must always be rendered so map can be initialized
  return (
    <div className={`${className || ""}`}>
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <div
          ref={mapContainer}
          className="w-full h-full"
        />
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-6 text-gray-400 animate-spin" />
              <p className="text-sm text-gray-500">Memuat peta...</p>
            </div>
          </div>
        )}
        {/* Error overlay */}
        {error && !isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <AlertCircle className="size-8 text-gray-400" />
              <p className="text-sm text-gray-600 font-medium">{error}</p>
              <p className="text-xs text-gray-500 mt-1">{location}</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <MapPin className="size-4 text-gray-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700">{location}</p>
        </div>
      </div>
    </div>
  );
}

export const MapboxMap = memo(MapboxMapComponent);

