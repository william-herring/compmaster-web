import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { getIronSession } from 'iron-session';
import { SessionData } from "@/lib/session";
import {NextPage} from "next";
import CompetitionCard from "@/components/CompetitionCard";

const inter = Inter({ subsets: ["latin"] });

interface MyCompetitionsProps {
    session: SessionData
}

// @ts-ignore
export async function getServerSideProps({ req, res }) {
    const session = await getIronSession<SessionData>(req, res, {
        password: process.env.SESSION_PASSWORD!,
        cookieName: 'session',
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        }
    })

    const userData = await fetch(`${process.env.WCA_URL}/api/v0/me`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${session.accessToken}`},
    }).then(r => r.json())

    console.log(userData)

    return { props: { session } };
}

export default function Home({ session }: MyCompetitionsProps) {
    return (
        <main
            className={`${inter.className}`}
        >
            <div className='p-6 z-50 bg-white flex fixed w-full items-center'>
                <Link href='/'>
                    <Image src='/compmaster-logo.svg' alt='logo' width={48} height={48}/>
                </Link>
                <div className='w-full text-center'>
                    <h1 className='font-semibold'>My Competitions</h1>
                </div>
                <Link href='/' className='ml-auto'>
                    <img className='object-cover rounded-full w-10 h-10' src={session.avatar} alt='avatar' />
                </Link>
            </div>
            <div className='flex w-full h-screen p-6 pt-36'>
                <div className='flex flex-col space-y-5 w-3/5'>
                    <div className='p-3 rounded-xl text-center font-semibold bg-gray-300'>
                        Added to Compmaster
                    </div>
                    <CompetitionCard compId={'MelbourneSummer2025'} name={'Melbourne Summer 2025'}
                                     venue={'Community Bank Stadium'} startDate={new Date('2025-01-24')}
                                     endDate={new Date('2025-01-26')} organisers={
                        [{
                            name: session.name,
                            avatar: session.avatar,
                        }]
                    }/>
                    <CompetitionCard compId={'SampleComp2025'} name={'Sample Competition 2025'} venue={'Mars'}
                                     startDate={new Date('2025-04-12')} endDate={new Date('2025-04-13')} organisers={
                        [{
                            name: session.name,
                            avatar: session.avatar,
                        }]
                    }/>
                </div>
                <div className='fex flex-col w-2/5 pl-12'>
                    <div className='p-3 rounded-xl text-center font-semibold bg-gray-300'>
                    Competitions to add
                    </div>
                </div>
            </div>
        </main>
    );
}
