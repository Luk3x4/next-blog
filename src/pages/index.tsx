import { GetServerSideProps, NextPage } from "next"
import SingleBlog from '@/components/SingleBlog'
import prisma from '@/lib/db';
import Head from "next/head"
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { instance } from "@/lib/axios";

export const getServerSideProps: GetServerSideProps = async () => {
    const blogs = await prisma.blog.findMany({
        take: 10,
        include: {
            author: {
                select: {
                    name: true,
                    image: true
                }
            }
        }
    });

    return {
        props: {
            blogs
        }
    }
}

const Home: NextPage<any> = ({ blogs }) => {
    const [skip, setSkip] = useState(0);
    const [blogData, setBlogData] = useState(blogs)
    const [noMoreBlogs, setNoMoreBlogs] = useState(false)

    const handleScroll = async (e: any) => {
        const { scrollHeight, scrollTop, clientHeight } = e.target

        if(scrollHeight - scrollTop === clientHeight && !noMoreBlogs){
            const res = await instance.get(`/api/posts?skip=${skip}`)
            res.data.blogs.length === 0 && setNoMoreBlogs(true)
            setBlogData((prev: any) => [...prev, ...res.data.blogs])
            setSkip(prev => prev + 1);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div>
            <Head>
                <title> Home </title>
            </Head>
            <div id="container" className="max-w-5xl min-h-screen mx-auto p-3 space-y-2">
                {blogData.map((item: any) => (
                    <SingleBlog title={item.title} image={item.author.image} author={item.author.name} excerpt={item.body.slice(0, 10)} key={item.id} id={item.id}/>
                ))}
            </div>
        </div>
    )
}

export default Home