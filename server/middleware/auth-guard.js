const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    const token = req.cookies?.auth;
    if (!token) return res.status(401).json({ error: 'unauthenticated' });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.sub, role: payload.role || 'guest' };
        next();
    } catch {
        return res.status(401).json({ error: 'unauthenticated' });
    }
};
