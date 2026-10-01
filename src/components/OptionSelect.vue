<script setup lang="ts">
import {computed,ref,onMounted,onUnmounted} from 'vue';
const props=defineProps<{value:string|number;options:{value:string|number;label:string}[];label:string}>();
const emit=defineEmits<{change:[value:string|number]}>();const open=ref(false),root=ref<HTMLElement|null>(null);const current=computed(()=>props.options.find(o=>o.value===props.value)?.label??'请选择');
function outside(e:PointerEvent){if(!root.value?.contains(e.target as Node))open.value=false}
function select(value:string|number){emit('change',value);open.value=false;root.value?.querySelector('button')?.focus()}
function keyboard(e:KeyboardEvent){if(e.key==='Escape'){open.value=false;root.value?.querySelector('button')?.focus()}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open.value=true;setTimeout(()=>{const buttons=Array.from(root.value?.querySelectorAll<HTMLButtonElement>('.option-item')??[]);const index=buttons.indexOf(document.activeElement as HTMLButtonElement);buttons[(index+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus()},0)}}
onMounted(()=>document.addEventListener('pointerdown',outside));onUnmounted(()=>document.removeEventListener('pointerdown',outside));
</script>
<template><div ref="root" class="option-select" @keydown="keyboard"><button type="button" class="option-trigger" :aria-label="label" :aria-expanded="open" @click="open=!open"><span>{{current}}</span><span aria-hidden="true">{{open?'▴':'▾'}}</span></button><div v-if="open" class="option-list" role="group" :aria-label="label+'选项'"><button type="button" v-for="option in options" :key="option.value" class="option-item" :class="{active:value===option.value}" :aria-pressed="value===option.value" @click="select(option.value)">{{option.label}}<span v-if="value===option.value" aria-hidden="true">✓</span></button></div></div></template>
