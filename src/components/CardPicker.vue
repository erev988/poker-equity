<script setup lang="ts">
import {ranks,suits,label,red} from '../engine/cards';
const props=defineProps<{used:number[];current:number|null;title:string}>();
const emit=defineEmits<{select:[card:number|null];close:[]}>();
</script>
<template><div class="modal-backdrop" @click.self="emit('close')"><section class="picker" role="dialog" aria-modal="true" :aria-label="title"><header><div><small>选择一张牌</small><h2>{{title}}</h2></div><button class="icon" aria-label="关闭选牌" @click="emit('close')">×</button></header><p class="muted">已用牌标记为“占用”。点击当前牌可保留，点击清除可移除。</p><div class="deck-row" v-for="(suit,s) in suits" :key="s"><span class="suit" :class="{red:s===1||s===2}">{{suit}}</span><div class="rank-grid"><button v-for="(rank,r) in ranks" :key="r" :class="['mini-card',{red:red(s*13+r),chosen:current===s*13+r}]" :disabled="props.used.includes(s*13+r)&&current!==s*13+r" :aria-label="label(s*13+r)" @click="emit('select',s*13+r)">{{rank}}<small v-if="props.used.includes(s*13+r)&&current!==s*13+r">占用</small></button></div></div><button class="secondary full" @click="emit('select',null)">清除这个牌位</button></section></div></template>
