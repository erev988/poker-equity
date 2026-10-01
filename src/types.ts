export type Card = number;
export interface Scenario { hole: (Card|null)[]; board:(Card|null)[]; opponents:number; samples:number; pot:string; call:string; stack:string; closed:boolean; ranges:string[]; rake:string; cap:string; position:string; villainStack:string; notes:string }
export interface Request { hole:Card[]; board:Card[]; opponents:number; samples:number; seed?:number; ranges?:string[] }
export interface Result { equity:number; win:number; tie:number; se:number; samples:number; method:'exact'|'simulation' }
export const initialScenario = ():Scenario=>({hole:[null,null],board:[null,null,null,null,null],opponents:1,samples:25000,pot:'',call:'',stack:'',closed:false,ranges:Array(8).fill('random'),rake:'0',cap:'',position:'unknown',villainStack:'',notes:''});
