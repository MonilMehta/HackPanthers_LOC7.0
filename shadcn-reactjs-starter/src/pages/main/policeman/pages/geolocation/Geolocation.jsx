import React, { useEffect, useRef, useState } from 'react';
import { mappls } from "mappls-web-maps";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation2 } from 'lucide-react';

const Geolocation = () => {
  const map = useRef(null);
  const mapplsClassObject = useRef(new mappls());
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Sample data - replace with your backend API call
  const locations = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "type": "police_station",
          "title": "Central Police Station",
          "description": "Main district police headquarters",
          "icon": "https://apis.mapmyindia.com/map_v3/1.png",
          "icon-size": 0.75,
          "icon-offset": [0, -10],
          "popupHtml": "<div class='p-2'><h3 class='font-bold'>Central Police Station</h3><p>Main district police headquarters</p></div>"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [28.544, 77.5454]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "type": "case_location",
          "title": "Case #123",
          "description": "Reported incident location",
          "icon": "https://apis.mapmyindia.com/map_v3/2.png",
          "icon-size": 0.75,
          "icon-offset": [0, -10],
          "popupHtml": "<div class='p-2'><h3 class='font-bold'>Case #123</h3><p>Reported incident location</p></div>"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [28.549511, 77.2678250]
        }
      }
    ]
  };

  const openInGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    // Initialize Mappls map
    mapplsClassObject.current.initialize("b65619a141c17442f6e7bf3ffeac9c39", { map: true }, () => {
      if (map.current) {
        map.current.remove();
      }

      // Create map instance
      map.current = mapplsClassObject.current.Map({
        id: "map",
        properties: {
          center: [28.633, 77.2194],
          zoom: 12
        }
      });

      // Set map loaded state
      map.current.on("load", () => {
        setIsMapLoaded(true);
      });
    });
  }, []);

  useEffect(() => {
    if (isMapLoaded && locations) {
      // Add GeoJSON with pre-styled markers
      mapplsClassObject.current.addGeoJson({
        map: map.current,
        data: locations,
        fitbounds: true,
        cType: 0,
        popupOptions: {
          offset: { bottom: [0, -20] },
          closeButton: true
        },
        click: (e) => {
          const { coordinates } = e.geometry;
          openInGoogleMaps(coordinates[0], coordinates[1]);
        }
      });
    }
  }, [isMapLoaded, locations]);

  // Function to fetch locations from backend
  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      const data = await response.json();
      // Transform backend data to match GeoJSON format
      const geoJsonData = {
        type: "FeatureCollection",
        features: data.map(location => ({
          type: "Feature",
          properties: {
            type: location.type,
            title: location.title,
            description: location.description,
            icon: location.type === 'police_station' 
              ? 'https://apis.mapmyindia.com/map_v3/1.png'
              : 'https://apis.mapmyindia.com/map_v3/2.png',
            'icon-size': 0.75,
            'icon-offset': [0, -10],
            popupHtml: `
              <div class='p-2'>
                <h3 class='font-bold'>${location.title}</h3>
                <p>${location.description}</p>
              </div>
            `
          },
          geometry: {
            type: "Point",
            coordinates: [location.latitude, location.longitude]
          }
        }))
      };
      // Use the transformed data
      return geoJsonData;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return null;
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation2 className="h-5 w-5" />
            Police Locations Map
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Police Stations
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" fill="red" />
              Case Locations
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          id="map" 
          className="w-full h-[600px] rounded-lg overflow-hidden border"
        />
      </CardContent>
    </Card>
  );
};

export default Geolocation;
