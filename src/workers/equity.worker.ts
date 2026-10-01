import {calculate} from '../engine/equity';
self.onmessage=e=>{try{const result=calculate(e.data,p=>self.postMessage({type:'progress',value:p}));self.postMessage({type:'result',value:result})}catch(error){self.postMessage({type:'error',value:error instanceof Error?error.message:'计算失败'})}};
