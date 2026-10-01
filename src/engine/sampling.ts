import type {Combo} from './ranges';
export function rng(seed:number){let state=seed>>>0;return ()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296}}
export function sampler(combos:Combo[]){const cumulative:number[]=[];let total=0;for(const c of combos){total+=c.weight;cumulative.push(total)}return (random:()=>number)=>{const target=random()*total;let a=0,b=combos.length-1;while(a<b){const m=(a+b)>>1;if(cumulative[m]>target)b=m;else a=m+1}return combos[a].cards}}
