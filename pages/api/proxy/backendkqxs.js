// API Proxy to bypass CORS for backendkqxs-1.onrender.com
export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(200).end();
    }

    const { method, query, body, headers } = req;
    
    // Get the path from query
    let path = query.path || [];
    if (Array.isArray(path)) {
        path = path.join('/');
    }
    
    // Check if path already contains query parameters
    const [apiPath, existingQuery] = path.split('?');
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backendkqxs-1.onrender.com';
    let targetUrl = `${backendUrl}/api/kqxs/${apiPath}`;
    
    try {
        const fetchOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Next.js-Proxy',
            },
        };
        
        // Forward x-user-id header if present
        if (headers['x-user-id']) {
            fetchOptions.headers['x-user-id'] = headers['x-user-id'];
        }
        
        if (body && typeof body === 'object' && Object.keys(body).length > 0) {
            fetchOptions.body = JSON.stringify(body);
        }
        
        // Combine query parameters
        const queryParams = new URLSearchParams();
        
        // Add existing query params from path
        if (existingQuery) {
            existingQuery.split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (key) queryParams.append(key, decodeURIComponent(value || ''));
            });
        }
        
        // Add query parameters from request
        Object.keys(query).forEach(key => {
            if (key !== 'path') {
                queryParams.append(key, query[key]);
            }
        });
        
        const finalUrl = queryParams.toString() ? `${targetUrl}?${queryParams.toString()}` : targetUrl;
        
        console.log('🔍 Proxy request:', { method, finalUrl, apiPath, targetUrl });
        
        const response = await fetch(finalUrl, fetchOptions);
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // Get response text first
        const responseText = await response.text();
        console.log('🔍 Proxy response:', { status: response.status, contentType: response.headers.get('content-type'), textLength: responseText.length });
        
        // Handle non-OK responses
        if (!response.ok) {
            // Try to parse as JSON first
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                // If not JSON, create error object
                errorData = {
                    error: `Backend returned ${response.status}`,
                    message: responseText || 'Unknown error',
                    status: response.status,
                    url: finalUrl
                };
            }
            return res.status(response.status).json(errorData);
        }
        
        // Try to parse as JSON for successful responses
        let data;
        try {
            data = JSON.parse(responseText);
            res.status(response.status).json(data);
        } catch (parseError) {
            // If not JSON but status is OK, return as text
            console.warn('⚠️ Response is not JSON:', responseText.substring(0, 100));
            res.status(response.status).send(responseText);
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ 
            error: 'Proxy request failed', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

