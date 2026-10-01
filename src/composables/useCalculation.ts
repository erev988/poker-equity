import {ref,onUnmounted} from 'vue';
import WorkerConstructor from '../workers/equity.worker?worker&inline';
import {validate} from '../engine/cards';
import type { Request,Result } from '../types';
export function useCalculation(){const result=ref<Result|null>(null),busy=ref(false),progress=ref(0),error=ref('');let worker:Worker|null=null,generation=0;
 function cancel(){generation++;worker?.terminate();worker=null;busy.value=false}
 function invalidate(){cancel();result.value=null;error.value='';progress.value=0}
 function run(request:Request){invalidate();try{validate(request);const id=generation;worker=new WorkerConstructor();busy.value=true;
 worker.onmessage=e=>{if(id!==generation)return;if(e.data.type==='progress')progress.value=e.data.value;else{if(e.data.type==='result'){result.value=e.data.value;progress.value=1}else error.value=e.data.value;cancel()}};
 worker.onerror=()=>{if(id!==generation)return;error.value='后台计算失败，请重试；若持续失败，请使用兼容浏览器。';cancel()};worker.postMessage({...request,hole:[...request.hole],board:[...request.board],ranges:request.ranges?[...request.ranges]:undefined})
 }catch(e){error.value=e instanceof Error?e.message:'无法启动计算';cancel()}}
 onUnmounted(cancel);return {result,busy,progress,error,run,cancel,invalidate};
}
