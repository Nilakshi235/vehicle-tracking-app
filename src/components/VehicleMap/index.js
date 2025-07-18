import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import { Point, LineString } from 'ol/geom';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Icon, Style, Stroke, Circle as CircleStyle, Fill } from 'ol/style';

const VehicleMap = ({
  vehicles,
  selectedVehicle,
  routeHistory,
  animationPosition,
  onVehicleSelect,
}) => {
  const mapRef = useRef();
  const vehicleLayerRef = useRef();
  const routeLayerRef = useRef();
  const animationLayerRef = useRef();
  const mapInstanceRef = useRef();

  useEffect(() => {
    const vehicleSource = new VectorSource();
    const routeSource = new VectorSource();
    const animationSource = new VectorSource();

    vehicleLayerRef.current = new VectorLayer({ source: vehicleSource });
    routeLayerRef.current = new VectorLayer({ source: routeSource });
    animationLayerRef.current = new VectorLayer({ source: animationSource });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vehicleLayerRef.current,
        routeLayerRef.current,
        animationLayerRef.current,
      ],
      view: new View({
        center: fromLonLat([77.5946, 12.9716]),
        zoom: 12,
      }),
    });

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (!vehicles || vehicles.length === 0 || !vehicleLayerRef.current) return;

    const source = vehicleLayerRef.current.getSource();
    source.clear();

    vehicles.forEach((vehicle) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([vehicle.longitude, vehicle.latitude])),
        vehicle,
      });

      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: selectedVehicle?.vehicleNo === vehicle.vehicleNo ? 'red' : 'blue' }),
          }),
        })
      );

      feature.onClick = () => onVehicleSelect(vehicle);
      source.addFeature(feature);
    });
  }, [vehicles, selectedVehicle, onVehicleSelect]);

  useEffect(() => {
    if (!routeHistory || !routeLayerRef.current) return;

    const source = routeLayerRef.current.getSource();
    source.clear();

    const coords = routeHistory.map((p) => fromLonLat([p.longitude, p.latitude]));
    const line = new LineString(coords);
    const feature = new Feature({ geometry: line });

    feature.setStyle(
      new Style({
        stroke: new Stroke({
          color: '#ff9900',
          width: 4,
        }),
      })
    );

    source.addFeature(feature);
  }, [routeHistory]);

  useEffect(() => {
    if (!animationPosition || !animationLayerRef.current) return;

    const source = animationLayerRef.current.getSource();
    source.clear();

    const point = fromLonLat(animationPosition);
    const feature = new Feature({ geometry: new Point(point) });

    feature.setStyle(
      new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/512/854/854894.png',
          scale: 0.05,
        }),
      })
    );

    source.addFeature(feature);
  }, [animationPosition]);

  return <div ref={mapRef} style={{ width: '100%', height: '80vh' }} />;
};

export default VehicleMap;
