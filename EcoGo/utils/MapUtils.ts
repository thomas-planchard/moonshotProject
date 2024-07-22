// Calculate heading between two points
export const calculateHeading = (from, to) => {
    const lat1 = (from.latitude * Math.PI) / 180;
    const lon1 = (from.longitude * Math.PI) / 180;
    const lat2 = (to.latitude * Math.PI) / 180;
    const lon2 = (to.longitude * Math.PI) / 180;
  
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let brng = Math.atan2(y, x);
    brng = (brng * 180) / Math.PI;
    brng = (brng + 360) % 360;
    return brng;
  };
  
  // Calculate distance between two points
  export const getDistance = (point1: { latitude: number, longitude: number }, point2: { latitude: number, longitude: number }) => {
    const rad = (x: number) => x * Math.PI / 180;
    const R = 6378137; // Earth’s mean radius in meters
    const dLat = rad(point2.latitude - point1.latitude);
    const dLong = rad(point2.longitude - point1.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(point1.latitude)) * Math.cos(rad(point2.latitude)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // returns the distance in meter
  };
  

// Function to decode a polyline string into an array of points (latitude and longitude).
export const decodePolyline = (t: string): Array<{ latitude: number; longitude: number }> => {
    if (!t || typeof t !== 'string') {
      throw new Error('Invalid input: Input must be a non-empty string.');
    }
  
    // Initialize an empty array to hold the decoded points.
    let points: Array<{ latitude: number; longitude: number }> = [];
    // Initialize index to start at the beginning of the string, and len as the total length of the string.
    let index: number = 0;
    const len: number = t.length;
    // Initialize variables to hold the current latitude and longitude values being decoded.
    let lat: number = 0;
    let lng: number = 0;
  
  
    // Loop through all characters in the input string.
    while (index < len) {
      let b: number;
      let shift: number = 0;
      let result: number = 0;
      // Decode a single latitude or longitude value from the string.
      do {
        //! Check if the index is within the bounds of the string.
        if (index >= len) {
          throw new Error('Invalid encoding: Unexpected end of input.');
        }
        // Decode a single character, adjusting by the offset.
        b = t.charCodeAt(index++) - 63;
        // Accumulate the decoded value into result, handling continuation bits.
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20); // Continue decoding characters until a continuation bit is not set.
      // Apply ZigZag decoding to get the actual latitude or longitude difference.
      const dlat: number = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat; // Update the current latitude.
  
      // Reset variables to decode the next value, which will be longitude.
      shift = 0;
      result = 0;
      do {
        //! Check if the index is within the bounds of the string.
        if (index >= len) {
          throw new Error('Invalid encoding: Unexpected end of input.');
        }
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      // Decode the longitude difference using the same method as latitude.
      const dlng: number = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng; // Update the current longitude.
  
      // Add the decoded latitude and longitude to the points array, adjusting the scale.
      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    // Return the array of decoded points.
    return points;
  };
  
  
  
  
  //? Another solution by pre-allocating the array size and updating the array directly
  // // Function to decode a polyline string into an array of points (latitude and longitude).
  // const decodePolyline = (t: string): Array<{ latitude: number; longitude: number }> => {
  //   if (!t || typeof t !== 'string') {
  //     throw new Error('Invalid input: Input must be a non-empty string.');
  //   }
  
  //   // Estimate the number of points to reduce array resizing operations.
  //   const estimatedPoints: number = Math.floor(t.length / 2);
  //   let points: Array<{ latitude: number; longitude: number }> = new Array(estimatedPoints);
  
  //   let index: number = 0;
  //   const len: number = t.length;
  //   let lat: number = 0;
  //   let lng: number = 0;
  //   let pointIndex: number = 0;
  
  //   while (index < len) {
  //     let b: number;
  //     let shift: number = 0;
  //     let result: number = 0;
  
  //     do {
  //       if (index >= len) {
  //         throw new Error('Invalid encoding: Unexpected end of input.');
  //       }
  //       b = t.charCodeAt(index++) - 63;
  //       result |= (b & 0x1f) << shift;
  //       shift += 5;
  //     } while (b >= 0x20);
  
  //     const dlat: number = (result & 1) ? ~(result >> 1) : (result >> 1);
  //     lat += dlat;
  
  //     shift = 0;
  //     result = 0;
  //     do {
  //       if (index >= len) {
  //         throw new Error('Invalid encoding: Unexpected end of input.');
  //       }
  //       b = t.charCodeAt(index++) - 63;
  //       result |= (b & 0x1f) << shift;
  //       shift += 5;
  //     } while (b >= 0x20);
  
  //     const dlng: number = (result & 1) ? ~(result >> 1) : (result >> 1);
  //     lng += dlng;
  
  //     // Directly update the pre-allocated array
  //     points[pointIndex++] = { latitude: lat / 1e5, longitude: lng / 1e5 };
  //   }
  
  //   // Resize the array to the actual number of points decoded
  //   points.length = pointIndex;
  
  //   return points;
  // };
  
  // export default decodePolyline;