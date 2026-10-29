import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { initMaps, initMarkers, initWindowInfo } from '@/utils';
import { stationModule } from '@/store/station-module';
import { CustomMarkers, Station, Service } from '@/types';
import { MAP_ID, DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from '@/constants';

const serviceIcons: { [key: string]: string } = {
  [Service.TICKET_MACHINE]: require('@/assets/ticket-machine.svg'),
  [Service.LOCKERS]: require('@/assets/lockers.svg'),
  [Service.WIFI]: require('@/assets/wifi.svg'),
  [Service.PARK_AND_RIDE]: require('@/assets/park-and-ride.svg'),
};

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
    const station = this.findStationByMarker(marker);
    if (!station) {
      return;
    }

    if (this.selectedStation === station) {
      this.showStationInfo(station, marker);
    } else {
      stationModule.setCurrentStation({ station });
    }
  }

  private showStationInfo(station: Station, marker: google.maps.Marker) {
    this.map.setZoom(13);
    this.map.setCenter(marker.getPosition() as google.maps.LatLng);
    this.infoWindow.setContent(this.getWindowInfoContent(station));
    this.infoWindow.open(this.map, marker);
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
        <div class="map-windowInfo-services">
          ${this.getWindowInfoServicesImages(station.service)}
        </div>
      </div>
      ${
        station.mail ? `<p class="map-windoInfo-email">${station.mail}</p>` : ''
      }
    </div>
    `;

    return content;
  }

  getWindowInfoServicesImages(services: Service[]): string {
    return services
      .map(service => {
        const icon = serviceIcons[service];
        return icon
          ? `<img width="24" height="24" src="${icon}" alt="${service}" title="${service}" class="map-service-image" />`
          : '';
      })
      .join('');
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
      this.showStationInfo(station, marker);
    }
  }
}
