import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import KQXS from './xosomt';
import Calendar from '../../../components/caledar';
import styles from "../../../public/css/itemsKQXS.module.css";
import ThongKe from '../../../components/thongKe';
import CongCuHot from '../../../components/CongCuHot';
import ListXSMT from '../../../components/listXSMT';
import ListXSMB from '../../../components/listXSMB';
import ListXSMN from '../../../components/listXSMN';

import Image from 'next/image';
// Giả lập API để lấy thông tin ngày


export default function XsmtPage() {
    const router = useRouter();
    const { tinh } = router.query; // slug sẽ là mảng hoặc undefined
    const [error, setError] = useState(null);

    if (error) {
        return (
            <div className={styles.containerStyle}>
                <p>{error}</p>
                <button className={styles.buttonStyle} onClick={() => router.push('/')}>
                    Quay lại lịch
                </button>
            </div>
        );
    }

    return (

        <div className="container">
            <div>
                <Calendar></Calendar>
                <ListXSMB></ListXSMB>
                <ListXSMT></ListXSMT>
                <ListXSMN></ListXSMN>
            </div>
            <KQXS tinh={tinh}></KQXS>
            <div>
                <ThongKe></ThongKe>
                <CongCuHot />
            </div>
        </div>
    );
}

