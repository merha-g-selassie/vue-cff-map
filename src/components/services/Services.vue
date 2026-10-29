<template>
  <div class="services">
    <img
      src="../../assets/ticket-machine.svg"
      alt="Ticket machine"
      title="Ticket machine"
      :class="{ hide: !services.includes(TICKET_MACHINE) }"
    />
    <img
      src="../../assets/lockers.svg"
      alt="Lockers"
      title="Lockers"
      :class="{ hide: !services.includes(LOCKERS) }"
    />
    <img
      src="../../assets/wifi.svg"
      alt="Wi-Fi"
      title="Wi-Fi"
      :class="{ hide: !services.includes(WIFI) }"
    />
    <img
      src="../../assets/park-and-ride.svg"
      alt="Park and Ride"
      title="Park and Ride"
      :class="{ hide: !services.includes(PARK_AND_RIDE) }"
    />
    <br v-if="services.length > 0" />
  </div>
</template>

<script lang="ts" src="./services.ts" />
<style scoped src="./services.css" />
