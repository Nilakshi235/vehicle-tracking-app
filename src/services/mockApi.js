// src/services/mockApi.js

const mockDatabase = {
  vehicles: {
    '2025-07-17': [
      {
        vehicleNo: 'MH12AB1234',
        latitude: 19.0760, // Mumbai
        longitude: 72.8777,
        status: 'Moving'
      },
      {
        vehicleNo: 'DL09EF5678',
        latitude: 28.6139, // Delhi
        longitude: 77.2090,
        status: 'Idle'
      }
    ]
  },
  routes: {
    'MH12AB1234': {
      '2025-07-17': [
        { latitude: 19.0760, longitude: 72.8777 }, // Mumbai
        { latitude: 18.5204, longitude: 73.8567 }, // Pune
        { latitude: 17.3850, longitude: 78.4867 }  // Hyderabad
      ]
    }
  }
};

// Add this export statement
export const fetchVehicles = async (date) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDatabase.vehicles[date] || []);
    }, 300); // Simulate network delay
  });
};

export const fetchVehicleHistory = async (vehicleNo, date) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDatabase.routes[vehicleNo]?.[date] || []);
    }, 300);
  });
};

// Make sure to include this default export
export default {
  fetchVehicles,
  fetchVehicleHistory
};