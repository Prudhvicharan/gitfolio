import test from 'node:test';
import assert from 'node:assert/strict';
import {parseDraft} from '../src/utils/draft.ts';
import {PRESETS} from '../src/utils/content.ts';
import {DEMO_USER,DEMO_REPOS} from '../src/utils/demo.ts';
const config={theme:'radical',headerStyle:'wave',headerColor:'gradient',userData:DEMO_USER,repos:DEMO_REPOS,sections:PRESETS.balanced,socialLinks:{},jobTitle:'',aiContent:null};
test('draft restoration validates inputs and drops unknown credential fields',()=>{
 const restored=parseDraft(JSON.stringify({version:1,config:{...config,apiKey:'never-restore-this'},availableRepos:DEMO_REPOS}));
 assert.equal(restored.config.userData.login,'gitfolio-demo');assert.equal(restored.config.apiKey,undefined);
 for(const value of ['{','null',JSON.stringify({version:1,config:{...config,sections:{}},availableRepos:[]})])assert.equal(parseDraft(value),null);
});
