<template>
  <div class="prompt-element" :title="tooltip" :class="{ dark: darkMode }">
    <span class="prompt-element_label">{{ label }}</span>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import darkMode from '@/lib/darkMode';

export default defineComponent({
  name: 'BasePromptElement',
  props: {
    /**
     * The label of the element that is displayed in the "Prompt Elements" and the "Your Prompt" sections.
     * Labels are defined in `PROMPT_ELEMENT_TYPES` (`lib/enum/promptElementType.ts`).
     */
    label: {
      type: String,
      required: true,
    },
    /**
     * The tooltip that is displayed when hovering over the element.
     * Tooltips are defined in `PROMPT_ELEMENT_TYPES` (`lib/enum/promptElementType.ts`).
     */
    tooltip: {
      type: String,
      default: '',
    },
  },
  computed: {
    /**
     * Returns `true` if the dark mode is enabled, `false` otherwise.
     */
    darkMode(): boolean {
      return darkMode().enabled;
    },
  },
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/_variables.sass"

.prompt-element
  display: inline-block
  border-radius: 0.2em
  padding: 0.3em 0.4em
  background-color: $color-dark
  color: $color-dim
  cursor: pointer
  &.dark
    &.selected
      background-color: lighten($color-accent, 20%)
    background-color: $color-dark-on-light
    color: $color-dim-on-light

  .prompt-element_label
    vertical-align: middle
</style>
