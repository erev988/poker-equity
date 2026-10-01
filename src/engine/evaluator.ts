function encode(category:number,values:number[]){let n=category;for(let i=0;i<5;i++)n=n*15+(values[i]??0);return n}
function straight(rs:number[]){const set=new Set(rs);if(set.has(14))set.add(1);for(let h=14;h>=5;h--)if([0,1,2,3,4].every(d=>set.has(h-d)))return h;return 0}
export function score(cards:number[]):number{
 const counts=Array<number>(15).fill(0),suits:number[][]=[[],[],[],[]];
 for(const c of cards){const r=c%13+2;counts[r]++;suits[Math.floor(c/13)].push(r)}
 const groups:number[]=[];for(let r=14;r>=2;r--)if(counts[r])groups.push(r);
 const flush=suits.find(s=>s.length>=5);
 if(flush){const s=straight(flush);if(s)return encode(8,[s])}
 const four=groups.find(r=>counts[r]===4);if(four)return encode(7,[four,groups.find(r=>r!==four)!]);
 const triples=groups.filter(r=>counts[r]>=3);
 if(triples.length){const pair=groups.find(r=>r!==triples[0]&&counts[r]>=2);if(pair)return encode(6,[triples[0],pair])}
 if(flush)return encode(5,flush.sort((a,b)=>b-a).slice(0,5));
 const s=straight(groups);if(s)return encode(4,[s]);
 if(triples.length)return encode(3,[triples[0],...groups.filter(r=>r!==triples[0]).slice(0,2)]);
 const pairs=groups.filter(r=>counts[r]>=2);
 if(pairs.length>=2)return encode(2,[pairs[0],pairs[1],groups.find(r=>r!==pairs[0]&&r!==pairs[1])!]);
 if(pairs.length)return encode(1,[pairs[0],...groups.filter(r=>r!==pairs[0]).slice(0,3)]);
 return encode(0,groups.slice(0,5));
}
export function handName(cards:number[]){if(cards.length<5)return '等待公共牌';return ['高牌','一对','两对','三条','顺子','同花','葫芦','四条','同花顺'][Math.floor(score(cards)/15**5)]}
