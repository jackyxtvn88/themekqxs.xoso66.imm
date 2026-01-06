import Head from 'next/head';
import { memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import KQXS from './xsmn/xosomn';
import Calendar from '../component/caledar';
import ListXSMT from '../component/listXSMT';
import ListXSMB from '../component/listXSMB';
import ListXSMN from '../component/listXSMN';
import TableDate from '../component/tableDateKQXS';
import CongCuHot from '../component/CongCuHot';
import { apiMN } from './api/kqxs/kqxsMN';

// Lazy load components để tối ưu hiệu suất
const LazyThongKe = dynamic(() => import('../component/thongKe'), {
    loading: () => <div style={{ height: '200px', background: '#f5f5f5' }}>Đang tải...</div>,
    ssr: false
});

const LazyCongCuHot = dynamic(() => import('../component/CongCuHot'), {
    loading: () => <div style={{ height: '100px', background: '#f5f5f5' }}>Đang tải...</div>,
    ssr: false
});

export async function getStaticProps() {
    const now = new Date();
    const isUpdateWindow = now.getHours() === 16 && now.getMinutes() >= 10 && now.getMinutes() <= 59;
    const revalidateTime = isUpdateWindow ? 10 : 21600; // 10 giây trong khung giờ cập nhật, 6 giờ ngoài khung giờ
    const drawDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    try {
        const initialData = await apiMN.getLottery('xsmn', null, null, null, { limit: 3 });
        return {
            props: {
                initialData,
                drawDate,
            },
            revalidate: revalidateTime,
        };
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu ban đầu:', {
            message: error.message,
            stack: error.stack,
        });
        return {
            props: {
                initialData: [],
                drawDate,
            },
            revalidate: revalidateTime,
        };
    }
}

const XSMN = memo(({ initialData, drawDate }) => {
    // Memoize SEO data để tránh re-create objects
    const seoData = useMemo(() => {
        const canonicalUrl = 'https://www.kqsx.xoso66.im/ket-qua-xo-so-mien-nam';
        const title = `XSMN - Kết Quả Xổ Số Miền Nam - KQXSMN Hôm Nay ${drawDate}`;
        const description = `XSMN - Xem kết quả xổ số Miền Nam ngày ${drawDate} nhanh và chính xác, tường thuật SXMN lúc 16h10 trực tiếp từ trường quay. Xem giải đặc biệt, lô tô, đầu đuôi tại kqsx.xoso66.im!`;

        return {
            canonicalUrl,
            title,
            description,
            keywords: "xổ số miền nam, xsmn, kqxs, kết quả xổ số miền nam, xổ số hôm nay, kqxsmn, sxmn, lô tô, đầu đuôi, soi cầu xsmn, xổ số miền nam hôm nay, kết quả xổ số miền nam ngày hôm nay, xổ số miền nam ngày hôm nay, kết quả xổ số miền nam hôm nay, xổ số miền nam ngày hôm nay, kết quả xổ số miền nam ngày hôm nay, xổ số miền nam hôm nay, kết quả xổ số miền nam hôm nay, xổ số miền nam ngày hôm nay, kết quả xổ số miền nam ngày hôm nay"
        };
    }, [drawDate]);

    // Memoize JSON-LD schema để tránh re-create
    const jsonLdSchema = useMemo(() => [
        {
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": `Kết Quả Xổ Số Miền Nam ${drawDate}`,
            "description": `Kết quả xổ số Miền Nam ngày ${drawDate} với các giải thưởng và thống kê chi tiết.`,
            "temporalCoverage": drawDate,
            "keywords": ["xổ số", "miền nam", "kết quả", "xsmn", "lô tô", "đầu đuôi", "soi cầu xsmn", "xổ số miền nam hôm nay"],
            "url": seoData.canonicalUrl,
            "publisher": {
                "@type": "Organization",
                "name": "XSMN",
                "url": "https://www.kqsx.xoso66.im",
            },
            "license": "https://creativecommons.org/licenses/by/4.0/",
            "creator": {
                "@type": "Organization",
                "name": "Kqxs.xoso66.im",
                "url": "https://www.kqsx.xoso66.im"
            },
            "dateModified": new Date().toISOString(),
            "datePublished": new Date().toISOString()
        },
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "XSMN",
            "url": "https://www.kqsx.xoso66.im",
            "logo": "https://kqsx.xoso66.im/logo.png",
            "sameAs": [
                "https://zalo.me/your-zalo-oa-link",
                "https://t.me/YourChannel"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Vietnamese"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "XSMN",
            "url": "https://www.kqsx.xoso66.im",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.kqsx.xoso66.im/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
            },
            "description": "Trang web xem kết quả xổ số miền Nam nhanh nhất, chính xác nhất"
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Trang chủ",
                    "item": "https://www.kqsx.xoso66.im"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Xổ Số Miền Nam",
                    "item": "https://www.kqsx.xoso66.im/ket-qua-xo-so-mien-nam"
                }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `Kết Quả Xổ Số Miền Nam ${drawDate}`,
            "description": `Kết quả xổ số Miền Nam ngày ${drawDate} với đầy đủ các giải thưởng và thống kê chi tiết.`,
            "image": "https://kqsx.xoso66.im/xsmn.png",
            "author": {
                "@type": "Organization",
                "name": "Kqxs.xoso66.im"
            },
            "publisher": {
                "@type": "Organization",
                "name": "XSMN",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://kqsx.xoso66.im/logo.png"
                }
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": seoData.canonicalUrl
            }
        }
    ], [drawDate, seoData.canonicalUrl]);

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
                <title>{seoData.title}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={seoData.keywords} />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <meta name="googlebot" content="index, follow" />
                <meta name="bingbot" content="index, follow" />

                {/* Performance & Security Headers */}
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="theme-color" content="#ff0000" />
                <meta name="msapplication-TileColor" content="#ff0000" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="XSMN" />

                {/* Open Graph Tags - Enhanced */}
                <meta property="og:title" content={seoData.title} />
                <meta property="og:description" content={seoData.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={seoData.canonicalUrl} />
                <meta property="og:image" content="https://kqsx.xoso66.im/xsmn.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:secure_url" content="https://kqsx.xoso66.im/xsmn.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:alt" content={`Kết quả xổ số miền Nam ${drawDate}`} />
                <meta property="og:site_name" content="XSMN" />
                <meta property="og:locale" content="vi_VN" />
                <meta property="og:locale:alternate" content="en_US" />
                <meta property="fb:app_id" content={process.env.FB_APP_ID || ''} />

                {/* Zalo - Enhanced */}
                <meta property="og:app_id" content={process.env.ZALO_APP_ID || ''} />
                <meta property="zalo:official_account_id" content={process.env.ZALO_OA_ID || ''} />
                <meta property="zalo:share_url" content={seoData.canonicalUrl} />
                <meta property="zalo:og:image" content="https://kqsx.xoso66.im/zalotelegram.png" />
                <meta property="zalo:og:image:width" content="600" />
                <meta property="zalo:og:image:height" content="600" />

                {/* Telegram - Enhanced */}
                <meta name="telegram:channel" content={process.env.TELEGRAM_CHANNEL || '@YourChannel'} />
                <meta name="telegram:share_url" content={seoData.canonicalUrl} />
                <meta
                    name="telegram:description"
                    content={`Cập nhật XSMN nhanh nhất ngày ${drawDate} tại ${process.env.TELEGRAM_CHANNEL || '@YourChannel'}!`}
                />
                <meta name="telegram:og:image" content="https://kqsx.xoso66.im/zalotelegram.png" />

                {/* Twitter Cards - Enhanced */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoData.title} />
                <meta name="twitter:description" content={seoData.description} />
                <meta name="twitter:image" content="https://kqsx.xoso66.im/xsmn.png" />
                <meta name="twitter:image:alt" content={`Kết quả xổ số miền Nam ${drawDate}`} />
                <meta name="twitter:site" content="@xsmb_win" />
                <meta name="twitter:creator" content="@xsmb_win" />

                {/* Canonical & Alternate */}
                <link rel="canonical" href={seoData.canonicalUrl} />
                <link rel="alternate" hrefLang="vi" href={seoData.canonicalUrl} />
                <link rel="alternate" hrefLang="x-default" href={seoData.canonicalUrl} />

                {/* Preload critical resources */}
                <link rel="dns-prefetch" href="//kqsx.xoso66.im" />
                <link rel="dns-prefetch" href="//www.google-analytics.com" />

                {/* JSON-LD Schema - Enhanced */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
                />
            </Head>

            <main>
                <div className='container'>
                    <nav className='navigation' role="navigation" aria-label="Điều hướng chính">
                        <Calendar />
                        <ListXSMB />
                        <ListXSMT />
                        <ListXSMN />
                    </nav>

                    <section>

                        {initialData ? (
                            <KQXS data={initialData} station="xsmn">Miền Nam</KQXS>
                        ) : (
                            <div role="status" aria-live="polite">
                                <span>Đang tải kết quả...</span>
                            </div>
                        )}

                        <article className="desc1" style={{ minHeight: '200px' }}>
                            <h1 className='heading'>Kqxs.xoso66.im | Kết Quả Xổ Số Miền Nam Nhanh Nhất - Chính Xác Nhất</h1>
                            <p>
                                Cập nhật kết quả xổ số Miền Nam (XSMN) ngày {drawDate} lúc 16h10 trực tiếp từ trường quay các tỉnh.
                                Xem chi tiết <strong>giải đặc biệt</strong>, <strong>lô tô</strong>, <strong>đầu đuôi</strong> và
                                <strong>thống kê</strong> nhanh chóng tại kqsx.xoso66.im. Khám phá thêm{' '}
                                <a href="/ket-qua-xo-so-mien-bac" title="Kết quả xổ số miền Bắc">XSMB</a>,{' '}
                                <a href="/ket-qua-xo-so-mien-trung" title="Kết quả xổ số miền Trung">XSMT</a>, và{' '}
                                <a href="/thong-ke-xsmn" title="Thống kê XSMN">thống kê XSMN</a> để phân tích chi tiết!
                            </p>
                            <br />
                            <p className='note' role="note">
                                <strong>Chú ý:</strong> Mọi hành vi liên quan đến vi phạm pháp luật chúng tôi KHÔNG khuyến khích và KHÔNG chịu trách nhiệm.
                            </p>
                        </article>
                    </section>

                    <aside>
                        <LazyThongKe />
                        <LazyCongCuHot />
                    </aside>
                </div>
            </main>
        </>
    );
});

XSMN.displayName = 'XSMN';

export default XSMN;