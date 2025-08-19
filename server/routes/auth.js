// routes/auth.js（新建，挂在 /api 之下）
const router = require('express').Router();
// const jwt = require('jsonwebtoken');
// const { randomUUID } = require('crypto');
//
// router.post('/guest', (req,res) => {
//     const gid = req.cookies.gid || randomUUID();
//     const token = jwt.sign({ sub: gid, role: 'guest' }, process.env.JWT_SECRET, { expiresIn: '180d' });
//     res
//         .cookie('gid', gid, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 180*24*3600*1000 })
//         .cookie('auth', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 180*24*3600*1000 })
//         .json({ ok: true, id: gid });
// });
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');

router.post('/guest', (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';
    const gid = req.cookies?.gid || randomUUID();
    const token = jwt.sign({ sub: gid, role: 'guest' }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res
        .cookie('gid',  gid,   { httpOnly:true, sameSite: isProd ? 'none' : 'lax', secure: isProd, maxAge:180*24*3600*1000 })
        .cookie('auth', token, { httpOnly:true, sameSite: isProd ? 'none' : 'lax', secure: isProd, maxAge: 30*24*3600*1000 })
        .json({ ok: true, id: gid });
});


module.exports = router;
