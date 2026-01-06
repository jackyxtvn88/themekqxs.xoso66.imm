const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backendkqxs-1.onrender.com';
const API_BASE_URL2 = process.env.NEXT_PUBLIC_BACKEND_URL2 || 'https://scraper-1-fewd.onrender.com';
const DAYS_PER_PAGE = 3; // Số ngày mỗi trang

const getUserId = () => {
    if (typeof window !== 'undefined') {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = Math.random().toString(36).substring(2);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }
    return 'default-user';
};

export const apiMN = {
    getLottery: async (station, date, tinh, dayof, pagination = {}) => {
        // ✅ MỚI: Thử RapidAPI trước (hỗ trợ Miền Nam và có thể filter theo date)
        // Convert date format nếu có
        let rapidApiDate = null;
        if (date) {
            try {
                // Format: "01-08-2025" -> "2025-08-01"
                const [day, month, year] = date.split('-');
                rapidApiDate = `${year}-${month}-${day}`;
            } catch (e) {
                // If already in YYYY-MM-DD format, use as is
                rapidApiDate = date;
            }
        }
        
        // Thử RapidAPI nếu không có dayof và tinh (RapidAPI không hỗ trợ filter theo thứ/tỉnh)
        if (!dayof && !tinh) {
            try {
                console.log('🔄 Trying RapidAPI for Miền Nam...', { date, rapidApiDate });
                const { fetchRapidApiData } = await import('../../../utils/rapidapiAdapter');
                const rapidApiData = await fetchRapidApiData('mien-nam', rapidApiDate);
                
                if (rapidApiData) {
                    console.log('✅ RapidAPI success for Miền Nam');
                    return [rapidApiData]; // Return as array to match expected format
                }
            } catch (rapidApiError) {
                console.warn('⚠️ RapidAPI failed, falling back to original API...', rapidApiError.message);
            }
        }
        
        // ✅ FALLBACK: Sử dụng API cũ nếu RapidAPI không khả dụng hoặc cần filter theo thứ/tỉnh
        let url = `${API_BASE_URL}/api/ketqua/xsmn`;

        if (dayof) {
            if (!dayof || dayof.trim() === '') {
                throw new Error('dayOfWeek cannot be empty');
            }
            url = `${API_BASE_URL}/api/ketqua/xsmn/${dayof}`;
        } else if (station && date) {
            if (!station || !date || station.trim() === '' || date.trim() === '') {
                throw new Error('Station and date cannot be empty');
            }
            url = `${API_BASE_URL}/api/ketqua/${station}-${date}`;
        } else if (station && tinh) {
            if (!station || !tinh || station.trim() === '' || tinh.trim() === '') {
                throw new Error('Station and tinh cannot be empty');
            }
            url = `${API_BASE_URL}/api/ketqua/${station}/tinh/${tinh}`;
        } else {
            url = `${API_BASE_URL}/api/ketqua/xsmn`;
        }

        // Thêm pagination parameters nếu có
        if (pagination.page && pagination.limit) {
            const urlParams = new URLSearchParams();
            urlParams.append('page', pagination.page);
            urlParams.append('limit', pagination.limit);
            urlParams.append('daysPerPage', pagination.daysPerPage || DAYS_PER_PAGE);
            url += `?${urlParams.toString()}`;
        }

        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'x-user-id': getUserId(),
            },
        });

        if (!response.ok) {
            throw new Error('KHÔNG GỌI ĐƯỢC API VÌ KHÔNG CÓ DỮ LIỆU HOẶC LỖI....');
        }

        return response.json();
    },

    getLoGanStats: async (days, tinh) => {
        if (!days || !['6', '7', '14', '30', '60'].includes(days.toString())) {
            throw new Error('Invalid days parameter. Valid options are: 6, 7, 14, 30, 60.');
        }
        if (!tinh || tinh.trim() === '') {
            throw new Error('Tinh cannot be empty for Miền Nam');
        }
        const url = `${API_BASE_URL}/api/ketqua/xsmn/statistics/gan?days=${days}&tinh=${tinh}`;
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'x-user-id': getUserId(),
            },
        });
        if (!response.ok) {
            throw new Error('KHÔNG GỌI ĐƯỢC API THỐNG KÊ LÔ GAN....');
        }
        return response.json();
    },

    getSpecialStats: async (days, tinh) => {
        if (!tinh || tinh.trim() === '') {
            throw new Error('Tinh cannot be empty for Miền Nam');
        }
        if (!days || !['10', '20', '30', '60', '90', '365'].includes(days.toString())) {
            throw new Error('Invalid days parameter. Valid options are: 10, 20, 30, 60, 90, 365.');
        }
        const url = `${API_BASE_URL}/api/ketqua/xsmn/statistics/special?days=${days}&tinh=${tinh}`;
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'x-user-id': getUserId(),
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'KHÔNG GỌI ĐƯỢC API VÌ KHÔNG CÓ DỮ LIỆU HOẶC LỖI....');
        }
        return response.json();
    },

    getDauDuoiStats: async (days, tinh) => {
        if (!tinh || tinh.trim() === '') {
            throw new Error('Tinh cannot be empty for Miền Nam');
        }
        if (!days || !['30', '60', '90', '120', '180', '365'].includes(days.toString())) {
            throw new Error('Invalid days parameter. Valid options are: 30, 60, 90, 120, 180, 365.');
        }
        const url = `${API_BASE_URL}/api/ketqua/xsmn/statistics/dau-duoi?days=${days}&tinh=${tinh}`;
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'x-user-id': getUserId(),
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'KHÔNG GỌI ĐƯỢC API VÌ KHÔNG CÓ DỮ LIỆU HOẶC LỖI....');
        }
        return response.json();
    },

    getDauDuoiStatsByDate: async (days, tinh) => {
        if (!days || !['30', '60', '90', '120', '180', '365'].includes(days.toString())) {
            throw new Error('Invalid days parameter. Valid options are: 30, 60, 90, 120, 180, 365.');
        }
        const url = `${API_BASE_URL}/api/ketqua/xsmn/statistics/dau-duoi-by-date?days=${days}&tinh=${tinh}`;
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'x-user-id': getUserId(),
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'KHÔNG GỌI ĐƯỢC API VÌ KHÔNG CÓ DỮ LIỆU HOẶC LỖI....');
        }
        return response.json();
    },

    getSpecialStatsByWeek: async (month, year, tinh) => {
        if (!tinh || tinh.trim() === '') {
            throw new Error('Tinh cannot be empty for Miền Nam');
        }
        const url = `${API_BASE_URL}/api/ketqua/xsmn/statistics/special-by-week?month=${month}&year=${year}&tinh=${tinh}`;
        try {
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                    'x-user-id': getUserId(),
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Lỗi khi gọi API: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Dữ liệu từ API getSpecialStatsByWeek (Miền Nam):', data);
            return data;
        } catch (error) {
            console.error('Lỗi khi lấy thống kê giải đặc biệt theo tuần (Miền Nam):', error);
            throw new Error('Không thể tải thống kê giải đặc biệt theo tuần, vui lòng thử lại sau');
        }
    },

    getTanSuatLotoStats: async (days, tinh) => {
        if (!days || !['30', '60', '90', '120', '180', '365'].includes(days.toString())) {
            throw new Error('Invalid days parameter. Valid options are: 30, 60, 90, 120, 180, 365.');
        }
        if (!tinh || tinh.trim() === '') {
            throw new Error('Tinh cannot be empty for Miền Nam');
        }
        const url = `${API_BASE_URL}/api/ketqua/xsmn/statistics/tan-suat-loto?days=${days}&tinh=${tinh}`;
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'x-user-id': getUserId(),
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'KHÔNG GỌI ĐƯỢC API THỐNG KÊ TẦN SUẤT LOTO....');
        }
        return response.json();
    },

    getTanSuatLoCapStats: async (days, tinh) => {
        if (!days || !['30', '60', '90', '120', '180', '365'].includes(days.toString())) {
            throw new Error('Invalid days parameter. Valid options are: 30, 60, 90, 120, 180, 365.');
        }
        const url = `${API_BASE_URL}/api/ketqua/xsmn/statistics/tan-suat-lo-cap?days=${days}&tinh=${tinh}`;
        console.log('Calling API:', url);
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'x-user-id': getUserId(),
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'KHÔNG GỌI ĐƯỢC API THỐNG KÊ TẦN SUẤT LÔ CẶP....');
        }
        return response.json();
    },

    // ✅ CẬP NHẬT: Sử dụng endpoint scheduler mới thay vì trigger thủ công
    triggerScraper: async (date, station, provinces) => {
        if (!date || !station || date.trim() === '' || station.trim() === '') {
            throw new Error('Date and station cannot be empty');
        }
        if (!provinces || !Array.isArray(provinces) || provinces.length === 0) {
            throw new Error('Provinces must be a non-empty array');
        }

        const url = `${API_BASE_URL2}/api/scraperMN/scheduler/trigger`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': getUserId(),
                },
                body: JSON.stringify({ date, station, provinces }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Lỗi khi gọi API XSMN scheduler: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi kích hoạt scraper XSMN qua scheduler:', error);
            throw new Error('Không thể kích hoạt scraper XSMN, vui lòng thử lại sau');
        }
    },

    // ✅ MỚI: Kiểm tra trạng thái XSMN scheduler
    getSchedulerStatus: async () => {
        const url = `${API_BASE_URL2}/api/scraperMN/scheduler/status`;

        try {
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                    'x-user-id': getUserId(),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Lỗi khi gọi API XSMN scheduler status: ${response.status} - ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Lỗi khi lấy trạng thái XSMN scheduler:', error);
            throw new Error('Không thể lấy trạng thái XSMN scheduler, vui lòng thử lại sau');
        }
    },

    // ✅ MỚI: Điều khiển XSMN scheduler
    controlScheduler: async (action) => {
        if (!action || !['start', 'stop'].includes(action)) {
            throw new Error('Action không hợp lệ. Chỉ chấp nhận: start, stop');
        }

        const url = `${API_BASE_URL2}/api/scraperMN/scheduler/control`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': getUserId(),
                },
                body: JSON.stringify({ action }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Lỗi khi điều khiển XSMN scheduler: ${response.status} - ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Lỗi khi điều khiển XSMN scheduler:', error);
            throw new Error('Không thể điều khiển XSMN scheduler, vui lòng thử lại sau');
        }
    },
};