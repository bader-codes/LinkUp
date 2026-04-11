import { loginSchema } from '../../validation/login.schema';
import { AuthContext } from '../../Context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Label } from '@heroui/react';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import loginImg from '../../assets/me.webp';
import { FiLoader } from "react-icons/fi";
import { useForm } from 'react-hook-form';

export default function Login() {
  // Import User Token From Use Context
  const { setUserToken } = useContext(AuthContext);

  // State To Login API
  const [isLoginErr, setIsLoginErr] = useState(false);

  // State To Loading API 
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Useing React Hook Form To Mange Input State
  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },

    // resolver connection With React Hook Form
    resolver: zodResolver(loginSchema)
  });

  // Login Api Function
  async function handleLogin(values) {
    try {
      setIsLoading(true);
      const response = await login(values);
      // Set User Token To Local Storage
      localStorage.setItem('userToken', response.data.data.token);
      // Set User Token In Use Context
      setUserToken(response.data.data.token);
      // Navigate User To Home Pgae
      navigate("/");
      // Empty Inputs After Login
      reset();
    }

    catch (err) {
      console.log(err);
      setIsLoginErr(true);
    }

    finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex min-h-screen flex-col sm:flex-row'>
      <div className='order-1 sm:order-2 shadow-2xl w-full sm:w-9/12 my-5 p-4'>
        <div className='flex items-center justify-center mt-4'>
          <h3 className='font-bold text-2xl text-gray-600'>Login</h3>
        </div>

        {/* Login Form */}
        <Form onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col mt-5 items-center justify-center sm:p-2">

          {
            isLoginErr && <div>
              <p className='bg-red-500 text-white w-full mt-2 px-2 py-1 rounded-sm'>invalid Email or Password</p>
            </div>
          }

          <div className='w-full p-2'>
            <Label htmlFor='email' className='block mb-1'>
              Email <span className='text-red-500'>*</span>
            </Label>
            <input {...register('email')} id='email' placeholder='Enter your email'
              className="w-full rounded-sm p-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-0"
            />
            {formState.errors.email && <p className='bg-red-500 text-white w-full mt-2 px-2 py-1 rounded-sm'>{formState.errors.email.message}</p>}
          </div>

          <div className='w-full p-2'>
            <Label htmlFor='password' className='block mb-1'>
              Password <span className='text-red-500'>*</span>
            </Label>
            <input {...register('password')} type='password' id='password' placeholder='Enter You Password'
              className="w-full rounded-sm p-2 border-2 border-gray-300 focus:border-blue-500 focus:outline-0"
            />

            {formState.errors.password && <p className='bg-red-500 text-white w-full mt-2 px-2 py-1 rounded-sm'>{formState.errors.password.message}</p>}
          </div>

          <div className='w-full p-2'>
            <Button type='submit' isDisabled={isLoading}
              className='bg-blue-500 font-semibold p-2 text-white w-full rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400'
            >
              {
                isLoading ? <FiLoader className='animate-spin text-blue-700' /> : "Login"
              }
            </Button>
          </div>

          <div className='w-full'>
            <Button className='bg-white font-semibold text-gray-400 w-full rounded-sm cursor-pointer'>
              Forget Password ?
            </Button>
          </div>
        </Form>
        <div className='w-full'>
          <Button className='bg-white font-semibold text-gray-400 w-full rounded-sm cursor-pointer'>
            New to Linkup ? <span className='text-blue-500'>Join now</span>
          </Button>
        </div>
      </div>

      {/* Desktop Image */}
      <div className='order-2 sm:order-1 shadow-2xl w-full sm:w-9/12 sm:h-auto h-screen hidden sm:block my-5 relative bg-linear-to-t from-blue-300 to-sky-600 rounded-s-2xl'>
        <div className='flex items-center justify-center mt-10 mx-5'>
          <h3 className='text-gray-100 font-bold text-3xl'>
            Welcome to
            <span className='text-amber-300'> Linkup </span>
            Social !
          </h3>
        </div>
        <div className='size-60 absolute border-5 border-blue-500 rounded-full top-1/2 left-1/2 -translate-1/2'>
          <img src={loginImg} alt="PersonalImage" className='rounded-full w-full h-full object-cover' />
        </div>
        <div className='absolute top-50 left-0 lg:left-10'>
          <span className='text-5xl rotate-20 block'>😂</span>
        </div>
        <div className='absolute top-60 right-0 lg:right-10'>
          <span className='text-5xl -rotate-20 block'>❤️</span>
        </div>
        <div className='absolute bottom-25 lg:bottom-20 right-30 lg:right-40'>
          <span className='text-5xl -rotate-25 block'>🙈</span>
        </div>
      </div>
    </div>
  )
};