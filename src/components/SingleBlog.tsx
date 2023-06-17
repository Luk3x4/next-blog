import Image from "next/image";
import Link from "next/link";

interface Props {
    title: string;
    excerpt: string;
    id: number;
    author: string;
    image: string
}

const SingleBlog = ({ title, excerpt, id, author, image }: Props) => {
    return (
        <div className="w-auto rounded-lg bg-gray-50 p-4 space-y-2">
            <div className="flex space-x-1">
                <Image src={image} alt="" style={{ objectFit: "cover", borderRadius: '50%' }} width={45} height={45} />
                <h3>{author}</h3>
            </div>
            <h2 className="text-lg">{title}</h2>
            <p>{excerpt}</p>
            <Link href={`/blog/${id}`} className="px-2 py-1 block w-fit mt-2 bg-blue-500 text-lg duration-500 ease-in-out hover:bg-blue-400 rounded-lg text-white">Details</Link>
        </div>
    )   
}

export default SingleBlog;