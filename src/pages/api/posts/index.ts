import prisma from '@/lib/db'
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method){
        case 'POST':

            const { title, body } = req.body
            const session = await getServerSession(req, res, authOptions)
            if(!session){
                return res.status(400).json({
                    success: false,
                    message: 'Unauthorized Access'
                })
            }

            const user = await prisma.user.findFirst({
                where: {
                    email: session.user?.email
                }
            })

            await prisma.blog.create({
                data: {
                    title,
                    body,
                    author: {
                        connect: {
                            id: user?.id
                        }
                    }
                }
            })

            res.status(200).json({
                success: true,
                message: 'Blog Successfully Added To Database'
            })
            break;

        case 'GET':
            const { skip } = req.query
            const blogs = await prisma.blog.findMany({
                skip: parseInt(skip as string) * 10,
                take: 10
            })

            res.status(200).json({
                blogs
            })
    }

}