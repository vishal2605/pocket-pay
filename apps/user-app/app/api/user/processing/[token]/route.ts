import {prisma} from "@repo/db"


export const GET= async (request : Request,{params}:{params:{token:string}}) => {
    const {token} = params
    try{
        const transaction = await prisma.onRampTransaction.findUnique({
            where:{token:token}
        });
        if(!transaction){
            return Response.json({
                msg:'This is an invalid token'
            })
        }
        return Response.json({
            token:token,
            userId:transaction.userId,
            amount: transaction.amount,
            bank : transaction.provider,
            status: transaction.status
        });
    }
    catch(error){
        return Response.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
          );
    }
}