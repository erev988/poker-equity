import type {Request,Result} from '../types';
import {validate} from './cards';import {score} from './evaluator';import {parseRange} from './ranges';import {rng,sampler} from './sampling';
export function calculate(r:Request,progress:(p:number)=>void=()=>{}):Result{
 validate(r);const known=[...r.hole,...r.board],deck=Array.from({length:52},(_,i)=>i).filter(c=>!known.includes(c));
 const ranges=Array.from({length:r.opponents},(_,i)=>parseRange(r.ranges?.[i]??'random',known));
 if(ranges.some(c=>!c.length))throw Error('有对手范围在排除已知牌后为空。');
 let wins=0,ties=0,sum=0,sum2=0,totalWeight=0,count=0;
 const add=(board:number[],hands:number[][],weight=1)=>{const own=score([...r.hole,...board]);let same=1,lost=false;for(const hand of hands){const other=score([...hand,...board]);if(other>own){lost=true;break}if(other===own)same++}const share=lost?0:1/same;if(!lost){if(same===1)wins+=weight;else ties+=weight}sum+=share*weight;sum2+=share*share*weight;totalWeight+=weight;count++};
 const missing=5-r.board.length;
 const states=ranges[0].length*(missing===0?1:missing===1?deck.length-2:Infinity);
 const exact=r.opponents===1&&states<=60000;
 if(exact){for(const combo of ranges[0]){if(!missing)add(r.board,[combo.cards],combo.weight);else for(const card of deck)if(!combo.cards.includes(card))add([...r.board,card],[combo.cards],combo.weight);if(count%1000===0)progress(count/states)}}
 else{const random=rng(r.seed??Math.floor(Math.random()*4294967296)),draws=ranges.map(sampler);let attempts=0;const start=Date.now();
 while(count<r.samples){attempts++;if(attempts>Math.max(200000,r.samples*100)||Date.now()-start>30000)throw Error('范围冲突过多或计算超过 30 秒预算，请放宽范围、减少对手或模拟次数。');
 const hands=draws.map(draw=>draw(random));const used=hands.flat();if(new Set(used).size!==used.length)continue;
 const d=deck.filter(c=>!used.includes(c));for(let j=0;j<missing;j++){const k=j+Math.floor(random()*(d.length-j));[d[j],d[k]]=[d[k],d[j]]}add([...r.board,...d.slice(0,missing)],hands);if(count%1000===0)progress(count/r.samples);
 }}const equity=sum/totalWeight;return {equity,win:wins/totalWeight,tie:ties/totalWeight,se:exact?0:Math.sqrt(Math.max(0,sum2/totalWeight-equity**2)/count),samples:count,method:exact?'exact':'simulation'};
}
