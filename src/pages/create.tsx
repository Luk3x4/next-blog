import { instance } from "@/lib/axios";
import axios from 'axios';
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { z } from 'zod'

const Create: NextPage = () => {
    const [blogData, setBlogData] = useState({title: '', body: ''});
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('') 
    const router = useRouter();
    const { data: session } = useSession()

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setBlogData(prev => ({...prev, [name]: value}))
    }

    useEffect(() => {
        !session && router.push('/')
    }, [])

    const submit = async () => {
        const schema = z.object({
            title: z.string().nonempty(),
            body: z.string().nonempty()
        })

        setSuccess('')
        setError('')

        const isValid = schema.safeParse(blogData);
        if(!isValid.success) return setError('Please Fill All Fields');

        const res = await instance.post('/api/posts', blogData)
        console.log(res)
        res.data.success && setSuccess(res.data.message) 
    }

    return (
        <div>
            <Head>
                <title>Create Blog</title>
            </Head>
            <div className="p-10 flex flex-col items-center space-y-2 w-fit mx-auto">
                {error && <div className="bg-red-500 text-white rounded w-full border-0 px-2 py-1">
                    {error}
                </div>}
                {success && <div className="bg-green-500 text-white rounded w-full border-0 px-2 py-1">
                    {success}
                </div>}
                <input placeholder="Title..." className="px-1 max-[900px]:w-[80vw] rounded border border-gray-900 w-[40vw] h-8 outline-none" type="text" value={blogData.title} onChange={handleChange} name="title" />
                <textarea placeholder="Body..." className="px-1 max-[900px]:w-[80vw] rounded border border-gray-900 w-[40vw] outline-none" value={blogData.body} onChange={handleChange} name="body" />
                <button onClick={submit} className="px-2 py-1 bg-blue-500 text-lg duration-500 ease-in-out hover:bg-blue-400 rounded-lg text-white self-start"> Submit </button>
            </div>
        </div>
    )
}

export default Create;