import {COUNTRIES,cleanInput,searchLinks,fallbackIdeas,normalizeIdeas} from './engine.js';
const json=(obj,status=200,headers={})=>new Response(JSON.stringify(obj),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff',...headers}});
const corsHeaders={'access-control-allow-origin':'same-origin'};
const modelError=(status)=>status===429?'AI_QUOTA_EXCEEDED':status===403?'AI_KEY_OR_PERMISSION_ERROR':'AI_UNAVAILABLE';
async function geminiIdeas(input, env){
 const prompt=`You are a thoughtful gift idea assistant. Return ONLY JSON array of 7-8 objects with keys title, reason, search_query, category, match (integer 50-95). Write title/reason in ${input.language==='ar'?'Egyptian Arabic':'English'}. Search_query must be realistic descriptive English product search keywords; not a URL or store name. Recipient: ${JSON.stringify(input)}. Suggest varied physical gifts or experiences likely to fit budget ${input.budget} ${COUNTRIES.find(c=>c.code===input.country).currency}. Avoid assuming unstated hobbies, gender, brand, availability or exact prices. No fabricated product links or prices. Avoid gift types indicated in avoid. Return distinct practical and thoughtful ideas suitable for relationship and occasion. If underage, only age-appropriate gifts.`;
 const model=env.GEMINI_MODEL||'gemini-2.5-flash';
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),17000);
 try{
  const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{method:'POST',signal:controller.signal,headers:{'content-type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:0.75,maxOutputTokens:1900}})});
  if(!response.ok)throw Error(modelError(response.status));
  const data=await response.json();const text=data.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'';
  const items=normalizeIdeas(JSON.parse(text),input);
  if(items.length<4) throw Error('INVALID_AI_RESPONSE');
  return items;
 }finally{clearTimeout(timer)}
}
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/api/health')return json({ok:true,aiConfigured:!!env.GEMINI_API_KEY,countries:COUNTRIES.map(c=>({code:c.code,ar:c.ar,en:c.en,currency:c.currency}))});
 if(url.pathname==='/api/recommendations'){
  if(request.method!=='POST')return json({error:'METHOD_NOT_ALLOWED'},405);
  if(Number(request.headers.get('content-length'))>12000)return json({error:'PAYLOAD_TOO_LARGE'},413);
  let input;
  try{input=cleanInput(await request.json())}catch(e){return json({error:e.message==='INVALID_BUDGET'?'INVALID_BUDGET':'INVALID_INPUT'},400)}
  let ideas,mode='demo',warning='AI_NOT_CONFIGURED';
  if(env.GEMINI_API_KEY){try{ideas=await geminiIdeas(input,env);mode='ai';warning=null}catch(e){warning=e.message||'AI_UNAVAILABLE';}}
  if(!ideas){ideas=fallbackIdeas(input);mode='curated';}
  const results=ideas.map(g=>({...g,links:searchLinks(g.query,input.country,input.city)}));
  return json({mode,warning,currency:COUNTRIES.find(c=>c.code===input.country).currency,results,disclaimer:input.language==='ar'?'هذه أفكار وروابط بحث للتسوق وليست عروض منتجات متحققًا من أسعارها أو مخزونها.':'These are gift ideas and shopping search links, not verified product offers, prices, or stock.'});
 }
 if(url.pathname.startsWith('/api/'))return json({error:'NOT_FOUND'},404);
 return env.ASSETS.fetch(request);
}};
