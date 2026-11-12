import test from 'node:test';
import assert from 'node:assert/strict';
import {accountRequest,consumeAccountSession} from '../account-access.mjs';
test('cross-browser auth strips tokens before validating the verified identity',async()=>{
 let cleared=false;
 const result=await consumeAccountSession('','#access_token=access&refresh_token=refresh&type=invite',()=>{cleared=true;},async(url,options)=>{
  assert.equal(cleared,true);assert.equal(options.cache,'no-store');assert.equal(options.headers.Authorization,'Bearer access');return {ok:true,json:async()=>({id:'user',email:'person@example.com',email_confirmed_at:'2026-10-17'})};
 });
 assert.equal(result.user.email,'person@example.com');assert.equal(result.access_token,'access');
});
test('fabricated, unconfirmed and partial callbacks cannot complete account onboarding',async()=>{
 await assert.rejects(()=>consumeAccountSession('','#access_token=x&refresh_token=y',()=>{},async()=>({ok:true,json:async()=>({email:'x@example.com'})})),/Verify your email/);
 await assert.rejects(()=>consumeAccountSession('','#access_token=x',()=>{}),/incomplete/);
 await assert.rejects(()=>consumeAccountSession('?code=x','',()=>{}),/email code/);
});
test('an ordinary direct visit does not assume a signed-in session',async()=>{
 assert.equal(await consumeAccountSession('','',()=>assert.fail('No credentials to clear')),null);
});
test('account requests carry only the publishable key and the current user token',async()=>{
 const result=await accountRequest('/rest/v1/rpc/loadline_team_action',{token:'user-access',body:{action:'accept',input:{id:'invitation'}},request:async(url,options)=>{
  assert.equal(options.cache,'no-store');assert.equal(options.headers.Authorization,'Bearer user-access');assert.deepEqual(JSON.parse(options.body),{action:'accept',input:{id:'invitation'}});return {ok:true,json:async()=>({workspaceId:'team'})};
 }});assert.equal(result.workspaceId,'team');
});
