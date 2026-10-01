import {score,handName} from './evaluator';
export function analyzeDraws(hole:number[],board:number[]){if(hole.length!==2||board.length<3||board.length>=5)return null;const known=[...hole,...board],category=Math.floor(score(known)/15**5),available=Array.from({length:52},(_,i)=>i).filter(c=>!known.includes(c));
 const improvements=available.filter(c=>Math.floor(score([...known,c])/15**5)>category);
 const suitCounts=[0,1,2,3].map(s=>known.filter(c=>Math.floor(c/13)===s).length);
 const values=new Set(known.map(c=>c%13+2));if(values.has(14))values.add(1);
 const straightDraw=Array.from({length:10},(_,i)=>i+5).some(high=>[0,1,2,3,4].filter(d=>values.has(high-d)).length===4);
 return {name:handName(known),improvements,probability:improvements.length/available.length,total:available.length,flushDraw:suitCounts.includes(4),straightDraw};
}
