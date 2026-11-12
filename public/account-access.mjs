export const authUrl='https://utpmvqdmwelnopcdyfpd.supabase.co';
export const publishableKey='sb_publishable_25JTKJORzIPboxqx19c6Ew_mtUnjpco';
export const returnUrl='https://loadlinehq.com/auth-confirmed.html';
export async function accountRequest(path,{token,method='POST',body,request=fetch}={}){
 const response=await request(authUrl+path,{method,cache:'no-store',headers:{apikey:publishableKey,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const result=await response.json().catch(()=>null);
 if(!response.ok)throw new Error(result?.msg||result?.error_description||result?.error||result?.message||'Could not complete this request. Try again.');
 return result;
}
export async function consumeAccountSession(search,hash,clearUrl,request=fetch){
 const query=new URLSearchParams(search),fragment=new URLSearchParams(hash.replace(/^#/,''));
 const access=fragment.get('access_token'),refresh=fragment.get('refresh_token');
 const authResult=access||refresh||query.has('code')||['error','error_description'].some(key=>query.has(key)||fragment.has(key));
 if(authResult)clearUrl();
 if(['error','error_description'].some(key=>query.has(key)||fragment.has(key)))throw new Error('This sign-in link expired or was declined. Request a fresh email below.');
 if(query.has('code'))throw new Error('Open Loadline and request an email code to finish signing in.');
 if(!access&&!refresh)return null;
 if(!access||!refresh)throw new Error('The sign-in link is incomplete. Request a fresh email.');
 const user=await accountRequest('/auth/v1/user',{method:'GET',token:access,request});
 if(!user?.email_confirmed_at||!user?.email)throw new Error('Verify your email before continuing.');
 return {access_token:access,refresh_token:refresh,user};
}
