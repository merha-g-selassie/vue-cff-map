<template>
  <div
    v-scroll-to="`#${mapId}`"
    :class="{ selected: selectedStation === station }"
    class="station"
    @click="onStationClicked(station)"
  >
    <div class="nearest-banner" v-show="isNearestStation()">
      <NearestStationBanner />
    </div>
    <div class="station-item-full-width station-div-align-left">
      <p class="station-city station-item-spacing">{{ station.name }}</p>
      <p class="station-address station-item-spacing">
        {{ station.address }}
      </p>
    </div>
    <div class="station-item-full-width station-div-align-right">
      <Services :services="station.service" />
      <p class="station-email station-item-spacing">
        {{ station.mail }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" src="./station.ts" />
<style src="./station.css" />
