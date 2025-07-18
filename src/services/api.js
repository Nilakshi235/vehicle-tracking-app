// src/services/api.js

// Mock database
const mockDatabase = {
  vehicles: {
    '2025-07-13': [
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
    ],
    '2025-07-14': [
      {
        vehicleNo: 'KA03GH9012',
        latitude: 12.9716, // Bangalore
        longitude: 77.5946,
        status: 'Moving'
      }
    ],
    '2025-07-17': [
      {
        vehicleNo: 'GJ01XY3456',
        latitude: 23.0225, // Ahmedabad
        longitude: 72.5714,
        status: 'Moving'
      }
    ]
  },
  routes: {
    'MH12AB1234': {
      '2025-07-13': [
        { timestamp: '2025-07-13T08:00:00Z', latitude: 19.0760, longitude: 72.8777 },
        { timestamp: '2025-07-13T10:00:00Z', latitude: 18.5204, longitude: 73.8567 },
        { timestamp: '2025-07-13T12:00:00Z', latitude: 17.3850, longitude: 78.4867 }
      ]
    },
    'GJ01XY3456': {
      '2025-07-17': [
        { timestamp: '2025-07-17T08:00:00Z', latitude: 23.0225, longitude: 72.5714 },
        { timestamp: '2025-07-17T10:00:00Z', latitude: 22.3039, longitude: 70.8022 }
      ]
    }
  }
};

// Simulate network delay
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const fetchVehicles = async (date) => {
  await simulateNetworkDelay();
  return mockDatabase.vehicles[date] || [];
};

export const fetchVehicleHistory = async (vehicleNo, date) => {
  await simulateNetworkDelay();
  return mockDatabase.routes[vehicleNo]?.[date] || [];
};