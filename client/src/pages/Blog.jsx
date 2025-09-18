import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, blog_data, comments_data } from '../assets/assets'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import moment from 'moment'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Blog = () => {
  const { id } = useParams()

  const {axios} = useAppContext()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  const fetchBlogData = async () => {
    try{
      const {data} = await axios.get(`/api/blog/${id}`)
      data.success ? setData(data.blog) : toast.error(data.message)
    } catch (error){
      toast.error(error.message)
    }
  }

  const fetchComments = async () => {
    try{
        const { data } = await axios.post('/api/blog/comments',{blogId : id})
        if (data.success){
          setComments(data.comments)
        } else{
          toast.error(data.message);
        }
    }catch (error) {
      toast.error(error.message);
    }
  }

  const addComment = async (e) => {
    e.preventDefault()
    try{
      const { data } = await axios.post('/api/blog/add-comment',{blog: id, name, content});
      if(data.success){
        toast.success(data.message)
        setName('')
        setContent('')
      } else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
  }
  }

  useEffect(() => {
    fetchBlogData()
    fetchComments()
  }, [id])

  return data ? (
    <div className='relative'>
      {/* Background */}
      <img
        src={assets.gradientBackground}
        alt=""
        className='absolute -top-[50px] -z-[1] opacity-50 w-full'
      />

      <Navbar />

      {/* Blog Header */}
      <div className='text-center mt-20 text-gray-600'>
        <p className='text-primary py-4 font-medium'>
          Published on {moment(data.createdAt).format('MMMM Do YYYY')}
        </p>

        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800 text-center'>
          {data.title}
        </h1>

        <h2 className='my-5 max-w-lg mx-auto text-center truncate'>{data.subTitle}</h2>

        <p className='inline-block py-1 px-4 md:px-6 rounded-full border text-sm border-blue-300 bg-blue-100 font-medium text-blue-600'>
          Michael Brown
        </p>
      </div>

      {/* Blog Image & Description */}
      <div className='mx-5 max-w-5xl md:mx-auto my-10'>
        <img src={data.image} alt="" className='rounded-3xl mb-5' />
        <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{ __html: data.description }}></div>

        {/* Comments Section */}
        <div className='mt-14 max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Comments ({comments.length})</p>
          <div className='flex flex-col gap-4'>
            {comments.map((item, index) => (
              <div key={index} className='relative bg-blue-50 border border-blue-100 max-w-xl p-4 rounded text-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.user_icon} alt="" className='w-6' />
                  <p className='font-medium'>{item.name}</p>
                </div>
                <p className='text-sm max-w-md ml-8'>{item.content}</p>
                <div className='absolute right-4 bottom-3 flex items-center gap-2 text-xs'>
                  {moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment Form */}
        <div className='max-w-3xl mx-auto mt-10'>
          <p className='font-semibold mb-4'>Add your comment</p>
          <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder='Name'
              required
              className='w-full p-2 border border-gray-300 rounded outline-none'
            />
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder='Comment'
              required
              className='w-full p-2 border border-gray-300 rounded outline-none h-48'
            ></textarea>
            <button
              type="submit"
              className='bg-blue-600 text-white rounded p-2 px-8 hover:scale-105 transition-all cursor-pointer'
            >
              Submit
            </button>
          </form>
        </div>

        {/* Share Section */}
        <div className='my-24 max-w-3xl mx-auto'>
          <p className='font-semibold my-4'>Share this article on social media</p>
          <div className='flex gap-4'>
            <img src={assets.facebook_icon} width={50} alt="Facebook" />
            <img src={assets.twitter_icon} width={50} alt="Twitter" />
            <img src={assets.googleplus_icon} width={50} alt="Google+" />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  ) : <Loader/>
  
}

export default Blog
