import React from 'react';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';

const LoadingButton = ({ isLoading, children, ...props }) => {
  return (
    <Button disabled={isLoading} {...props}>
        {isLoading ? <Loader className='animate-spin mr-2' /> : null}
        {children}
    </Button>
  )
}

export default LoadingButton;
