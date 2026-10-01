export interface Combo {cards:[number,number];weight:number}
const rs='23456789TJQKA';
export const categories=Array.from({length:13},(_,i)=>Array.from({length:13},(_,j)=>{const a=12-i,b=12-j;return a===b?rs[a]+rs[b]:a>b?rs[a]+rs[b]+'s':rs[b]+rs[a]+'o'})).flat();
function expand(name:string):[number,number][]{const a=rs.indexOf(name[0]),b=rs.indexOf(name[1]),kind=name[2];if(a<0||b<0||a<b||a===b&&kind)throw Error('无效范围类别：'+name);const out:[number,number][]=[];for(let s=0;s<4;s++)for(let t=0;t<4;t++){if(a===b&&s>=t)continue;if(a!==b&&((kind==='s'&&s!==t)||(kind==='o'&&s===t)))continue;out.push([s*13+a,t*13+b])}return out}
export function parseRange(text:string,dead:number[]=[]):Combo[]{const map=new Map<string,Combo>();
 const put=(name:string,weight:number)=>{for(const cards of expand(name)){if(cards.some(c=>dead.includes(c)))continue;const key=[...cards].sort((a,b)=>a-b).join('-');map.set(key,{cards,weight})}};
 if(text.trim()===''||/^(random|all)$/i.test(text.trim())){for(let a=0;a<52;a++)for(let b=a+1;b<52;b++)if(!dead.includes(a)&&!dead.includes(b))map.set(a+'-'+b,{cards:[a,b],weight:1});return [...map.values()]}
 for(const token of text.toUpperCase().replace(/10/g,'T').split(/[\s,，]+/).filter(Boolean)){
 const [raw,w,...extra]=token.split(':');const weight=w===undefined?1:Number(w);if(extra.length||!Number.isFinite(weight)||weight<0||weight>1)throw Error('权重须为 0–1：'+token);
 const names:string[]=[];
 if(raw.includes('-')){const [lo,hi,...rest]=raw.split('-');if(rest.length||!/^([2-9TJQKA])\1$/.test(lo)||!/^([2-9TJQKA])\1$/.test(hi))throw Error('区间暂支持对子，例如 77-JJ：'+token);const a=rs.indexOf(lo[0]),b=rs.indexOf(hi[0]);for(let i=Math.min(a,b);i<=Math.max(a,b);i++)names.push(rs[i]+rs[i])}
 else{const match=raw.match(/^([2-9TJQKA])([2-9TJQKA])([SO])?(\+)?$/);if(!match)throw Error('无法识别范围：'+token);const a=rs.indexOf(match[1]),b=rs.indexOf(match[2]),kind=match[3]?.toLowerCase()??'';if(a<b)throw Error('大点数请写前面：'+token);if(match[4]){if(a===b){for(let i=a;i<13;i++)names.push(rs[i]+rs[i])}else{for(let i=b;i<a;i++)names.push(rs[a]+rs[i]+kind)}}else names.push(rs[a]+rs[b]+kind)}
 for(const name of names)put(name,weight);
 }return [...map.values()].filter(c=>c.weight>0);
}
export const presets={random:'random',tight:'TT+, AQs+, AKo',broad:'66+, ATs+, KTs+, QJs, AJo+, KQo'};
