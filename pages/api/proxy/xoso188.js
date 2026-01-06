// API Proxy to bypass CORS for xoso188.net API
export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(200).end();
    }

    const { method, query } = req;
    
    // Only support GET method
    if (method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get parameters
    const { gameCode = 'miba', limitNum = 10, date } = query;
    
    // Build API URL
    const apiUrl = `https://xoso188.net/api/front/open/lottery/history/list/game?limitNum=${limitNum}&gameCode=${gameCode}`;
    
    try {
        console.log('🔍 xoso188.net API request:', { gameCode, limitNum, date, apiUrl });
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Next.js-Proxy',
                'Accept': 'application/json',
            },
        });
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        const responseText = await response.text();
        console.log('🔍 xoso188.net API response:', { 
            status: response.status, 
            contentType: response.headers.get('content-type'),
            textLength: responseText.length 
        });
        
        // Handle non-OK responses
        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = {
                    success: false,
                    error: `Backend returned ${response.status}`,
                    message: responseText || 'Unknown error',
                    status: response.status,
                    url: apiUrl
                };
            }
            return res.status(response.status).json(errorData);
        }
        
        // Parse JSON response
        let data;
        try {
            data = JSON.parse(responseText);
            res.status(response.status).json(data);
        } catch (parseError) {
            console.warn('⚠️ Response is not JSON:', responseText.substring(0, 100));
            res.status(response.status).send(responseText);
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ 
            success: false,
            error: 'Proxy request failed', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}


