import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import './VehicleMap.css';

const VehicleMap = ({
  vehicles,
  selectedVehicle,
  routeHistory,
  animationSpeed,
  isAnimating,
  onAnimationComplete,
  onProgress
}) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const animationRef = useRef();
  const routeLayerRef = useRef();
  const vehicleLayerRef = useRef();
  const animatedVehicleLayerRef = useRef();

  useEffect(() => {
    const initialMap = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: fromLonLat([78.9629, 20.5937]),
        zoom: 5,
      }),
    });
    setMap(initialMap);
    return () => {
      initialMap.setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    if (vehicleLayerRef.current) {
      map.removeLayer(vehicleLayerRef.current);
    }

    const features = vehicles.map(v => {
      const f = new Feature({ geometry: new Point(fromLonLat([v.longitude, v.latitude])), ...v });
      return f;
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({ features }),
      style: (feature) => {
        const status = feature.get('status');
        let color = '#007bff';
        if (status.includes('Moving')) color = '#4CAF50';
        if (status.includes('Idle')) color = '#F44336';
        if (status.includes('Loading')) color = '#FFC107';
        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color }),
            stroke: new Stroke({ color: '#fff', width: 2 }),
          }),
          text: new Text({
            text: feature.get('vehicleNo'),
            font: 'bold 12px Arial',
            fill: new Fill({ color: '#333' }),
            stroke: new Stroke({ color: '#fff', width: 3 }),
            offsetY: -20,
          }),
        });
      },
    });

    map.addLayer(vectorLayer);
    vehicleLayerRef.current = vectorLayer;
  }, [map, vehicles]);

  useEffect(() => {
    if (!map || !routeHistory || routeHistory.length === 0 || !isAnimating) return;

    if (routeLayerRef.current) map.removeLayer(routeLayerRef.current);
    if (animatedVehicleLayerRef.current) map.removeLayer(animatedVehicleLayerRef.current);

    const coords = routeHistory.map(p => fromLonLat([p.longitude, p.latitude]));
    const line = new LineString(coords);
    const routeFeature = new Feature({ geometry: line });

    const routeLayer = new VectorLayer({
      source: new VectorSource({ features: [routeFeature] }),
      style: new Style({ stroke: new Stroke({ color: 'rgba(0,0,255,0.5)', width: 4 }) }),
    });

    map.addLayer(routeLayer);
    routeLayerRef.current = routeLayer;

    const vehicleFeature = new Feature({ geometry: new Point(coords[0]) });
    const vehicleLayer = new VectorLayer({
      source: new VectorSource({ features: [vehicleFeature] }),
      style: new Style({
        image: new Circle({ radius: 10, fill: new Fill({ color: '#FF5722' }), stroke: new Stroke({ color: '#fff', width: 2 }) }),
      }),
    });

    map.addLayer(vehicleLayer);
    animatedVehicleLayerRef.current = vehicleLayer;

    map.getView().fit(line.getExtent(), { padding: [40, 40, 40, 40] });

    const duration = 15000 / animationSpeed;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const fraction = Math.min(elapsed / duration, 1);
      const coord = line.getCoordinateAt(fraction);
      vehicleFeature.getGeometry().setCoordinates(coord);

      if (onProgress) onProgress(fraction * 100);

      if (fraction < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (onAnimationComplete) onAnimationComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [map, routeHistory, animationSpeed, isAnimating]);

  return (
    <div className="map-container">
      <div id="map" ref={mapRef}></div>
    </div>
  );
};

export default VehicleMap;
