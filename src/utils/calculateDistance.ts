import { GeoLocation } from '@/types';

export const calculateDistance = (
  from: GeoLocation,
  to: GeoLocation,
): number => {
  const fromLatLng: google.maps.LatLng = new google.maps.LatLng(
    from.latitude,
    from.longitude,
  );

  const toLatLng: google.maps.LatLng = new google.maps.LatLng(
    to.latitude,
    to.longitude,
  );

  return google.maps.geometry.spherical.computeDistanceBetween(
    fromLatLng,
    toLatLng,
  );
};
