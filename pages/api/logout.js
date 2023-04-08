import cookie from 'cookie';

export default async (req, res) => {
  if (req.method === 'POST') {
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(0),
        sameSite: 'strict',
        path: '/',
      })
    );

    res.status(200).json({
      message: 'Successfully logged out',
    });
  } else {
    res.setHeader('Allow', ['POST']);
    // 405 -> method not allowed
    res.status(405).json({
      message: `Method ${req.method} is not allowed`,
    });
  }
};
