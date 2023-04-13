import { API_URL } from '@/config';
import cookie from 'cookie';

export default async (req, res) => {
  if (req.method === 'GET') {
    if (!req.headers.cookie) {
      // 403 Forbidden
      res.status(403).json({ message: 'Not Authorized' });
      return;
    }

    const { token } = cookie.parse(req.headers.cookie);

    const strapiResponse = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await strapiResponse.json();
    if (strapiResponse.ok) {
      res.status(200).json({ user });
    } else {
      res.status(403).json({ message: 'User forbidden' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    // 405 -> method not allowed
    res.status(405).json({
      message: `Method ${req.method} is not allowed`,
    });
  }
};
