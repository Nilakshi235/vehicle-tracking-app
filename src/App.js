import React, { useState, useEffect, useCallback } from 'react';
import { fetchVehicles, fetchVehicleHistory } from './services/mockApi';
import VehicleControls from './components/VehicleControls/VehicleControls';
import VehicleMap from './components/VehicleMap/VehicleMap';
import './App.css';

function App() {
  const [date, setDate] = useState(new Date('2025-07-17'));
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [routeHistory, setRouteHistory] = useState([]);
  const [animationSpeed, setAnimationSpeed] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const loadVehicles = useCallback(async () => {
    setIsLoading(true);
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const data = await fetchVehicles(formattedDate);
      setVehicles(data);
      resetView();
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  const loadVehicleHistory = useCallback(async (vehicle) => {
    setIsLoading(true);
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const data = await fetchVehicleHistory(vehicle.vehicleNo, formattedDate);
      setRouteHistory(data);
      setSelectedVehicle(vehicle);
      setIsAnimating(false);
      setAnimationProgress(0);
    } catch (error) {
      console.error('Error loading vehicle history:', error);
      setRouteHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  const resetView = useCallback(() => {
    setSelectedVehicle(null);
    setRouteHistory([]);
    setIsAnimating(false);
    setAnimationProgress(0);
  }, []);

  const startAnimation = () => setIsAnimating(true);
  const stopAnimation = () => setIsAnimating(false);

  useEffect(() => {
    loadVehicles();
  }, [date, loadVehicles]);

  return (
    <div className="app-container">
      <VehicleControls
        selectedDate={date}
        onDateChange={setDate}
        onLoadVehicles={loadVehicles}
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onVehicleSelect={loadVehicleHistory}
        onStartAnimation={startAnimation}
        onStopAnimation={stopAnimation}
        onResetView={resetView}
        animationSpeed={animationSpeed}
        onSpeedChange={setAnimationSpeed}
        isLoading={isLoading}
        isAnimating={isAnimating}
        animationProgress={animationProgress}
        routeHistory={routeHistory}
      />
      <VehicleMap
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        routeHistory={routeHistory}
        animationSpeed={animationSpeed}
        isAnimating={isAnimating}
        onAnimationComplete={() => {
          setIsAnimating(false);
          setAnimationProgress(100);
        }}
        onProgress={(progress) => setAnimationProgress(progress)}
      />
    </div>
  );
}

export default App;
