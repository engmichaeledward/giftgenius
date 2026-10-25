import test from 'node:test';import assert from 'node:assert/strict';
import {cleanInput,searchLinks,fallbackIdeas,normalizeIdeas} from '../src/engine.js';
const input=cleanInput({country:'EG',budget:1500,language:'ar',interests:['coffee'],city:'Cairo'});
test('normalization and currency country',()=>{assert.equal(input.budget,1500);assert.equal(input.country,'EG')});
test('reject invalid budget',()=>assert.throws(()=>cleanInput({budget:-1}),/INVALID_BUDGET/));
test('safe links',()=>{const x=searchLinks('travel mug','EG','Cairo');assert.equal(x.length,5);assert(x.every(l=>l.url.startsWith('https://')))});
test('fallback with verified-price false',()=>{const x=fallbackIdeas(input);assert(x.length>=5);assert(x.every(g=>g.price===null&&!g.price_verified))});
test('AI result cleaning and dedup',()=>{const x=normalizeIdeas([{title:'A',search_query:'A'},{title:'A',search_query:'A'},{title:'B',search_query:'B'}],input);assert.equal(x.length,2)});
