import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL3 || 'https://back-end-diendan.onrender.com';
const isClient = typeof window !== 'undefined';
const cache = new Map();

// Helper function to get API URL (use proxy on client-side to avoid CORS)
const getApiUrl = (path) => {
    if (isClient) {
        // Use proxy API when running on client-side
        return `/api/proxy/diendan?path=${encodeURIComponent(path)}`;
    }
    // Use direct URL when running on server-side
    return `${API_BASE_URL}/api/${path}`;
};

const getCachedPosts = (key) => {
    const cached = cache.get(key);
    if (cached) {
        const { data, timestamp } = cached;
        const age = Date.now() - timestamp;
        if (age < 15 * 60 * 1000) {
            return data;
        }
    }
    return null;
};

const setCachedPosts = (key, data) => {
    const seenIds = new Set();
    const uniquePosts = data.posts
        ? { ...data, posts: data.posts.filter(post => !seenIds.has(post._id) && seenIds.add(post._id)) }
        : data;
    cache.set(key, { data: uniquePosts, timestamp: Date.now() });
};

const clearCombinedCache = () => {
    for (const key of cache.keys()) {
        if (key.startsWith('combined:')) {
            cache.delete(key);
        }
    }
};

export const uploadToDrive = async (formData) => {
    const session = await getSession();
    const url = getApiUrl('posts/upload-to-cloudinary');
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
                'Cache-Control': 'no-cache',
            },
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error:', errorText);
            throw new Error(`Có lỗi khi tải ảnh lên: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('uploadToCloudinary error:', error);
        throw error;
    }
};

export const getPosts = async (context = null, page = 1, limit = 15, category = null, refresh = false) => {
    const cacheKey = `posts:page:${page}:limit:${limit}:category:${category || 'all'}`;
    if (!refresh) {
        const cached = getCachedPosts(cacheKey);
        if (cached) {
            return cached;
        }
    }

    let queryParams = `page=${page}&limit=${Math.min(limit, 15)}`;
    if (category) {
        queryParams += `&category=${encodeURIComponent(category)}`;
    }
    const url = getApiUrl(`posts?${queryParams}`);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
            },
        });
        if (!response.ok) {
            // ✅ CẢI THIỆN: Nếu backend trả về 404, trả về empty data thay vì throw error
            if (response.status === 404) {
                console.warn('⚠️ Backend diendan API returned 404, returning empty data');
                const emptyData = {
                    posts: [],
                    total: 0,
                    totalPages: 0,
                    currentPage: page,
                    limit: limit,
                };
                setCachedPosts(cacheKey, emptyData);
                return emptyData;
            }
            const errorText = await response.text();
            throw new Error(`Có lỗi khi lấy bài viết: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setCachedPosts(cacheKey, data);
        return data;
    } catch (error) {
        console.error('getPosts error:', error);
        // ✅ CẢI THIỆN: Nếu lỗi network hoặc backend down, trả về empty data thay vì throw
        if (error.message.includes('404') || error.message.includes('Not Found') || error.message.includes('Backend returned 404')) {
            console.warn('⚠️ Backend diendan API unavailable, returning empty data');
            const emptyData = {
                posts: [],
                total: 0,
                totalPages: 0,
                currentPage: page,
                limit: limit,
            };
            setCachedPosts(cacheKey, emptyData);
            return emptyData;
        }
        throw error;
    }
};

export const createPost = async (postData) => {
    const session = await getSession();
    const url = getApiUrl('posts');
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({
                title: postData.title,
                mainContents: postData.mainContents || [],
                category: postData.category,
                contentOrder: postData.contentOrder || [],
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error:', errorText);
            throw new Error(`Có lỗi khi đăng bài: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        for (const key of cache.keys()) {
            if (key.startsWith('posts:') || key.startsWith('post:')) {
                cache.delete(key);
            }
        }
        clearCombinedCache();
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('newPostCreated', { detail: data }));
        }
        return data;
    } catch (error) {
        console.error('createPost error:', error);
        throw error;
    }
};

export const getPostById = async (id, refresh = false) => {
    const cacheKey = `post:${id}`;
    if (!refresh) {
        const cached = getCachedPosts(cacheKey);
        if (cached) {
            return cached;
        }
    }

    const url = getApiUrl(`posts/${id}`);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error:', errorText);
            throw new Error(`Có lỗi khi lấy bài viết: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setCachedPosts(cacheKey, data);
        return data;
    } catch (error) {
        console.error('getPostById error:', error);
        throw error;
    }
};

export const getCombinedPostData = async (id, refresh = false) => {
    const cacheKey = `combined:${id}`;
    if (!refresh) {
        const cached = getCachedPosts(cacheKey);
        if (cached) {
            return cached;
        }
    }

    const actualId = id.includes('-') ? id.split('-').pop() : id;
    const url = getApiUrl(`posts/combined/${actualId}`);
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error:', errorText);
            throw new Error(`Có lỗi khi lấy dữ liệu bài viết: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setCachedPosts(cacheKey, data);
        return data;
    } catch (error) {
        console.error('getCombinedPostData error:', error);
        throw error;
    }
};

export const getCategories = async () => {
    const url = getApiUrl('posts/categories');
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Có lỗi khi lấy danh sách danh mục: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        return data.categories;
    } catch (error) {
        console.error('getCategories error:', error);
        throw error;
    }
};

