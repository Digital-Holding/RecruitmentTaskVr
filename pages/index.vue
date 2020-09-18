<template>
  <div class="main-wrapper">
    <Scene/>
  </div>
</template>

<script>
  import Scene from '@/components/Scene';

  export default {
    components: {
      Scene
    }
  };
</script>

<style lang="scss" scoped>
  .main-wrapper{
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
