

const TRANSPORTATION_EMISSIONS = {
    plane: 0.133, // kg CO2 per km
    bus: 0.089,   // kg CO2 per km
    car: 0.171,   // kg CO2 per km
    bicycle: 0,   // kg CO2 per km (assumed zero emissions)
  };
  
  /**
   * Calculate the carbon footprint of a trip.
   * @param {number} distance - The distance of the trip in kilometers.
   * @param {string} transportation - The mode of transportation (plane, bus, car, bicycle).
   * @param {number} timeSpent - The time spent on the trip in hours (not directly used in the calculation but can be used for other purposes).
   * @returns {number} - The carbon footprint in kg CO2.
   */
  function calculateCarbonFootprint(distance, transportation, timeSpent) {
    if (!TRANSPORTATION_EMISSIONS.hasOwnProperty(transportation)) {
      throw new Error('Invalid transportation choice. Please choose from "plane", "bus", "car", or "bicycle".');
    }
  
    const emissionsPerKm = TRANSPORTATION_EMISSIONS[transportation];
    const carbonFootprint = distance * emissionsPerKm;
  
    return carbonFootprint;
  }
  
  export default calculateCarbonFootprint;