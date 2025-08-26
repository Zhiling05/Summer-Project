const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');

// 退出登录：清掉 auth/gid
router.post('/logout', (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';
    res
        .clearCookie('auth', { 
            httpOnly: true, 
            sameSite: 'none',  // 强制 none
            secure: true,      // 强制 true
            domain: undefined  // 不设置域名限制
        })
        .clearCookie('gid', { 
            httpOnly: true, 
            sameSite: 'none', 
            secure: true,
            domain: undefined
        })
        .json({ ok: true });
});

// 查看当前身份（可选，便于调试）
router.get('/whoami', (req, res) => {
    try {
        const token = req.cookies?.auth;
        const p = token ? jwt.verify(token, process.env.JWT_SECRET) : null;
        res.json({ 
            id: req.cookies?.gid || null, 
            role: p?.role || 'guest',
            hasToken: !!token,
            cookies: Object.keys(req.cookies || {})
        });
    } catch (error) {
        res.json({ 
            id: req.cookies?.gid || null, 
            role: 'guest',
            hasToken: false,
            error: error.message
        });
    }
});

router.post('/guest', (req, res) => {
    const force = req.query.force === 'true';
    const isProd = process.env.NODE_ENV === 'production';

    // 在已有有效 auth（尤其是 admin）时，不要降级覆盖
    const cur = req.cookies?.auth;
    if (cur && !force) {
        try {
            const p = jwt.verify(cur, process.env.JWT_SECRET);
            if (p && p.role) {
                return res.json({ ok: true, id: req.cookies?.gid, role: p.role });
            }
        } catch {/* token 失效则走重签 */}
    }

    const gid = req.cookies?.gid || randomUUID();
    const token = jwt.sign({ sub: gid, role: 'guest' }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // 修复移动端和代理环境下的Cookie问题
    const cookieOptions = {
        httpOnly: true,
        sameSite: 'none',    // 强制 'none' 支持跨站请求
        secure: true,        // 强制 HTTPS
        domain: undefined,   // 不限制域名
        path: '/'           // 明确设置路径
    };

    res
        .cookie('gid', gid, { 
            ...cookieOptions,
            maxAge: 180*24*3600*1000  // 180天
        })
        .cookie('auth', token, { 
            ...cookieOptions,
            maxAge: 30*24*3600*1000   // 30天
        })
        .json({ ok: true, id: gid, role: 'guest' });
});

// 管理员登录
router.post('/admin/login', (req, res) => {
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ error: 'password required' });
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'invalid password' });

    const gid = req.cookies?.gid || randomUUID();
    const token = jwt.sign({ sub: gid, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '30d' });

    const cookieOptions = {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        domain: undefined,
        path: '/'
    };

    res
        .cookie('gid', gid, { 
            ...cookieOptions,
            maxAge: 180*24*3600*1000
        })
        .cookie('auth', token, { 
            ...cookieOptions,
            maxAge: 30*24*3600*1000
        })
        .json({ ok: true, role: 'admin' });
});

module.exports = router;