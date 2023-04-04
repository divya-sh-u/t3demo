
import { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import { useSession } from 'next-auth/react'
import { api , type RouterOutputs } from '~/utils/api'
export function Document() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { data: session } = useSession();
  const {data: images ,refetch :refetchImages} = api.images.getAll.useQuery(
    undefined,
    {
      enabled: session?.user !== undefined,
      onSuccess: (data) => {
        if (data?.length) {
          setSelectedImage(selectedImage || data[0]?.id || null);
        }
      }
    }
  );
  const createImage = api.images.create.useMutation({
    onSuccess: () => {
      // void refetchImages();
    },
  });
  const updateImage = api.images.update.useMutation({
    onSuccess: () => {
      void refetchImages();
    },
  });

  const deleteImage = api.images.delete.useMutation({
    onSuccess: () => {
      void refetchImages();
    },
  });
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    setLoading(true)
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });
    setLoading(false)
    setResult(response.data?.data[0]?.url || '')
  };
  return (
    <>
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
      <button className="btn btn-secondary  mt-4 " onClick={()=>{
        console.log('Image Not Saved')
        createImage.mutate({name:prompt,url:result})
        console.log('Image Saved')
      }}>
        Save Image</button></>
    ) : (<>
      <div className='mt-4 rounded-lg bg-gray-400'></div>
      <button className="btn btn-secondary btn-disabled  mt-4 " onClick={()=>{}}>Save Image</button></>
    )}
  </div>
    {/* Image gallary of User with the edit and delete button*/}
    
      <h2 className="text-3xl font-bold">Your Images</h2>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {images?.map((image) => (
          <div
            key={image.id}
            className={`${
              selectedImage === image.id ? "border-2 border-blue-600" : ""
            }`}
          > 
            <img
              src={image.url}
              alt={image.name}  
              className="rounded-lg"
              onClick={() => setSelectedImage(image.id)}
            />
            <div className="flex justify-between mt-2">
              <button className="btn btn-ghost" onClick={() => {
                updateImage.mutate({id:image.id,name:prompt,url:result})
              }}>Edit</button>
              <button className="btn btn-ghost" onClick={() => {
                deleteImage.mutate({id:image.id})
              }}>Delete</button>
            </div>
            </div>))}
</div>
</div>
</>             )}
        