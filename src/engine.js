export const COUNTRIES = [
 {code:'EG', ar:'مصر',en:'Egypt',currency:'EGP',currencyLabel:'جنيه',markets:['Amazon Egypt','Jumia Egypt','Noon Egypt','Google Shopping']},
 {code:'SA', ar:'السعودية',en:'Saudi Arabia',currency:'SAR',currencyLabel:'ر.س',markets:['Amazon Saudi Arabia','Noon Saudi Arabia','Google Shopping']},
 {code:'AE', ar:'الإمارات',en:'United Arab Emirates',currency:'AED',currencyLabel:'د.إ',markets:['Amazon UAE','Noon UAE','Google Shopping']},
 {code:'US', ar:'الولايات المتحدة',en:'United States',currency:'USD',currencyLabel:'USD',markets:['Amazon USA','Walmart','Google Shopping']}
];
export const OCCASIONS = ['birthday','anniversary','graduation','thank_you','new_home','wedding','just_because','other'];
export const RELATIONSHIPS = ['friend','partner','spouse','parent','sibling','child','colleague','other'];
export function cleanInput(data){
 if(!data || typeof data!=='object' || Array.isArray(data)) throw Error('INVALID_INPUT');
 const str=(v,n=120)=>typeof v==='string'?v.trim().slice(0,n):'';
 const budget=Number(data.budget), age=data.age===''||data.age==null?null:Number(data.age);
 const country=COUNTRIES.find(c=>c.code===data.country)||COUNTRIES[0];
 if(!Number.isFinite(budget)||budget<=0||budget>1e8) throw Error('INVALID_BUDGET');
 if(age!==null&&(!Number.isInteger(age)||age<0||age>120)) throw Error('INVALID_AGE');
 const list=(v)=>Array.isArray(v)?v.filter(x=>typeof x==='string').slice(0,12).map(x=>str(x,45)).filter(Boolean):[];
 return {name:str(data.name,60),age,relationship:RELATIONSHIPS.includes(data.relationship)?data.relationship:'other',occasion:OCCASIONS.includes(data.occasion)?data.occasion:'other',country:country.code,city:str(data.city,70)|| (country.code==='EG'?'Cairo':''),budget,interests:list(data.interests),personality:str(data.personality,140),avoid:str(data.avoid,140),notes:str(data.notes,350),style:['practical','sentimental','fun','any'].includes(data.style)?data.style:'any',shopping:['online','local','both'].includes(data.shopping)?data.shopping:'both',language:data.language==='en'?'en':'ar'};
}
export function searchLinks(query,countryCode,city){
 const country=COUNTRIES.find(x=>x.code===countryCode)||COUNTRIES[0];
 const search=encodeURIComponent(`${query} ${country.en}`);
 const qsite=(site)=>`https://www.google.com/search?q=${encodeURIComponent(`site:${site} ${query} ${country.en}`)}`;
 const links=[{label:'Google Shopping',url:`https://www.google.com/search?tbm=shop&q=${search}`}];
 const sets={EG:[['Amazon.eg','amazon.eg'],['Jumia','jumia.com.eg'],['Noon','noon.com/egypt-en']],SA:[['Amazon.sa','amazon.sa'],['Noon','noon.com/saudi-en']],AE:[['Amazon.ae','amazon.ae'],['Noon','noon.com/uae-en']],US:[['Amazon','amazon.com'],['Walmart','walmart.com']]};
 for (const [label,site] of sets[country.code]||sets.EG) links.push({label,url:qsite(site)});
 links.push({label:'Google Maps',url:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query} shops ${city} ${country.en}`)}`});
 return links;
}
const LIBRARY=[
 {id:'journal',ar:'دفتر أنيق مع قلم',en:'Premium journal and pen set',tags:['reading','art','writing','study'],kind:'practical',reasonAr:'هدية شخصية قابلة للاستخدام اليومي ويمكن إضافة إهداء مكتوب بخط اليد.',reasonEn:'Thoughtful, practical, and easy to personalize with a handwritten note.'},
 {id:'coffee',ar:'بوكس قهوة أو شاي مختص',en:'Specialty coffee or tea gift box',tags:['coffee','food','home'],kind:'practical',reasonAr:'بوكس قابل للتخصيص حسب نوع المشروب المفضل مع تغليف لطيف.',reasonEn:'A customizable tasting set that is easy to wrap.'},
 {id:'plant',ar:'نبتة منزلية في أصيص أنيق',en:'Indoor plant with decorative pot',tags:['plants','home','nature'],kind:'sentimental',reasonAr:'هدية ديكور جميلة تعيش مدة طويلة، لو الشخص يحب النباتات.',reasonEn:'A lasting decor gift for someone who enjoys plants.'},
 {id:'boardgame',ar:'لعبة جماعية أو ألغاز',en:'Party board game or puzzle',tags:['games','friends','fun'],kind:'fun',reasonAr:'هدية مسلية يمكن الاستمتاع بها مع الأصدقاء.',reasonEn:'A social and memorable activity to enjoy with friends.'},
 {id:'skincare',ar:'بوكس عناية شخصية',en:'Personal care gift set',tags:['beauty','selfcare','wellness'],kind:'practical',reasonAr:'يمكن اختياره بروائح خفيفة وبمنتجات مناسبة لتفضيلات الشخص.',reasonEn:'A relaxing self-care option if preferences are known.'},
 {id:'mug',ar:'مج حراري أنيق',en:'Insulated travel mug',tags:['coffee','travel','work'],kind:'practical',reasonAr:'مناسب للشغل والخروجات والسفر بدون الحاجة إلى معرفة المقاس.',reasonEn:'A convenient everyday item for work or commuting.'},
 {id:'art',ar:'أدوات رسم أو تلوين',en:'Art and illustration starter kit',tags:['art','crafts','design'],kind:'fun',reasonAr:'هدية تشجع الإبداع والهواية، وتناسب المهتمين بالفن.',reasonEn:'A creative kit for someone who enjoys making things.'},
 {id:'book',ar:'كتاب من نوعها المفضل',en:'Book in their favorite genre',tags:['reading','study'],kind:'sentimental',reasonAr:'هدية بسيطة ومميزة لو عرفت التصنيف الأدبي الذي تحبه.',reasonEn:'An especially thoughtful option when their favorite genre is known.'},
 {id:'speaker',ar:'سماعة بلوتوث صغيرة',en:'Compact Bluetooth speaker',tags:['music','tech','travel'],kind:'practical',reasonAr:'هدية تقنية مفيدة لمحبي الموسيقى، مع ضرورة مراجعة المواصفات والسعر.',reasonEn:'A handy tech gift for music fans; compare specs before buying.'},
 {id:'candle',ar:'شموع معطرة وديكور',en:'Scented candle and decor set',tags:['home','selfcare','relax'],kind:'sentimental',reasonAr:'لمسة دافئة للبيت ويمكن تقديمها مع بطاقة تهنئة.',reasonEn:'A cozy home accent that pairs well with a personal card.'},
 {id:'fitness',ar:'زجاجة مياه رياضية وإكسسوارات',en:'Fitness bottle and accessories',tags:['sports','fitness','travel'],kind:'practical',reasonAr:'عملية للتمرين والحياة اليومية إذا كان الشخص يهتم بالرياضة.',reasonEn:'Useful for active lifestyles and daily hydration.'},
 {id:'experience',ar:'تجربة أو نشاط مشترك',en:'Shared activity or experience',tags:['travel','food','friends','fun'],kind:'fun',reasonAr:'الذكريات المشتركة أحيانًا تكون أجمل من هدية مادية.',reasonEn:'A shared memory can feel more special than an object.'}
];
export function fallbackIdeas(input){
 const interests=input.interests.map(x=>x.toLowerCase());
 return LIBRARY.map((g,index)=>({...g,score:g.tags.reduce((n,t)=>n+(interests.some(v=>v.includes(t)||t.includes(v))?20:0),0)+(g.kind===input.style?12:0)+ (12-index)*0.1})).sort((a,b)=>b.score-a.score).slice(0,7).map((g,i)=>({id:g.id,title:g[input.language],reason:g[input.language==='en'?'reasonEn':'reasonAr'],query:g.en,category:g.kind,match:Math.max(60,Math.min(94,Math.round(66+g.score))),price:null,price_verified:false,source:'curated',rank:i+1}));
}
export function normalizeIdeas(items, input){
 if(!Array.isArray(items)) throw Error('INVALID_AI_RESPONSE');
 const used=new Set();
 return items.slice(0,16).map((x,i)=>{
 const title=typeof x?.title==='string'?x.title.trim().slice(0,110):'';
 const query=typeof x?.search_query==='string'?x.search_query.trim().slice(0,130):title;
 if(!title||!query||used.has(title.toLowerCase()))return null;
 used.add(title.toLowerCase());
 return {id:`ai_${i}`,title,query,reason:String(x.reason||'').slice(0,250),category:String(x.category||'gift').slice(0,40),match:Math.min(95,Math.max(50,Math.round(Number(x.match)||75))),price:null,price_verified:false,source:'ai'};
 }).filter(Boolean).slice(0,8).map((x,i)=>({...x,rank:i+1}));
}
