import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { initMaps, initMarkers, initWindowInfo } from '@/utils';
import { stationModule } from '@/store/station-module';
import { CustomMarkers, Station, Service } from '@/types';
import {
  MAP_ID,
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  LOUNGE_URL,
  LUGGAGE_URL,
  MONEY_EXCHANGE_URL,
} from '@/constants';

@Component({
  name: 'GoogleMap',
})
export default class GoogleMap extends Vue {
  map!: google.maps.Map<Element>;
  infoWindow!: google.maps.InfoWindow;
  customMarkers!: CustomMarkers;
  mapId = MAP_ID;

  get stations() {
    return stationModule.stations;
  }

  get selectedStation() {
    return stationModule.selectedStation;
  }

  async mounted() {
    const location = {
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE,
    };
    this.map = await initMaps(location);
  }

  markerClickHandler(marker: google.maps.Marker) {
    this.map.setZoom(13);
    this.map.setCenter(marker.getPosition() as google.maps.LatLng);

    const station = this.findStationByMarker(marker);
    if (station) {
      stationModule.setCurrentStation({ station });
      const content = this.getWindowInfoContent(station);
      this.infoWindow.setContent(content);
      this.infoWindow.open(this.map, marker);
    }
  }

  getWindowInfoContent(station: Station): string {
    const content = `
    <div class="map-windowInfo">
      <div>
        <h3 class="map-windowInfo-city">
          ${station.name}
        </h3>
        <p class="map-windowInfo-address">
          ${station.address}
        </p>
      </div>
      <div>
        <p class="map-windoInfo-email">
          ${station.mail}
        </p>
      </div>
      <div>
      ${this.getWindowInfoServicesImages(station.service)}
      </div>
    </div>
    `;

    return content;
  }

  getWindowInfoServicesImages(services: Service[]): string {
    let imageTags = '';
    if (services.includes(Service.MONEY_EXCHANGE)) {
      imageTags = `${imageTags}<img width="23px" src="${MONEY_EXCHANGE_URL}" alt="${Service.MONEY_EXCHANGE}" class="map-service-image" />`;
    }
    if (services.includes(Service.LUGGAGE)) {
      imageTags = `${imageTags}<img width="23px" src="${LUGGAGE_URL}" alt="${Service.LUGGAGE}" class="map-service-image" />`;
    }
    if (services.includes(Service.LOUNGE)) {
      imageTags = `${imageTags}<img width="23px" src="${LOUNGE_URL}" alt="${Service.LOUNGE}" class="map-service-image" />`;
    }
    return imageTags;
  }

  findStationByMarker(marker: google.maps.Marker): Station | undefined {
    const station = this.customMarkers.get(marker);
    return station;
  }

  addMarkerClickListeners(markers: google.maps.Marker[]) {
    markers.forEach(marker =>
      marker.addListener('click', () => this.markerClickHandler(marker)),
    );
  }

  findMarkerByStation(station: Station): google.maps.Marker | null {
    if (this.customMarkers) {
      for (const [key, value] of this.customMarkers) {
        if (value === station) {
          return key;
        }
      }
    }
    return null;
  }

  @Watch('stations')
  onStationsLoaded(newStations: Station[]) {
    if (newStations.length) {
      this.customMarkers = initMarkers(this.map, this.stations);

      const markers = Array.from(this.customMarkers.keys());
      this.addMarkerClickListeners(markers);
      this.infoWindow = initWindowInfo();
    }
  }

  @Watch('selectedStation')
  onSelectedStationChanged(station: Station) {
    const marker = this.findMarkerByStation(station);
    if (marker) {
      this.markerClickHandler(marker);
    }
  }
}
