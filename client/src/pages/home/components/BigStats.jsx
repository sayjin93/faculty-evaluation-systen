import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

//coreUI
import {
    CCol,
    CRow,
    CWidgetStatsD,
} from "@coreui/react";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//rect-icons
import { FaChalkboardTeacher } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";

const BigStats = () => {
    //#region constants
    const { t } = useTranslation();
    const handleError = useErrorHandler();
    //#endregion

    //#region states
    // @ts-ignore
    const [bigStats, setBigStats] = useState(null)
    //#endregion

    //#region functions
    const fetchBigStats = async () => {
        await api
            .get("/report/bigStats")
            .then((response) => {
                setBigStats(response.data);
            })
            .catch((error) => {
                handleError(error);
            });
    };
    //#endregion

    //#region useEffect
    useEffect(() => {
        fetchBigStats();
    }, []);
    //#endregion

    return (
        <CRow className="mb-4" xs={{ gutter: 4 }}>
            <CCol sm={6}>
                <CWidgetStatsD
                    title={t("Professors")}
                    icon={
                        <div className='my-4 flex flex-column text-white'>

                            <FaChalkboardTeacher size={52} className='mb-2' />
                            <h5>{bigStats?.total_professors_count} <span style={{ fontSize: "1rem" }}>{t("Professors")}</span></h5>
                        </div>
                    }
                    values={[
                        { title: t("Male"), value: bigStats?.male_professors_count },
                        { title: t("Female"), value: bigStats?.female_professors_count },
                    ]}
                    style={{
                        // @ts-ignore
                        '--cui-card-cap-bg': '#3b5998',
                    }}
                />
            </CCol>
            <CCol sm={6}>
                <CWidgetStatsD
                    title={t("Courses")}
                    icon={
                        <div className='my-4 flex flex-column text-white'>
                            <GiGraduateCap size={52} className='mb-2' />
                            <h5>{bigStats?.total_courses_count} <span style={{ fontSize: "1rem" }}>{t("Courses")}</span></h5>
                        </div>
                    }
                    values={[
                        { title: 'Bachelor', value: bigStats?.bachelor_courses_count },
                        { title: 'Master', value: bigStats?.master_courses_count },
                    ]}
                    style={{
                        // @ts-ignore
                        '--cui-card-cap-bg': '#00aced',
                    }}
                />
            </CCol>
        </CRow>
    )
}

export default BigStats