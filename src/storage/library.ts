import {makeId} from './id';import {initialScenario} from '../types';import type {Scenario} from '../types';import {amounts} from '../engine/advice';import {parseRange} from '../engine/ranges';
export interface Entry{id:string;name:string;date:string;scenario:Scenario}
const key='poker-lab-library-v1';
export function normalize(value:any):Scenario{if(!value||typeof value!=='object')throw Error('无效牌局');const s={...initialScenario(),...value};for(const [name,n] of [['hole',2],['board',5]] as const){if(!Array.isArray(s[name])||s[name].length!==n||s[name].some((c:any)=>c!==null&&(!Number.isInteger(c)||c<0||c>51)))throw Error('牌张格式无效')}
 const known=[...s.hole,...s.board].filter(c=>c!==null);if(new Set(known).size!==known.length)throw Error('重复牌');let gap=false;for(const c of s.board){if(c===null)gap=true;else if(gap)throw Error('公共牌存在缺口')}
 if(!Number.isInteger(s.opponents)||s.opponents<1||s.opponents>8||![10000,25000,100000].includes(s.samples))throw Error('人数或预算无效');
 for(const name of ['pot','call','stack','rake','cap','villainStack'] as const)if(typeof s[name]!=='string')throw Error('金额格式无效');amounts(s);
 if(typeof s.notes!=='string'||s.notes.length>20000||typeof s.closed!=='boolean'||!['unknown','IP','OOP'].includes(s.position)||!Array.isArray(s.ranges)||s.ranges.length!==8||s.ranges.some((r:any)=>typeof r!=='string'||r.length>10000))throw Error('设置格式无效');s.ranges.forEach((r:string)=>parseRange(r));return JSON.parse(JSON.stringify(s)) as Scenario}
export function decode(text:string):Entry[]{const data=JSON.parse(text);if(data.version!==1||!Array.isArray(data.entries)||data.entries.length>100)throw Error('不支持的数据版本或超过 100 条');return data.entries.map((e:any)=>{if(typeof e.name!=='string'||e.name.length>120||typeof e.date!=='string')throw Error('记录格式无效');return {id:makeId(),name:e.name,date:e.date,scenario:normalize(e.scenario)}})}
export function readLibrary(){const text=localStorage.getItem(key);return text?decode(text):[]}
export function encode(entries:Entry[]){return JSON.stringify({version:1,entries},null,2)}
export function writeLibrary(entries:Entry[]){localStorage.setItem(key,encode(entries))}
