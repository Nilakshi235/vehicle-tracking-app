export const createVehicleFeature = (vehicle, featureId) => {
  return {
    type: 'Feature',
    id: featureId,
    geometry: {
      type: 'Point',
      coordinates: [vehicle.longitude, vehicle.latitude]
    },
    properties: {
      vehicleNo: vehicle.vehicleNo,
      status: vehicle.status
    }
  };
};

export const createRouteFeature = (coordinates) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: coordinates
    }
  };
};

export const createStartEndMarkers = (coordinates) => {
  if (coordinates.length === 0) return [];
  
  return [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coordinates[0]
      },
      properties: {
        type: 'start'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coordinates[coordinates.length - 1]
      },
      properties: {
        type: 'end'
      }
    }
  ];
};