<template>
  <div>
    <div v-if="error">
      <ErrorMessage @reload="reload" />
    </div>
    <div v-else-if="!stations.length">
      <Spinner />
    </div>
    <div v-else v-for="station in stations" :key="station.name">
      <Station :station="station" />
    </div>
  </div>
</template>

<script lang="ts" src="./stations-list.ts" />
