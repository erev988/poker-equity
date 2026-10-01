import {it,expect} from 'vitest';import {calculate} from '../src/engine/equity';
it('小范围翻牌精确枚举所有剩余两张牌',()=>{const q={hole:[12,25],board:[0,14,28],opponents:1,samples:10000,ranges:['KK']};const r=calculate(q);expect(r.method).toBe('exact');expect(r.samples).toBe(6*45*44/2);expect(r.se).toBe(0);expect(r.win+r.tie).toBeLessThanOrEqual(1)});
