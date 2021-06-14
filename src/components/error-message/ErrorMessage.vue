<template>
  <div>
    <img
      class="error-img"
      width="50px"
      height="auto"
      src="../../assets/reload.svg"
      alt="reload icon"
      @click="retry"
    />
    <p class="error-text">{{ error.message }}</p>
  </div>
</template>

<script lang="ts" src="./error-message.ts" />
<style scoped src="./error-message.css" />
