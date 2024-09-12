import type { NextApiRequest, NextApiResponse } from 'next'
import { getIronSession } from 'iron-session'
import prisma from "@/lib/prisma";
import { SessionData } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Method Not Allowed' })
        return
    }

    const data: {
        compId: string
        name: string
        venue: string
        dateRange: string
    } = await req.body

    const session = await getIronSession<SessionData>(req, res, {
        password: process.env.SESSION_PASSWORD!,
        cookieName: 'session',
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        }
    })

    const user = await prisma.user.findUnique({
        where: {
            id: session.id
        }
    })

    if (!user || !user.delegate) {
        res.status(401).send({ message: 'Unauthorized' })
        return
    }

     const competition = await prisma.competition.create({
         data: {
             compId: data.compId,
             name: data.name,
             venue: data.venue,
             dateRange: data.dateRange,
             organisers: { connect: { id: session.id } }
         }
    })

    res.json(competition)
}