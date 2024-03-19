import { rateLimit } from 'express-rate-limit'

// Rate limit middleware
const rateLimitMiddleware = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: "You have exceeded your 10 requests per minute limit.",
    headers: true,
});

export default rateLimitMiddleware;