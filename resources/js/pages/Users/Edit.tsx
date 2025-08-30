import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users Edit',
        href: '/users',
    },
];

type EditUser = { id: number | string; name: string; email: string };

export default function Edit({user}: { user: EditUser }) {
    const { data, setData, errors, put } = useForm({
        name: user.name || "",
        email: user.email || "",
        password: ""
    });

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('users.update', user.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Edit" />
            <div className="p-4">
                <Link
                    href={route('users.index')}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 hover:text-white text-white font-semibold  px-3 py-1 rounded">
                    Back
                </Link>

                {/* Form */}
                <form onSubmit={submit} className='space-y-6 mt-4 max-w-md mx-auto'>
                    <div className='grid gap-2'>
                        <label className='text-sm leading-none font-medium select-none '>
                            Name:
                        </label>
                        <input
                            id='name'
                            type='text'
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            name='name'
                            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'
                            placeholder='Enter Your Name'
                        />
                        {errors.name && <p className='text-red-400 text-sm mt-1'>{ errors.name }</p> }
                    </div>

                    <div className='grid gap-2'>
                        <label className='text-sm leading-none font-medium select-none '>
                            Email:
                        </label>
                        <input
                            id='email'
                            type='email'
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            name='email'
                            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'
                            placeholder='Enter Your Name'
                        />
                        {errors.email && <p className='text-red-400 text-sm mt-1'>{ errors.email }</p> }
                    </div>

                    <div className='grid gap-2'>
                        <label className='text-sm leading-none font-medium select-none '>
                            Password:
                        </label>
                        <input
                            id='password'
                            type='password'
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            name='password'
                            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'
                            placeholder='Enter Your Name'
                        />
                        {errors.password && <p className='text-red-400 text-sm mt-1'>{ errors.password }</p> }
                    </div>


                    <button type='submit' className='cursor-pointer bg-green-600 hover:bg-green-800 text-white font-medium py-2 px-4' >
                        Submit
                    </button>
                </form>

            </div>

        </AppLayout>
    );
}
