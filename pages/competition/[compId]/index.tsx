import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { getIronSession } from 'iron-session';
import { SessionData } from "@/lib/session";
import CompetitionCard from "@/components/CompetitionCard";
import prisma from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

interface CompetitionProps {
    session: SessionData
    competition: {
        id: number
        compId: string
        name: string
        venue: string
        dateRange: string
        rounds: { id: number; event: string; scheduledStart: Date; scheduledEnd: Date; groups: { id: number }}[]
    }
}

// @ts-ignore
export async function getServerSideProps({ req, res, query }) {
    const session = await getIronSession<SessionData>(req, res, {
        password: process.env.SESSION_PASSWORD!,
        cookieName: 'session',
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        }
    })

    const user = await prisma.user.findUnique({
        where: {
            wcaId: session.wcaId!
        }
    })

    const competition = await prisma.competition.findFirst({
        where: {
            compId: query.compId
        },
        select: {
            id: true,
            compId: true,
            name: true,
            venue: true,
            dateRange: true,
            rounds: { select: { id: true, event: true, scheduledStart: true, scheduledEnd: true, groups: { select: { id: true } } } }
        }
    })

    return { props: { session, competition } };
}

export default function Home({ session, competition }: CompetitionProps) {
    return (
        <main
            className={`${inter.className}`}
        >
            <div className='p-6 z-50 bg-white flex fixed w-full items-center'>
                <Link href='/'>
                    <Image src='/compmaster-logo.svg' alt='logo' width={48} height={48}/>
                </Link>
                <div className='w-full text-center'>
                    <h1 className='font-semibold'>{competition.name}</h1>
                </div>
                <Link href='/' className='ml-auto'>
                    <img className='object-cover rounded-full w-10 h-10' src={session.avatar} alt='avatar' />
                </Link>
            </div>
            <div className='flex flex-col w-full h-screen p-6 pt-36 space-y-6'>
                <div className='flex w-full h-min font-semibold'>
                    <Link href={`/competition/${competition.compId}/`} className='p-3 rounded-l-xl bg-gray-400 text-center w-1/3'>Dashboard</Link>
                    <Link href={`/competition/${competition.compId}/groups`} className='p-3 bg-gray-400 text-center w-1/3 bg-opacity-40'>Groups</Link>
                    <Link href={`/competition/${competition.compId}/stations`} className='p-3 rounded-r-xl bg-gray-400 text-center w-1/3 bg-opacity-40'>Stations</Link>
                </div>
                <Link href={`/competition/${competition.compId}/groups`} className='flex w-full p-3 bg-red-500 text-white justify-center items-center space-x-3 hover:font-medium'>
                    <svg width="20px" height="20px" stroke-width="2.04" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M20.0429 21H3.95705C2.41902 21 1.45658 19.3364 2.22324 18.0031L10.2662 4.01533C11.0352 2.67792 12.9648 2.67791 13.7338 4.01532L21.7768 18.0031C22.5434 19.3364 21.581 21 20.0429 21Z" stroke="#fff" stroke-width="2.04" stroke-linecap="round"></path><path d="M12 9V13" stroke="#fff" stroke-width="2.04" stroke-linecap="round"></path><path d="M12 17.01L12.01 16.9989" stroke="#fff" stroke-width="2.04" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    <p>Groups and stations have not been configured</p>
                </Link>
                <div className='flex flex-col'>

                </div>
            </div>
        </main>
    );
}
