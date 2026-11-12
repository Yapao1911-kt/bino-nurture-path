import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { prisma } from './db';
import { requireSession } from './session';

async function ownedChild(id: string) {
  const userId = requireSession(getRequest());
  const child = await prisma.child.findFirst({ where: { id, userId } });
  if (!child) throw new Error('Không tìm thấy hồ sơ thuộc tài khoản của bạn.');
  return child;
}
export const getActivityEntries = createServerFn({method:'POST'})
.validator((data: {childId:string}) => data)
.handler(async ({data}) => {
 await ownedChild(data.childId);
 return prisma.activityEntry.findMany({where:{childId:data.childId}, orderBy:{createdAt:'desc'}, take:500});
});
export const recordActivity = createServerFn({method:'POST'})
.validator((data:{childId:string;title:string;notes:string;minutes:number;words:number}) => {
 if (!data.title?.trim() || data.title.length>200 || !data.notes || data.notes.length>4000 || !Number.isInteger(data.minutes) || data.minutes<1 || data.minutes>240 || !Number.isInteger(data.words) || data.words<0 || data.words>100) throw new Error('Kiểm tra tên, ghi chú, thời lượng (1–240 phút) và số từ (0–100).');
 return data;
})
.handler(async ({data}) => {
 await ownedChild(data.childId);
 return prisma.activityEntry.create({data:{...data,title:data.title.trim()}});
});
export const getRoadmaps = createServerFn({method:'POST'})
.validator((data:{childId:string})=>data)
.handler(async ({data})=>{
 await ownedChild(data.childId);
 return prisma.roadmap.findMany({where:{childId:data.childId},orderBy:{createdAt:'desc'},take:20});
});
export const generateRoadmap = createServerFn({method:'POST'})
.validator((data:{childId:string;behavior:string;goal:string})=>{
 if (!data.behavior?.trim() || !data.goal?.trim() || data.behavior.length>4000 || data.goal.length>2000) throw new Error('Vui lòng nhập biểu hiện và mục tiêu hợp lệ.');
 return data;
})
.handler(async ({data})=>{
 const child=await ownedChild(data.childId);
 const entries=await prisma.activityEntry.findMany({where:{childId:child.id},orderBy:{createdAt:'desc'},take:10});
 const {generateAnswer}=await import('./rag/provider');
 const answer=await generateAnswer({outputJson:true,question:`Hãy tạo lộ trình đúng mục tiêu và giới hạn thời gian sau. Trả về JSON thuần: {"encouragement":string,"weeklyGoal":string,"activities":[{"id":number,"name":string,"description":string,"duration":string}]}. Tối đa 5 hoạt động. Mỗi mô tả có chuẩn bị, bước làm, cách ghi nhận kết quả; dừng khi trẻ khó chịu. Không chẩn đoán hoặc hứa hiệu quả. Biểu hiện: ${data.behavior}\nMục tiêu: ${data.goal}`,context:JSON.stringify({child:{age:child.age,condition:child.condition},observations:entries.map(e=>({title:e.title,notes:e.notes,minutes:e.minutes}))})});
 const parsed=JSON.parse(answer.replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));
 if(typeof parsed.encouragement!=='string'||typeof parsed.weeklyGoal!=='string'||!Array.isArray(parsed.activities)||!parsed.activities.length||parsed.activities.length>5 || parsed.activities.some((a:any)=>typeof a.name!=='string'||typeof a.description!=='string'||typeof a.duration!=='string')) throw new Error('AI chưa trả về lộ trình hợp lệ. Vui lòng thử lại.');
 return parsed as {encouragement:string;weeklyGoal:string;activities:{id:number;name:string;description:string;duration:string}[]};
});
export const saveRoadmap = createServerFn({method:'POST'})
.validator((data:{childId:string;goal:string;content:any})=>{
 if(!data.goal?.trim()||JSON.stringify(data.content).length>30000) throw new Error('Lộ trình không hợp lệ.'); return data;
})
.handler(async ({data})=>{await ownedChild(data.childId);return prisma.roadmap.create({data});});

export const requestAppointment=createServerFn({method:'POST'})
.validator((data:{childId:string;requestedAt:string;topic:string})=>{
 const time=Date.parse(data.requestedAt);
 if(!Number.isFinite(time)||time<Date.now()||time>Date.now()+90*86400000||!data.topic?.trim()||data.topic.length>2000) throw new Error('Chọn thời gian trong 90 ngày tới và nhập nội dung tư vấn.');return data;
}).handler(async({data})=>{await ownedChild(data.childId);return prisma.appointment.create({data:{...data,requestedAt:new Date(data.requestedAt)}});});
export const listAppointments=createServerFn({method:'POST'}).validator((data:{childId:string})=>data)
.handler(async({data})=>{await ownedChild(data.childId);return prisma.appointment.findMany({where:{childId:data.childId},orderBy:{createdAt:'desc'},take:50});});
export const cancelAppointment=createServerFn({method:'POST'}).validator((data:{childId:string;id:string})=>data)
.handler(async({data})=>{await ownedChild(data.childId);return prisma.appointment.updateMany({where:{id:data.id,childId:data.childId,status:'PENDING'},data:{status:'CANCELLED'}});});
