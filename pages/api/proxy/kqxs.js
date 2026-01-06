// API Proxy to bypass CORS for backendkqxs-1.onrender.com
export default async function handler(req, res) {
    const { method, query, body } = req;
    
    // Get the path from query
    const path = query.path || '';
    const apiPath = Array.isArray(path) ? path.join('/') : path;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backendkqxs-1.onrender.com';
    const targetUrl = `${backendUrl}/api/kqxs/${apiPath}`;
    
    try {
        const response = await fetch(targetUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Next.js-Proxy',
            },
            ...(body && { body: JSON.stringify(body) }),
        });
        
        const data = await response.json();
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Proxy request failed', message: error.message });
    }
}

