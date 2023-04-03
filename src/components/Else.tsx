import * as React from 'react';

export interface IElseProps {
}

export function Else (props: IElseProps) {
  return (
    <div>
        <div className='h-screen flex flex-col items-center justify-center'>
        <h1 className='text-4xl font-bold'>AI Image Generator</h1>
        <p className='text-xl mt-4'>You need to sign in to use this amazing tool.</p>
    </div>
    </div>
  );
}
