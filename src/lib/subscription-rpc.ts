import {createServerFn} from '@tanstack/react-start';
import {getRequest} from '@tanstack/react-start/server';
import {requireSession} from './session';
import {prisma} from './db';
export function hasPremium(user:{subscription:string;trialStartedAt:Date|null}|null,now=Date.now()){
 return !!user&&(user.subscription==='PREMIUM'||!!user.trialStartedAt&&user.trialStartedAt.getTime()<=now&&user.trialStartedAt.getTime()+14*86400000>now);
}
export const subscriptionStatus=createServerFn({method:'GET'}).handler(async()=>{
 const id=requireSession(getRequest()); const user=await prisma.user.findUnique({where:{id}});
 return {premium:hasPremium(user),trialStartedAt:user?.trialStartedAt?.toISOString()||null,trialEndsAt:user?.trialStartedAt?new Date(user.trialStartedAt.getTime()+14*86400000).toISOString():null};
});
export const startTrial=createServerFn({method:'POST'}).handler(async()=>{
 const id=requireSession(getRequest());
 await prisma.user.updateMany({where:{id,trialStartedAt:null,subscription:'FREE'},data:{trialStartedAt:new Date()}});
 const user=await prisma.user.findUnique({where:{id}});
 return {premium:hasPremium(user),trialStartedAt:user?.trialStartedAt?.toISOString()||null,trialEndsAt:user?.trialStartedAt?new Date(user.trialStartedAt.getTime()+14*86400000).toISOString():null};
});
