import type { Request } from '../types';
export const ranks=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
export const suits=['♠','♥','♦','♣'];
export const label=(c:number)=>ranks[c%13]+suits[Math.floor(c/13)];
export const red=(c:number)=>[1,2].includes(Math.floor(c/13));
export function validate(r:Request){
 if(r.hole.length!==2 || ![0,3,4,5].includes(r.board.length))throw Error('请选择两张底牌；公共牌必须是 0、3、4 或 5 张。');
 const all=[...r.hole,...r.board];
 if(all.some(c=>!Number.isInteger(c)||c<0||c>51)||new Set(all).size!==all.length)throw Error('牌张无效或出现重复牌。');
 if(!Number.isInteger(r.opponents)||r.opponents<1||r.opponents>8)throw Error('对手人数须为 1–8。');
 if(!Number.isInteger(r.samples)||r.samples<1000||r.samples>200000)throw Error('模拟次数超出支持范围。');
}
