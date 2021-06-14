<template>
  <div style="heigh: 100%">
    <div id="container">
      <div class="container-position">
        <div class="container-text">
          <h1 class="container-title">{{ title }}</h1>
          <p class="container-subtitle">{{ subtitle }}</p>
        </div>
        <div class="container-data">
          <Map />
          <SbbLogo />
          <StationsList />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./container.ts" />
<style scoped src="./container.css" />
