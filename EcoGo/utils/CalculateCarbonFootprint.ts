//! Modification, Adding typescript annotations for parameters and return value
//! Error handling has been improved by adding more specific error messages
//! Replaced constant by readonly to prevent reassignment, however car should be modified to be specific to the type of car

const TRANSPORTATION_EMISSIONS: Readonly<{ [key: string]: number }> = {
    plane: 0.133, // kg CO2 per km
    bus: 0.089,   // kg CO2 per km 
    car: 0.171,   // kg CO2 per km //? let the user change this value based on the car they are using, some API can be used to get the value
    bicycle: 0,   // kg CO2 per km (assumed zero emissions)
  };
  
  /**
   * Calculate the carbon footprint of a trip.
   * @param {number} distance - The distance of the trip in kilometers.
   * @param {string} transportation - The mode of transportation (plane, bus, car, bicycle).
   * @param {number} timeSpent - The time spent on the trip in hours (not directly used in the calculation but can be used for other purposes).
   * @returns {number} - The carbon footprint in kg CO2.
   */
  function CalculateCarbonFootprint(distance: number, transportation: string, timeSpent: number): number {
    if (!TRANSPORTATION_EMISSIONS.hasOwnProperty(transportation)) {
      throw new Error('Invalid transportation choice. Please choose from "plane", "bus", "car", or "bicycle".');
    }
  
    const emissionsPerKm: number = TRANSPORTATION_EMISSIONS[transportation];
    const carbonFootprint: number = distance * emissionsPerKm;
  
    return carbonFootprint;
  }
  
  export default CalculateCarbonFootprint;