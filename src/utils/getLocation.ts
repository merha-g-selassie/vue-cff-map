import { GeoLocation } from '@/types';

const getPosition = (): Promise<Position> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getLocation = async (): Promise<GeoLocation | null> => {
  if (navigator.geolocation) {
    try {
      const res = await getPosition();
      const { latitude, longitude } = res.coords;
      return {
        latitude,
        longitude,
      };
    } catch (err) {
      return null;
    }
  }
  return null;
};
