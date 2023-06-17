import { instance } from "@/lib/axios";
import prisma from "@/lib/db";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const blog = await prisma.blog.findFirst({
        where: {
            id: parseInt(params!.id! as string)
        },
        include: {
            author: {
                select: {
                    name: true,
                    image: true
                }
            }
        }
    })
    
    return {
        props: {
            blog
        }
    }
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

const BlogInner: NextPage<any> = ({ blog }) => {
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(0)
    const { data: session } = useSession();
    const { query } = useRouter()

    const likePost = async () => {
        if(!session) return;
        await instance.patch(`/api/posts/like/${query.id}`)
        setLiked(prev => !prev)
        setLikes(prev => liked? prev - 1: prev + 1)
    }

    useEffect(() => {
        instance.get(`/api/posts/like/${query.id}`)
            .then(res => {
                res.data.liked && setLiked(true)
                setLikes(res.data.blog.likes.length)
                console.log(res);
            })
    }, [])

    return (
        <div className="p-10 flex flex-col space-y-4 w-[60vw] mx-auto">
            <Head>
                <title>Blog {query.id}</title>
            </Head>
            <div className="flex space-x-2">
                <Image src={blog.author.image} alt="" style={{ objectFit: "cover", borderRadius: '50%' }} width={50} height={50} />
                <h1 className="text-xl">{blog.author.name}</h1>
            </div>
            <h1 className="text-2xl">{blog.title}</h1>
            <h3 className="mt-6">{blog.body}</h3>
            <div>
                {!session && <h4 className="text-yellow-400"> Authorize First </h4>}
                <div className="flex gap-2 items-center">
                    <div onClick={likePost} className="cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            viewBox="0 0 24 24">
                                <path fill={liked? 'red': 'black'} d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3Z"/>
                        </svg>
                    </div>
                    <h3 className="text-lg">{likes} Likes</h3>
                </div>
            </div>
        </div>
    )
}

export default BlogInner