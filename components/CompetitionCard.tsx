import Link from "next/link";

interface CompetitionCardProps {
    compId: string;
    name: string;
    venue: string;
    dateRange: string;
    organisers: { name: string; avatar: string; }[]
}

export default function CompetitionCard(props: CompetitionCardProps) {
    return (
        <div className='flex p-6 h-min'>
            <div className='flex flex-col'>
                <div className='flex flex-col space-y-3'>
                    <h1 className='font-semibold'>{props.name}</h1>
                    <div className='flex space-x-2'>
                        <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg" color="#000000">
                            <path
                                d="M20 10C20 14.4183 12 22 12 22C12 22 4 14.4183 4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10Z"
                                stroke="#000000" stroke-width="1.5"></path>
                            <path
                                d="M12 11C12.5523 11 13 10.5523 13 10C13 9.44772 12.5523 9 12 9C11.4477 9 11 9.44772 11 10C11 10.5523 11.4477 11 12 11Z"
                                fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </svg>
                        <h2>{props.venue}</h2>
                    </div>
                    <div className='flex space-x-2'>
                        <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg" color="#000000">
                            <path
                                d="M15 4V2M15 4V6M15 4H10.5M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10H3Z"
                                stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                            <path d="M3 10V6C3 4.89543 3.89543 4 5 4H7" stroke="#000000" stroke-width="1.5"
                                  stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M7 2V6" stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                  stroke-linejoin="round"></path>
                            <path d="M21 10V6C21 4.89543 20.1046 4 19 4H18.5" stroke="#000000"
                                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <h2>{props.dateRange}</h2>
                    </div>
                </div>
                <div className='flex flex-col space-y-3'>
                    <div className='flex space-x-2 mt-8'>
                        <div className='flex space-x-1'>
                            {props.organisers.map(organiser => {
                                return <img className='object-cover rounded-full h-6 w-6' key={organiser.name} src={organiser.avatar}  alt={`${organiser.name}'s avatar`} />
                            })}
                        </div>
                        <p className='text-gray-500'>{props.organisers.length} {props.organisers.length == 1? 'person has' : 'people have'} access</p>
                    </div>
                </div>
            </div>
            <div className='ml-auto flex flex-col space-y-3'>
                <Link href={`/competition/${props.compId}/`}
                      className='p-3 bg-blue-500 text-white text-center rounded-xl'>
                    Manage
                </Link>
                <Link href={`/competition/${props.compId}/start`}
                      className='p-3 bg-blue-500 text-white text-center rounded-xl'>
                    Start competition
                </Link>
            </div>
        </div>
    )
}