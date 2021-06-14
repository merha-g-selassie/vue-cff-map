import { GoogleMap } from '@googlemaps/map-loader';
import { MapLoaderOptions } from '@googlemaps/map-loader/dist/map-loader';
import { MAPS_ZOOM, MAP_ID } from '@/constants';
import { GeoLocation } from '@/types';

const buildMapOptions = (location: GeoLocation): google.maps.MapOptions => {
  return {
    center: {
      lat: location.latitude,
      lng: location.longitude,
    },
    fullscreenControl: false,
    zoom: MAPS_ZOOM,
  };
};

const buildMapLoaderOptions = (location: GeoLocation): MapLoaderOptions => {
  const mapOptions = buildMapOptions(location);
  return {
    apiKey: process.env.VUE_APP_MAPS_API_KEY,
    divId: MAP_ID,
    mapOptions,
    apiOptions: {
      libraries: ['geometry'],
    },
  };
};

export const initMaps = async (
  location: GeoLocation,
): Promise<google.maps.Map<Element>> => {
  const mapLoaderOptions = buildMapLoaderOptions(location);
  const mapLoader = new GoogleMap();

  return await mapLoader.initMap(mapLoaderOptions);
};
