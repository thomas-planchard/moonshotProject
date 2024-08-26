const TRANSPORTATION_EMISSIONS: Readonly<{ [key: string]: number }> = {
  plane: 0.246, // kg CO2 per km
  bus: 0.101,   // kg CO2 per km 
  bicycle: 0.021,   // kg CO2 per km 
  walk: 0,     // kg CO2 per km (assumed zero emissions)
  fuel: 2.31,   // kg CO2 per liter (for cars using gasoline)
  gazoil: 2.68,   // kg CO2 per liter (for cars using diesel)
  electric: 0.012,   // kg CO2 per kWh
};

// Consumption rates (fuel/electricity used per km)
const CONSUMPTION_RATES: Readonly<{ [key: string]: number }> = {
  fuel: 0.07, // liters per km for gasoline cars
  gazoil: 0.06,   // liters per km for diesel cars
  electric: 0.139, // kWh per km for electric cars
};

/**
 * Calculate the carbon footprint of a trip.
 * @param {number} distance - The distance of the trip in kilometers.
 * @param {string} transportation - The mode of transportation.
 * @param {number} [consumption] - The consumption rate (optional for cars and electric vehicles).
 * @returns {number} - The carbon footprint in kg CO2.
 */
function CalculateCarbonFootprint(
  distance: number,
  transportation: string,
  consumption?: number
): number {
  console.log('Calculating carbon footprint for', transportation);
  if (!TRANSPORTATION_EMISSIONS.hasOwnProperty(transportation)) {
    throw new Error('Invalid transportation choice.');
  }
  let carbonFootprint = 0;
  if (transportation === 'fuel' || transportation === 'gazoil') {
    // Calculate fuel used and then the CO2 emissions
    const fuelUsed = (consumption/100) * distance;
    carbonFootprint = fuelUsed * TRANSPORTATION_EMISSIONS[transportation];
  } else if (transportation === 'electric') {
    // Calculate electricity consumed and then the CO2 emissions
    const electricityUsed = consumption ? consumption * distance : CONSUMPTION_RATES[transportation] * distance;
    carbonFootprint = electricityUsed * TRANSPORTATION_EMISSIONS[transportation];
  } else {
    // Direct calculation for other transport modes
    carbonFootprint = distance * TRANSPORTATION_EMISSIONS[transportation];
  }

  return carbonFootprint;
}

export default CalculateCarbonFootprint;