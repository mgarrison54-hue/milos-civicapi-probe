const BASE='https://civicapi.org/api/v2';
const SEARCH='?country=US&province=KY&election_type=General&start_date=2026-11-03&end_date=2026-11-04&limit=20';
const json=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{'content-type':'application/json','cache-control':'no-store'}});
async function probe(label,path,headers){
 const started=Date.now();
 try {
  const response=await fetch(BASE+path,{headers,redirect:'follow',signal:AbortSignal.timeout(10000),cf:{cacheTtl:0,cacheEverything:false}});
  const raw=await response.text();let parsed;try{parsed=JSON.parse(raw)}catch{}
  return {label,httpStatus:response.status,elapsedMs:Date.now()-started,contentType:response.headers.get('content-type'),raceCount:parsed?.count??null,raceIds:Array.isArray(parsed?.races)?parsed.races.filter(r=>r.type==='US Senate').map(r=>r.id):[],race:parsed?.id?{id:parsed.id,type:parsed.type,election_date:parsed.election_date,percent_reporting:parsed.percent_reporting,candidates:parsed.candidates}:undefined,bodyPreview:response.ok?undefined:raw.slice(0,400)};
 } catch(e){return {label,error:String(e?.message||e),elapsedMs:Date.now()-started}}
}
export default {async fetch(request,env){
 const u=new URL(request.url);
 if(u.pathname==='/api/health')return json({status:'ok',version:'probe-1'});
 if(u.pathname==='/api/probe'){
  // Sequential tests to avoid generating a burst of requests to CivicAPI.
  const tests=[];
  tests.push(await probe('Kentucky race ID 87174','/race/87174',{'accept':'application/json'}));
  tests.push(await probe('Kentucky general search','/race/search'+SEARCH,{'accept':'application/json'}));
  return json({testedAt:new Date().toISOString(),tests});
 }
 return env.ASSETS.fetch(request);
}};
