import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './VehicleControls.css';

const VehicleControls = ({
  selectedDate,
  onDateChange,
  onLoadVehicles,
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  onStartAnimation,
  onStopAnimation,
  onResetView,
  animationSpeed,
  onSpeedChange,
  isLoading,
  isAnimating,
  animationProgress
}) => {
  const [localDate, setLocalDate] = useState(selectedDate);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLocalDate(selectedDate);
  }, [selectedDate]);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (!status) return '#6c757d';
    if (status.includes('Moving')) return '#4CAF50';
    if (status.includes('Idle')) return '#F44336';
    if (status.includes('Loading')) return '#FFC107';
    return '#2196F3';
  };

  const getVehicleIcon = (type) => {
    if (!type) return '🚗';
    switch(type.toLowerCase()) {
      case 'truck': return '🚚';
      case 'van': return '🚐';
      case 'refrigerated': return '🧊';
      case 'flatbed': return '🛻';
      default: return '🚗';
    }
  };

  return (
    <div className="controls-panel">
      <div className="controls-header">
        <h2>Vehicle Route Animation</h2>
      </div>

      <div className="date-controls">
        <label>Select Date:</label>
        <DatePicker
          selected={localDate}
          onChange={(date) => {
            setLocalDate(date);
            onDateChange(date);
          }}
          className="date-picker"
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
          showYearDropdown
        />
        <button className="button start-btn" onClick={onLoadVehicles} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load Vehicles'}
        </button>
      </div>

      {vehicles.length > 0 && (
        <>
          <input
            type="text"
            className="date-picker"
            placeholder="Search by vehicle no"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="vehicle-list">
            {filteredVehicles.map(vehicle => (
              <div
                key={vehicle.vehicleNo}
                className={`vehicle-item ${selectedVehicle?.vehicleNo === vehicle.vehicleNo ? 'selected' : ''}`}
                onClick={() => onVehicleSelect(vehicle)}
              >
                <span style={{ fontSize: '18px', marginRight: '10px', color: getStatusColor(vehicle.status) }}>
                  {getVehicleIcon(vehicle.type)}
                </span>
                <strong>{vehicle.vehicleNo}</strong>
                <div>{vehicle.status}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedVehicle && (
        <div className="animation-controls">
          <h4>Animation Controls</h4>

          <label>Speed: {animationSpeed}x</label>
          <input
            type="range"
            min="1"
            max="10"
            value={animationSpeed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            className="speed-slider"
          />

          {isAnimating && (
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${animationProgress}%` }}></div>
              </div>
              <span>{Math.round(animationProgress)}%</span>
            </div>
          )}

          <div>
            {!isAnimating ? (
              <button className="button start-btn" onClick={onStartAnimation}>▶ Start</button>
            ) : (
              <button className="button stop-btn" onClick={onStopAnimation}>⏹ Stop</button>
            )}
            <button className="button reset-btn" onClick={onResetView}>🔁 Reset</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleControls;
