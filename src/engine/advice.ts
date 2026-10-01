import type { Result,Scenario } from '../types';
export function amounts(s:Scenario){const parse=(v:string)=>v.trim()===''?null:Number(v);const pot=parse(s.pot),call=parse(s.call),stack=parse(s.stack);if([pot,call,stack,parse(s.villainStack)].some(v=>v!==null&&(!Number.isFinite(v)||v<0)))throw Error('金额必须为非负数；未知金额可留空。');const rake=parse(s.rake)??0,cap=parse(s.cap);if(!Number.isFinite(rake)||rake<0||rake>100||cap!==null&&(!Number.isFinite(cap)||cap<0))throw Error('抽水率须为 0–100%，封顶须为非负数。');return {pot,call,stack,rake,cap}}
export function advise(r:Result,s:Scenario){const {pot,call,stack,rake,cap}=amounts(s);
 const base={threshold:null as number|null,ev:null as number|null};
 if(pot===null||call===null)return {...base,title:'缺少赔率信息',text:'填写底池和本次需要补齐的跟注额，再分析直接跟注赔率。'};
 if(stack!==null&&call>stack)return {...base,title:'涉及全下／边池',text:'所需跟注超过剩余筹码。本版本未计算可争夺底池，不提供行动 EV。'};
 if(call===0)return {...base,title:'可过牌或下注',text:'无人下注时可过牌。仅凭权益不能决定下注或尺寸；过牌是保守选项，不一定最优。'};
 const net=pot+call-Math.min((pot+call)*rake/100,cap??Infinity);if(net<=0)return {...base,title:'可分配底池为零',text:'请检查抽水参数。'};const threshold=call/net,ev=r.equity*net-call,margin=r.equity-threshold;
 if(!s.closed)return {threshold,ev,title:margin>0?'高于直接跟注门槛':'低于直接跟注门槛',text:margin>0?'这不足以确定跟注：后续下注、对手范围与权益实现率可能改变结论。面对下注不能过牌。':'弃牌可作为保守参考，但隐含赔率和实际范围可能改变结论。不能据此排除加注。'};
 return {threshold,ev,title:Math.abs(margin)<=1.96*r.se?'接近盈亏平衡':margin>0?'模型下跟注优于弃牌':'模型下弃牌优于跟注',text:'仅在跟注后无后续下注、无边池，且所设范围与抽水假设成立时有效。不代表优于加注；位置并未用于策略求解。'};
}
