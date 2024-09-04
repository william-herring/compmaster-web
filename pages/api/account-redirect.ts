import type { NextApiRequest, NextApiResponse } from 'next'
import { getIronSession } from 'iron-session'
import { cookies } from "next/headers";

type SessionData = {
    password: string;
    cookieName: string;
    user: {
        id: number;
        wcaId: string;
        name: string;
        avatar: string;
        isDelegate: boolean;
    }
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

    const session = await getIronSession<SessionData>(cookies(), { })
    // res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure`);

    const userData = await fetch('https://www.worldcubeassociation.org/api/v0/me', {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    }).then(r => r.json())

    return res.redirect(307, redirect as string)
}