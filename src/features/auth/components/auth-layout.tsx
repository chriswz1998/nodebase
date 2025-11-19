import React from "react";
import Link from "next/link";
import Image from "next/image";

const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className='bg-muted flex min-h-svh min-w-svw flex-col justify-center items-center gap-6 p-6 md:p-6'>
            <div className={'flex w-full max-w-sm flex-col gap-6'}>
                <Link href={'/'} className={'flex items-center gap-2 self-center font-medium'}>
                    <Image src={'/logo.svg'} alt={'nodebase'} width={30} height={30} />
                    Nodebase
                </Link>
            </div>
            {children}
        </div>
    )
}

export default AuthLayout;