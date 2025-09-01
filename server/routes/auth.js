const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');

/* POST /logout - Clear authentication cookies */
router.post('/logout', (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';
    res
        .clearCookie('auth', { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd })
        .json({ ok: true });
});

/* GET /whoami - Get current user identity for debugging */
router.get('/whoami', (req, res) => {
    try {
        const token = req.cookies?.auth;
        const p = token ? jwt.verify(token, process.env.JWT_SECRET) : null;
        res.json({ id: req.cookies?.gid || null, role: p?.role || 'guest' });
    } catch {
        res.json({ id: req.cookies?.gid || null, role: 'guest' });
    }
});

/* POST /guest - Create guest user session */
router.post('/guest', (req, res) => {
    const force = req.query.force === 'true';
    const isProd = process.env.NODE_ENV === 'production';

    /* Don't downgrade existing valid auth tokens unless forced */
    const cur = req.cookies?.auth;
    if (cur && !force) {
        try {
            const p = jwt.verify(cur, process.env.JWT_SECRET);
            if (p && p.role) {
                return res.json({ ok: true, id: req.cookies?.gid, role: p.role });
            }
        } catch {
            /* Token invalid, proceed with re-signing */
        }
    }

    const gid = req.cookies?.gid || randomUUID();
    const token = jwt.sign({ sub: gid, role: 'guest' }, process.env.JWT_SECRET, { expiresIn: '30d' });

    /* Mobile-friendly cookie settings */
    res
        .cookie('gid', gid, { 
            httpOnly: true, 
            sameSite: 'none',
            secure: true,
            maxAge: 180*24*3600*1000 
        })
        .cookie('auth', token, { 
            httpOnly: true, 
            sameSite: 'none',
            secure: true,
            maxAge: 30*24*3600*1000 
        })
        .json({ ok: true, id: gid });
});

/* POST /admin/login - Administrator login */
router.post('/admin/login', (req, res) => {
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ error: 'password required' });
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'invalid password' });

    const isProd = process.env.NODE_ENV === 'production';
    const gid = req.cookies?.gid || randomUUID();
    const token = jwt.sign({ sub: gid, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res
        .cookie('gid', gid, { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd, maxAge: 180*24*3600*1000 })
        .cookie('auth', token, { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd, maxAge: 30*24*3600*1000 })
        .json({ ok: true, role: 'admin' });
});

module.exports = router;