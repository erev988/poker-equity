import {describe,it,expect} from 'vitest';import {score} from '../src/engine/evaluator';import {calculate} from '../src/engine/equity';import {advise,amounts} from '../src/engine/advice';import {initialScenario} from '../src/types';
const c=(r:number,s=0)=>s*13+r-2;
describe('牌型',()=>{
 it('A2345 顺子小于六高顺子',()=>expect(score([c(14),c(2,1),c(3,2),c(4,3),c(5),c(9,1),c(11,2)])).toBeLessThan(score([c(2),c(3,1),c(4,2),c(5,3),c(6),c(9,1),c(11,2)])));
 it('双三条选较大三条做葫芦',()=>expect(Math.floor(score([c(14),c(14,1),c(14,2),c(13),c(13,1),c(13,2),c(2)])/15**5)).toBe(6));
 it('同花顺大于四条',()=>expect(score([c(10),c(11),c(12),c(13),c(14),c(2,1),c(3,2)])).toBeGreaterThan(score([c(14),c(14,1),c(14,2),c(14,3),c(13),c(2),c(3)])));
 it('七张踢脚比较',()=>expect(score([c(14),c(14,1),c(13),c(11,1),c(9,2),c(4),c(2)])).toBeGreaterThan(score([c(14),c(14,1),c(12),c(11,1),c(9,2),c(4),c(2)])));
});
describe('权益',()=>{
 const board=[c(10),c(11),c(12),c(13),c(14)];
 it('公共皇家同花顺单挑精确平分',()=>{const r=calculate({hole:[c(2,1),c(3,2)],board,opponents:1,samples:1000});expect(r.method).toBe('exact');expect(r.samples).toBe(990);expect(r.equity).toBe(.5);expect(r.tie).toBe(1);expect(r.win).toBe(0)});
 it('三人平分权益 1/3',()=>{const r=calculate({hole:[c(2,1),c(3,2)],board,opponents:2,samples:1000,seed:2});expect(r.equity).toBeCloseTo(1/3,10);expect(r.tie).toBe(1)});
 it('种子模拟可重复',()=>{const req={hole:[12,25],board:[],opponents:1,samples:1000,seed:42};expect(calculate(req)).toEqual(calculate(req))});
 it('拒绝重复牌',()=>expect(()=>calculate({hole:[12,12],board:[],opponents:1,samples:1000})).toThrow());
});
describe('行动解释',()=>{
 it('20% 门槛与 12.5 EV',()=>{const s={...initialScenario(),pot:'100',call:'25',closed:true};const a=advise({equity:.3,win:.3,tie:0,se:0,samples:1000,method:'exact'},s);expect(a.threshold).toBe(.2);expect(a.ev).toBe(12.5)});
 it('超筹码不计算 EV',()=>{const s={...initialScenario(),pot:'100',call:'25',stack:'10'};expect(advise({equity:.3,win:.3,tie:0,se:0,samples:1000,method:'exact'},s).ev).toBeNull()});
 it('负数金额拒绝',()=>expect(()=>amounts({...initialScenario(),pot:'-1'})).toThrow());
});
