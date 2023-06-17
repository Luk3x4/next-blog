import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/lib/db";
import { User } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    const { id } = req.query

    switch(req.method){
        case 'PATCH':   
            if(!session){
                return res.status(200).json({
                    success: false,
                    message: 'Unauthorized Access'
                })
            }

            const user = (await getUser(session)) as User;


            const alreadyLiked = await checkIfAlreadyLiked(user, id)

            if(alreadyLiked) {
                await prisma.blog.update({
                    where: {
                        id: parseInt(id as string)
                    },
            
                    data: {
                        likes: {
                            disconnect: {
                                id: user?.id
                            }
                        }
                    }
                })

                return res.status(200).json({
                    success: true,
                    message: 'Blog Unliked Successfully'
                })
            }

            await prisma.blog.update({
                where: {
                    id: parseInt(id as string)
                },

                data: {
                    likes: {
                        connect: {
                            id: user?.id
                        }
                    }
                }
            })

            res.status(200).json({
                success: true,
                message: 'Blog Liked Successfully'
            })
        break;
        case 'GET':
            const userData = await getUser(session);
            let userAlreadyLiked: any = false;

            if(userData) {
                userAlreadyLiked = await checkIfAlreadyLiked(userData, id)
            }

            const blog = await prisma.blog.findFirst({
                where: {
                    id: parseInt(id as string)
                },
                include: {
                    likes: true
                }
            })
            
            res.status(200).json({
                liked: !!userAlreadyLiked,
                blog
            })
    }
}

const getUser = async (session: Session | null) => {
    if(!session) return false;

    return await prisma.user.findFirst({
        where: {
            email: session.user?.email
        }
    })
}

const checkIfAlreadyLiked = async (userData: User, id: any) => {
    return await prisma.user.findFirst({
        where: {
            AND: [
                {
                    id: userData?.id
                },
                {
                    likes: {
                        some: {
                            id: parseInt(id as string)
                        }
                    }
                }
            ]
        }
    })
}