// Function to decode a polyline string into an array of points (latitude and longitude).
const decodePolyline = (t: string) => {
  // Initialize an empty array to hold the decoded points.
  let points: Array<{ latitude: number; longitude: number }> = [];
  // Initialize index to start at the beginning of the string, and len as the total length of the string.
  let index = 0,
    len = t.length;
  // Initialize variables to hold the current latitude and longitude values being decoded.
  let lat = 0,
    lng = 0;

  // Loop through all characters in the input string.
  while (index < len) {
    let b, shift = 0,
      result = 0;
    // Decode a single latitude or longitude value from the string.
    do {
      // Decode a single character, adjusting by the offset.
      b = t.charCodeAt(index++) - 63;
      // Accumulate the decoded value into result, handling continuation bits.
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20); // Continue decoding characters until a continuation bit is not set.
    // Apply ZigZag decoding to get the actual latitude or longitude difference.
    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat; // Update the current latitude.

    // Reset variables to decode the next value, which will be longitude.
    shift = 0;
    result = 0;
    do {
      b = t.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    // Decode the longitude difference using the same method as latitude.
    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng; // Update the current longitude.

    // Add the decoded latitude and longitude to the points array, adjusting the scale.
    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  // Return the array of decoded points.
  return points;
};

export default decodePolyline;