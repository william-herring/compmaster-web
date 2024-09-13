import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { getIronSession } from 'iron-session';
import { SessionData } from "@/lib/session";
import {NextPage} from "next";
import CompetitionCard from "@/components/CompetitionCard";
import prisma from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

interface MyCompetitionsProps {
    session: SessionData,
    myWcaCompetitions: Array<any>
    myCompetitions: Array<any>
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

    const user = await prisma.user.findUnique({
        where: {
            wcaId: session.wcaId!
        }
    })

    const oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)

    const myWcaCompetitions = await fetch(`${process.env.WCA_URL}/api/v0/competitions?managed_by_me=true&start=${oneWeekAgo.toISOString()}&sort=start_date`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${session.accessToken}`},
    }).then(r => r.json())
    const myCompetitions = await prisma.competition.findMany({
        where: { organisers: { some: { id: session.id } } },
        select: { id: true, compId: true, name: true, venue: true, dateRange: true, organisers: { select: { wcaId: true, name: true, avatar: true, delegate: true } } }
    })

    return { props: { session, myWcaCompetitions, myCompetitions } };
}

export default function Home({ session, myWcaCompetitions, myCompetitions }: MyCompetitionsProps) {
    const addCompetition = async (competition: {
        compId: string;
        name: string;
        venue: string;
        dateRange: string;
    }) => {
        const res = await fetch('../api/competition/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(competition)
        })
    }

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
                    <div className='p-3 rounded-xl text-center font-semibold bg-gray-200'>
                        Added to Compmaster
                    </div>
                    {myCompetitions.map((comp) => <CompetitionCard compId={comp.compId} name={comp.name} venue={comp.venue} dateRange={comp.dateRange} organisers={comp.organisers} key={comp.name} />)}
                    <CompetitionCard compId={'MelbourneSummer2025'} name={'Melbourne Summer 2025'}
                                     venue={'Community Bank Stadium'} dateRange={'Jan 24 - 26'} organisers={
                        [{
                            name: session.name,
                            avatar: session.avatar,
                        }]
                    }/>
                    <CompetitionCard compId={'SampleComp2025'} name={'Sample Competition 2025'} venue={'Mars'}
                                     dateRange={'Apr 12 - 13'} organisers={
                        [{
                            name: session.name,
                            avatar: session.avatar,
                        }]
                    }/>
                </div>
                <div className='fex flex-col space-y-5 w-2/5 pl-12'>
                    <div className='p-3 rounded-xl text-center font-semibold bg-gray-200'>
                    Competitions to add
                    </div>
                    {myWcaCompetitions.map((comp) => <div key={comp.id} className='flex items-center p-3'>
                        <div className='flex flex-col'>
                            <h1 className='font-semibold'>{comp.name}</h1>
                            <h2>{comp.date_range}</h2>
                        </div>
                        <button onClick={() => addCompetition({ compId: comp.id, name: comp.name, venue: comp.venue, dateRange: comp.date_range })} className='flex items-center justify-center p-3 pr-4 bg-blue-500 text-white rounded-xl ml-auto right-0'>
                            <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffff"><path d="M6 12H12M18 12H12M12 12V6M12 12V18" stroke="#ffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            <p>Add</p>
                        </button>
                    </div>)}
                </div>
            </div>
        </main>
    );
}
