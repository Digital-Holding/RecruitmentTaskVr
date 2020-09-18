<template>
  <div ref="container" class="scene-container">
    <div class="options">
      <div class="reload btn" @click="reloadModel">
        <span class="icon">R</span>
        <span class="label">Reload model</span>
      </div>
    </div>
    <div class="splash-screen" :class="{visible: isLoading}">
      <img src="/logo_black.svg" alt="DH"/>
      <h1 class="title">RecruitmentTaskVr</h1>
    </div>
  </div>
</template>

<script>
  import SceneInit from './js/Scene.init';

  export default {
    data() {
      return {
        objects: [],
        isLoading: true,
        textures: {
          T_wood_cedar_white_V01_Base_Color_2K_01: null,
          T_wood_cedar_white_V01_modified01_Base_Color_2K: null,
          T_wood_cedar_white_V01_Base_Color_TEAK_2K: null,
          T_wood_cedar_white_V01_Roughness_1K: null,
          T_wood_cedar_white_V01_Normal_1K: null,
        }
      };
    },
    methods: {
      loadModel() {
        this.isLoading = true;

        this.scene.loadModel('model/ania.glb', (model) => {
          model.name = 'custom_model';

          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              this.objects.push(child);
            }
          });

          this.loadTextures();
          this.setTextures();

          this.scene.add(model);

          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        });
      },

      reloadModel() {
        this.objects = [];
        this.scene.remove('custom_model');
        this.loadModel();
      },

      loadTextures() {
        this.textures.T_wood_cedar_white_V01_Base_Color_2K_01 = new THREE.TextureLoader().load("textures/wood_cedar_white/T_wood_cedar_white_V01_Base_Color_2K_01.jpg");
        this.textures.T_wood_cedar_white_V01_Base_Color_2K_01.wrapS = THREE.RepeatWrapping;
        this.textures.T_wood_cedar_white_V01_Base_Color_2K_01.wrapT = THREE.RepeatWrapping;

        this.textures.T_wood_cedar_white_V01_modified01_Base_Color_2K = new THREE.TextureLoader().load("textures/wood_cedar_white/T_wood_cedar_white_V01_modified01_Base_Color_2K.jpg");
        this.textures.T_wood_cedar_white_V01_modified01_Base_Color_2K.wrapS = THREE.RepeatWrapping;
        this.textures.T_wood_cedar_white_V01_modified01_Base_Color_2K.wrapT = THREE.RepeatWrapping;

        this.textures.T_wood_cedar_white_V01_Base_Color_TEAK_2K = new THREE.TextureLoader().load("textures/wood_cedar_white/T_wood_cedar_white_V01_Base_Color_TEAK_2K.jpg");
        this.textures.T_wood_cedar_white_V01_Base_Color_TEAK_2K.wrapS = THREE.RepeatWrapping;
        this.textures.T_wood_cedar_white_V01_Base_Color_TEAK_2K.wrapT = THREE.RepeatWrapping;

        this.textures.T_wood_cedar_white_V01_Roughness_1K = new THREE.TextureLoader().load("textures/wood_cedar_white/T_wood_cedar_white_V01_Roughness_1K.jpg");
        this.textures.T_wood_cedar_white_V01_Roughness_1K.wrapS = THREE.RepeatWrapping;
        this.textures.T_wood_cedar_white_V01_Roughness_1K.wrapT = THREE.RepeatWrapping;

        this.textures.T_wood_cedar_white_V01_Normal_1K = new THREE.TextureLoader().load("textures/wood_cedar_white/T_wood_cedar_white_V01_Normal_1K.jpg");
        this.textures.T_wood_cedar_white_V01_Normal_1K.wrapS = THREE.RepeatWrapping;
        this.textures.T_wood_cedar_white_V01_Normal_1K.wrapT = THREE.RepeatWrapping;
      },

      setTextures() {
        this.objects.forEach(mesh => {

          if (!!mesh.material && !!mesh.material.name) {

            switch (mesh.material.name) {
              case 'M_AR_changable_exterior':
                mesh.material.map = this.textures.T_wood_cedar_white_V01_Base_Color_2K_01;
                mesh.material.color.set("rgb(255, 153, 100)");
                mesh.material.metalnessMap = this.textures.T_wood_cedar_white_V01_Roughness_1K;
                break;
              case 'M_AR_changable_interior':
                mesh.material.map = this.textures.T_wood_cedar_white_V01_modified01_Base_Color_2K;
                mesh.material.color.set("rgb(200, 200, 200)");
                mesh.material.metalnessMap = this.textures.T_wood_cedar_white_V01_Roughness_1K;
                break;
              case 'M_AR_ceramic_tiles':
                mesh.material.map = this.textures.T_wood_cedar_white_V01_modified01_Base_Color_2K;
                mesh.material.color.set("rgb(200, 200, 200)");
                mesh.material.metalnessMap = this.textures.T_wood_cedar_white_V01_Roughness_1K;
                break;
              case 'M_AR_changable_windows':
                mesh.material.map = this.textures.T_wood_cedar_white_V01_Base_Color_TEAK_2K;
                mesh.material.color.set("rgb(168, 137, 134)");
                mesh.material.metalnessMap = this.textures.T_wood_cedar_white_V01_Roughness_1K;
                break;
              case 'M_AR_glass':
                mesh.material = new THREE.MeshBasicMaterial({opacity: 0.6, transparent: true});
                mesh.material.color.set("rgba(0, 181, 204)");
                mesh.material.roughness = 0.1;
                mesh.material.metalness = 0.0;
                mesh.material.reflectivity = 1.0;
                break;
              case 'M_AR_changable_gutters':
                mesh.material.color.set("rgb(242, 242, 242)");
                mesh.material.roughness = 0.4;
                mesh.material.metalness = 1;
                break;
              case 'M_AR_changable_roof_first':
                mesh.material.color.set("rgb(7, 7, 7)");
                mesh.material.roughness = 0.4;
                mesh.material.metalness = 0;
                break;
              case 'M_AR_changable_roof_second':
                mesh.material.color.set("rgb(7, 7, 7)");
                mesh.material.roughness = 0.4;
                mesh.material.metalness = 0;
                break;
              case 'M_AR_rest_roof':
                mesh.material.color.set("rgb(242, 242, 242)");
                mesh.material.roughness = 0.4;
                mesh.material.metalness = 1;
                break;
              case 'M_AR_changable_afrodyta':
                mesh.material.color.set("rgb(2, 2, 2)");
                break;
              case 'M_AR_changable_diamond_slates_roof':
                mesh.material.color.set("rgb(7, 7, 7)");
                break;
              case 'M_AR_changable_monza':
                mesh.material.color.set("rgb(23, 35, 18)");
                break;
            }
          }
        });
      }
    },
    mounted() {
      this.scene = SceneInit({rootEl: this.$refs.container});
      this.loadModel();
    },
  };
</script>

<style lang="scss" scoped></style>
