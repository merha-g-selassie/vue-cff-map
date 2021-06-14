<template>
  <div class="services">
    <img
      src="../../assets/money.svg"
      alt="{MONEY_EXCHANGE}"
      :class="{ hide: !services.includes(MONEY_EXCHANGE) }"
    />
    <img
      src="../../assets/luggage.svg"
      alt="{LUGGAGE}"
      :class="{ hide: !services.includes(LUGGAGE) }"
    />
    <img
      src="../../assets/lounge.svg"
      alt="{LOUNGE}"
      :class="{ hide: !services.includes(LOUNGE) }"
    />
    <br v-if="!services.length < 1" />
  </div>
</template>

<script lang="ts" src="./services.ts" />
<style scoped src="./services.css" />
