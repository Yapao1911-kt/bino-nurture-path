import {createServerFn} from '@tanstack/react-start';
import {getRequest} from '@tanstack/react-start/server';
import {prisma} from './db';
import {requireSession} from './session';
async function requireOperator(){
 const id=requireSession(getRequest());const user=await prisma.user.findUnique({where:{id}});
 if(!process.env.BINO_OPERATOR_EMAIL||!user?.isEmailVerified||user.email!==process.env.BINO_OPERATOR_EMAIL.toLowerCase().trim())throw new Error('Không có quyền vận hành.');
}
export const appointmentQueue=createServerFn({method:'GET'}).handler(async()=>{
 await requireOperator();return prisma.appointment.findMany({where:{status:'PENDING'},include:{child:{select:{name:true,user:{select:{email:true}}}}},orderBy:{createdAt:'asc'},take:100});
});
export const confirmAppointment=createServerFn({method:'POST'}).validator((data:{id:string})=>data).handler(async({data})=>{
 await requireOperator();return prisma.appointment.updateMany({where:{id:data.id,status:'PENDING'},data:{status:'CONFIRMED'}});
});
