import { registerSchema } from '../../validation/signup.schema';
import { AuthContext } from '../../Context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Label } from '@heroui/react';
import { signup } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { FiLoader } from "react-icons/fi";
import { useForm } from 'react-hook-form';

export default function Signup() {
    // Import User Token From Use Context
    const { setUserToken } = useContext(AuthContext);

    // State To Signup API
    const [apiError, setApiError] = useState("");

    // State To Loading API 
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Useing React Hook Form To Mange Input State
    const { register, handleSubmit, reset, formState, setValue, watch } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            rePassword: '',
            gender: '',
            month: '',
            year: '',
            day: '',
        },

        resolver: zodResolver(registerSchema)
    });

    // Signup Api Function
    async function handleSignup(values) {
        try {
            setIsLoading(true);
            const response = await signup(values);
            // Set User Token To Local Storage
            localStorage.setItem('userToken', response.data.data.token);
            // Set User Token In Use Context
            setUserToken(response.data.data.token);
            // Navigate User To Home Pgae
            navigate("/");
            // Empty Inputs After Signup
            reset();
        }

        catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong";
            setApiError(message);
        }

        finally {
            // Return Loading To Default Value
            setIsLoading(false);
        }
    }

    return (
        <div className='w-[90%] lg:w-[60%] md:w-[75%] mx-auto'>
            <div className='flex min-h-screen flex-col'>
                <div className='shadow-lg w-full my-2'>
                    <div className='flex items-center justify-center mt-4'>
                        <h3 className='font-bold text-3xl text-gray-600'>
                            <span>Join Now to</span>
                            <span className='text-blue-500'> Linkup</span>
                        </h3>
                    </div>

                    {/* signup Form */}
                    <Form onSubmit={handleSubmit(handleSignup)}
                        className="flex flex-col items-center justify-center p-4 space-y-4">

                        {
                            apiError && <p className='w-full text-red-500 rounded-sm mx-2 p-2'>{apiError}</p>
                        }

                        {/* First & Last Name */}
                        <div className='flex items-center w-full gap-2'>
                            <div className='w-1/2'>
                                <Label htmlFor='fname' className='block mb-1'>
                                    First Name <span className='text-red-500'>*</span>
                                </Label>
                                <input {...register('firstName')} id='fname' placeholder='Enter your first name'
                                    className="w-full rounded-sm p-1.5 border-2 border-gray-300 focus:border-blue-500 focus:outline-0"
                                />
                                {formState.errors.firstName && <p className='text-red-500 w-full mt-2 px-2 py-1 rounded-sm'>{formState.errors.firstName.message}</p>}
                            </div>
                            <div className='w-1/2'>
                                <Label htmlFor='lname' className='block mb-1'>
                                    Last Name <span className='text-red-500'>*</span>
                                </Label>
                                <input {...register('lastName')} id='lname' placeholder='Enter your last name'
                                    className="w-full rounded-sm p-1.5 border-2 border-gray-300 focus:border-blue-500 focus:outline-0"
                                />
                                {formState.errors.lastName && <p className='text-red-500 w-full mt-2 px-2 py-1 rounded-sm'>{formState.errors.lastName.message}</p>}
                            </div>
                        </div>

                        {/* User Name */}
                        <div className='w-full'>
                            <div className='w-full'>
                                <Label htmlFor='user-name' className='block mb-1'>
                                    User Name <span className='text-gray-500'>(optional)</span>
                                </Label>
                                <input {...register('username')} id='user-name' placeholder='Enter User Name'
                                    className="w-full rounded-sm p-1.5 border-2 border-gray-300 focus:border-blue-500 focus:outline-0"
                                />
                                {formState.errors.username && <p className='text-red-500 w-full mt-2 px-2 py-1 rounded-sm'>{formState.errors.username.message}</p>}
                            </div>
                        </div>

                        {/* Email */}
                        <div className='w-full'>
                            <div className='w-full'>
                                <Label htmlFor='email' className='block mb-1'>
                                    Email <span className='text-red-500'>*</span>
                                </Label>
                                <input {...register('email')} id='email' placeholder='Enter Your Email'
                                    className="w-full rounded-sm p-1.5 border-2 border-gray-300 focus:border-blue-500 focus:outline-0"
                                />
                                {formState.errors.email && <p className='text-red-500 w-full mt-2 px-2 py-1 rounded-sm'>{formState.errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Gender*/}
                        <div className='w-full'>
                            <div className="w-full">
                                <label className="font-medium">Gender <span className='text-red-500'>*</span></label>

                                <select
                                    {...register('gender')}
                                    className="w-full border-2 rounded-sm px-3 py-1.5 border-gray-300 bg-white focus:outline-none focus:ring-0"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>

                                {formState.errors.gender && <p className='text-red-500 w-full mt-2 px-2 py-1 rounded-sm'>{formState.errors.gender.message}</p>}

                            </div>
                        </div>

                        {/* Birth Of Date*/}
                        <div className='w-full'>
                            <div className="w-full">

                                <label className="font-medium">
                                    Date of Birth <span className='text-red-500'>*</span>
                                </label>

                                <div className="grid grid-cols-3 gap-3">

                                    {/* Day */}
                                    <div className="flex flex-col">
                                        <select
                                            {...register('day', { required: 'Day is required' })}
                                            className="border rounded-lg px-2 py-2"
                                        >
                                            <option value="">Day</option>
                                            {Array.from({ length: 31 }, (_, i) => (
                                                <option key={i} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>

                                        {formState.errors.day && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formState.errors.day.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Month */}
                                    <div className="flex flex-col">
                                        <select
                                            {...register('month', { required: 'Month is required' })}
                                            className="border rounded-lg px-2 py-2"
                                        >
                                            <option value="">Month</option>
                                            {[
                                                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                                            ].map((m, i) => (
                                                <option key={i} value={i + 1}>{m}</option>
                                            ))}
                                        </select>

                                        {formState.errors.month && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formState.errors.month.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Year */}
                                    <div className="flex flex-col">
                                        <select
                                            {...register('year', { required: 'Year is required' })}
                                            className="border rounded-lg px-2 py-2"
                                        >
                                            <option value="">Year</option>
                                            {Array.from({ length: 100 }, (_, i) => {
                                                const year = new Date().getFullYear() - i;
                                                return <option key={year} value={year}>{year}</option>;
                                            })}
                                        </select>

                                        {formState.errors.year && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {formState.errors.year.message}
                                            </p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className='w-full gap-2'>
                            <div className='w-full'>
                                <Label htmlFor='password' className='block mb-1'>
                                    Password <span className='text-red-500'>*</span>
                                </Label>
                                <input {...register('password')} id='password' type='password' placeholder='Enter User password'
                                    className="w-full rounded-sm p-1.5 border-2 border-gray-300 focus:border-blue-500 focus:outline-0"
                                />
                                {formState.errors.password && <p className='text-red-500 w-full mt-2 px-2 py-1 rounded-sm'>{formState.errors.password.message}</p>}
                            </div>
                        </div>

                        {/* Re Password */}
                        <div className='w-full gap-2'>
                            <div className='w-full'>
                                <Label htmlFor='re-password' className='block mb-1'>
                                    RePassword <span className='text-red-500'>*</span>
                                </Label>
                                <input {...register('rePassword')} id='re-password' placeholder='Enter Re password'
                                    className="w-full rounded-sm p-1.5 border-2 border-gray-300 focus:border-blue-500 focus:outline-0"
                                />
                                {formState.errors.rePassword && <p className='text-red-500 w-full mt-2 px-2 py-1 rounded-sm'>{formState.errors.rePassword.message}</p>}
                            </div>
                        </div>

                        <div className='w-full p-2'>
                            <Button type='submit' isDisabled={isLoading}
                                className='bg-blue-500 font-semibold text-lg p-2 text-white w-full rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400'
                            >
                                {
                                    isLoading ? <FiLoader className='animate-spin text-blue-700' /> : "Signup"
                                }
                            </Button>
                        </div>
                    </Form>

                    <div className='w-full'>
                        <Button className='bg-white font-semibold text-gray-400 w-full rounded-sm cursor-pointer'>
                            Already have one ? <span className='text-blue-500'>Login now</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}