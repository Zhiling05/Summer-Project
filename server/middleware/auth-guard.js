const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    const t = req.cookies?.auth;
    if (!t) return res.status(401).json({ error: 'unauthenticated' });
    try {
        const p = jwt.verify(t, process.env.JWT_SECRET);
        req.user = { id: p.sub, role: p.role || 'guest' };
        next();
    } catch {
        return res.status(401).json({ error: 'unauthenticated' });
    }
};
