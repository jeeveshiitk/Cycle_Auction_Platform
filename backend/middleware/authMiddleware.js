const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // 1. Check if the user sent a token in the headers
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // 2. The token usually comes as "Bearer <token_string>". We remove the "Bearer " part.
        const actualToken = token.replace('Bearer ', '');

        // 3. Verify the token using our secret key
        const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
        
        // 4. Attach the user's ID to the request so we know who is posting the cycle
        req.user = verified; 
        
        // 5. Let them pass to the next step!
        next(); 
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = verifyToken;