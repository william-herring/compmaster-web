import type { NextApiRequest, NextApiResponse } from 'next'
import { getIronSession } from 'iron-session'
import prisma from "@/lib/prisma";

type SessionData = {
    id: number;
    wcaId: string | null;
    name: string;
    avatar: string;
    isDelegate: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const redirect = req.query.redirect || '/my-competitions'
    const code = req.query.code
    const data = await fetch('https://www.worldcubeassociation.org/oauth/token', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': process.env.WCA_CLIENT_ID,
            'client_secret': process.env.WCA_CLIENT_SECRET,
            'redirect_uri': process.env.BASE_URL + `/api/account-redirect?redirect=${redirect}`,
        })
    }).then((r) => r.json())
    const token = data['access_token']

    const userData = await fetch('https://www.worldcubeassociation.org/api/v0/me', {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    }).then(r => r.json())

    const user = await prisma.user.findUnique({
        where: {
            wcaId: userData['me']['wca_id']
        }
    }) || await prisma.user.create({
        data: {
            wcaId: userData['me']['wca_id'],
            name: userData['me']['name'],
            avatar: userData['me']['avatar']['thumb_url'],
            delegate: userData['me']['delegate_status'] != null,
        }
    })

    const session = await getIronSession<SessionData>(req, res, {
        password: token,
        cookieName: 'user',
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        }
    })
    session.id = user.id
    session.wcaId = user.wcaId
    session.name = user.name!
    session.avatar = user.avatar!
    session.isDelegate = user.delegate
    await session.save()

    return res.redirect(307, redirect as string)
}