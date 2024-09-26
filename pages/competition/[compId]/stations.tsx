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
                    <Link href={`/competition/${competition.compId}/`} className='p-3 rounded-l-xl bg-gray-400 text-center w-1/3 bg-opacity-40'>Dashboard</Link>
                    <Link href={`/competition/${competition.compId}/groups`} className='p-3 bg-gray-400 text-center w-1/3 bg-opacity-40'>Groups</Link>
                    <Link href={`/competition/${competition.compId}/stations`} className='p-3 rounded-r-xl bg-gray-400 text-center w-1/3'>Stations</Link>
                </div>
                <div className='flex flex-col'>

                </div>
            </div>
        </main>
    );
}
