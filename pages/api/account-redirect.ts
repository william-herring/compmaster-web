import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const redirect = req.query.redirect || '/my-competitions'
    const code = req.query.code
    console.log(code)
    const data = await fetch('https://www.worldcubeassociation.org/oauth/token', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': process.env.WCA_CLIENT_ID,
            'client_secret': process.env.WCA_CLIENT_SECRET,
            'redirect_uri': process.env.BASE_URL! + redirect,
        })
    }).then((r) => r.json())
    console.log(data)
    const token = data['access_token']

    const userData = await fetch('https://www.worldcubeassociation.org/api/v0/me', {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    }).then(r => r.json())

    console.log(userData)

    return res.redirect(307, redirect as string)
}