
import { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'
// import '~/styles/globals.css'
import { env } from "../env.mjs"
export function Document() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    // organization: "org-gITmPJLneTVPRUiRwhZQOfq8",
  })
  // console.log('hello world')
  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    setLoading(true)
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });
    // console.log('hello world')
    setLoading(false)
    setResult(response.data?.data[0]?.url || '')
    // console.log(result)
    // console.log(response)
    // console.log('hello world')
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
  <h1 className='text-4xl font-bold'>AI Image Generator</h1>
  {loading ? (
    <div className='flex items-center justify-center'>
      {/* <h2 className='text-2xl mr-4'>Image generation in progress ... Please wait!</h2> */}
      <div className=" flex justify-center items-center">
  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"> </div>
</div>
    </div>
  ) : (<></>)}
  <div className="card shadow-lg p-6 w-96 ">
    <textarea
      className="input w-full mb-4 border-gray-400"
      placeholder="Enter a prompt"
      onChange={(e) => setPrompt(e.target.value)}
      rows={5}
      cols={50}
    />
    <button className="btn btn-ghost border-2 border-gray-600" onClick={generateImage}>Generate Image</button>
    {result.length > 0 ? (<>
      <img src={result} alt="Generated Image" className='mt-4 rounded-lg' />
      <button className="btn btn-secondary  mt-4 " onClick={()=>{}}>Save Image</button></>
    ) : (<>
      <div className='mt-4 rounded-lg bg-gray-400'></div>
      <button className="btn btn-secondary btn-disabled  mt-4 " onClick={()=>{}}>Save Image</button></>
    )}
    
    
  </div>
</div>
  )
}