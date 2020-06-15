export function mapFrequenciesToProgressObject(freqMap, frequency) {
  let obj = {};

  freqMap.forEach(function(value, key) {
    obj[key] = value / frequency > 1 ? 1 : value / frequency;
  });

  return obj;
}

export function checkTemplateAddressesForAddress(
  address: string,
  addresses: string[],
) {
  if (addresses.includes(address.toLowerCase()) === true) {
    return 1;
  }
  return 0;
}
