import { MARKER_CLUSTER_URL } from '@/constants';
import { CustomMarkers, Station } from '@/types';
import MarkerClusterer from '@googlemaps/markerclustererplus';

export const initMarkers = (
  map: google.maps.Map<Element>,
  stations: Station[],
): CustomMarkers => {
  const customMarkers: CustomMarkers = new Map();
  stations.forEach(station => {
    const { location } = station;
    if (location) {
      const latLng = new google.maps.LatLng({
        lat: location.latitude,
        lng: location.longitude,
      });

      const marker = new google.maps.Marker({ position: latLng });
      marker.addListener('click', () => {
        map.setZoom(13);
        map.setCenter(marker.getPosition() as google.maps.LatLng);
      });
      customMarkers.set(marker, station);
    }
  });

  const markers = Array.from(customMarkers.keys());
  new MarkerClusterer(map, markers, {
    imagePath: MARKER_CLUSTER_URL,
  });

  return customMarkers;
};
