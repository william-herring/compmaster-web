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
        rounds: { id: number; event: string; title: string; scheduledStart: Date; scheduledEnd: Date; groups: { id: number, groupNumber: number }[]}[]
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

    const rawCompetition = await prisma.competition.findFirst({
        where: {
            compId: query.compId
        },
        select: {
            id: true,
            compId: true,
            name: true,
            venue: true,
            dateRange: true,
            rounds: { select: { id: true, event: true, title: true, scheduledStart: true, scheduledEnd: true, groups: { select: { id: true, groupNumber: true } } } }
        }
    })

    const competition = JSON.parse(JSON.stringify(rawCompetition))
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
            <div className='flex flex-col w-full h-screen p-6 pt-32 space-y-6'>
                <div className='flex w-full h-min font-semibold'>
                    <Link href={`/competition/${competition.compId}/`} className='p-3 rounded-l-xl bg-gray-400 text-center w-1/3'>Dashboard</Link>
                    <Link href={`/competition/${competition.compId}/groups`} className='p-3 bg-gray-400 text-center w-1/3 bg-opacity-40'>Groups</Link>
                    <Link href={`/competition/${competition.compId}/stations`} className='p-3 rounded-r-xl bg-gray-400 text-center w-1/3 bg-opacity-40'>Stations</Link>
                </div>
                {competition.rounds == null?
                    <Link href={`/competition/${competition.compId}/groups`} className='flex w-full p-3 bg-red-500 text-white justify-center items-center space-x-3 hover:font-medium'>
                        <svg width="20px" height="20px" stroke-width="2.04" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M20.0429 21H3.95705C2.41902 21 1.45658 19.3364 2.22324 18.0031L10.2662 4.01533C11.0352 2.67792 12.9648 2.67791 13.7338 4.01532L21.7768 18.0031C22.5434 19.3364 21.581 21 20.0429 21Z" stroke="#fff" stroke-width="2.04" stroke-linecap="round"></path><path d="M12 9V13" stroke="#fff" stroke-width="2.04" stroke-linecap="round"></path><path d="M12 17.01L12.01 16.9989" stroke="#fff" stroke-width="2.04" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        <p>Groups and stations have not been configured</p>
                    </Link> : null
                }
                <div className='flex w-full'>
                    <div className='flex flex-col space-y-10 w-1/3'>
                        {competition.rounds.map(round => {
                            const roundStart = new Date(round.scheduledStart)
                            const roundEnd = new Date(round.scheduledEnd)
                            return <div key={round.id} className='flex-col'>
                                <h1 className='font-semibold'>{round.title}</h1>
                                <p>{roundStart.toLocaleDateString()}, {roundStart.toLocaleTimeString().slice(0, -3)} - {roundEnd.toLocaleTimeString().slice(0, -3)}</p>
                                <div className='ml-4 space-y-2 mt-2'>
                                    {round.groups.map(group => <div key={group.id}
                                                                    className='flex items-center space-x-3'>
                                        <a href=''>Group {group.groupNumber}</a>
                                        <button onClick={() => {
                                        }}
                                                className='flex items-center justify-center py-1 px-4 rounded-xl text-white bg-blue-500'>Start
                                        </button>
                                    </div>)}
                                </div>
                            </div>
                        })}
                    </div>
                    <div className='w-2/3'>
                        <table className='w-full text-left'>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Station</th>
                                <th>Name</th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>4</th>
                                <th>5</th>
                                <th>Average</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>1</td>
                                <td><a className='underline text-blue-500' href='/station/[stationId]'>1</a></td>
                                <td><a className='underline text-blue-500' href='/competitor/[competitorId]'>Feliks Zemdegs</a></td>
                                <td>7.09</td>
                                <td>6.15</td>
                                <td>6.90</td>
                                <td>DNF</td>
                                <td>5.37</td>
                                <td>6.71</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
