import { API_URL } from '@/config';
import cookie from 'cookie';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { username, email, password } = req.body.user;

    const strapiResponse = await fetch(`${API_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await strapiResponse.json();

    if (strapiResponse.ok) {
      // set cookie on server side, save jwt
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', data.jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development', // we want HTTPS in production
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'strict',
          path: '/',
        })
      );

      res.status(200).json({
        user: data.user,
      });
    } else {
      res.status(data.error.status).json({
        message: data.error.message,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    // 405 -> method not allowed
    res.status(405).json({
      message: `Method ${req.method} is not allowed`,
    });
  }
};
