import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

//coreUI
import {
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCol,
    CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSettings } from "@coreui/icons";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//components
import CountUp from 'react-countup';

const Stats = ({ userId, isAdmin }) => {
    //#region constants
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleError = useErrorHandler();
    //#endregion

    //#region states
    const [stats, setStats] = useState(null)
    //#endregion

    //#region functions
    const fetchAdminStats = async () => {
        await api
            .get("/report/stats")
            .then((response) => {
                setStats(response.data);
            })
            .catch((error) => {
                handleError(error);
            });
    };
    const fetchProfessorStats = async () => {
        await api
            .get(`/report/stats/${userId}`)
            .then((response) => {
                setStats(response.data);
            })
            .catch((error) => {
                handleError(error);
            });
    };
    //#endregion

    //#region useEffect
    useEffect(() => {
        isAdmin ? fetchAdminStats() : fetchProfessorStats()
    }, []);
    //#endregion

    return (
        <CCard className="mb-4">
            <CCardBody>
                <CRow>
                    <CCol sm={5}>
                        <h4 className="card-title mb-0">{t("AcademicYear")}</h4>
                        <div className="small text-medium-emphasis">
                            {stats?.active_academic_year}
                        </div>
                    </CCol>
                    <CCol sm={7} className="d-none d-md-block">
                        <CButton
                            color="light"
                            className="float-end"
                            onClick={() => navigate("/settings")}
                        >
                            <CIcon icon={cilSettings} />
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>

            <CCardFooter>
                <CRow>
                    {!isAdmin && <CCol xs={6} md={4} lg={2}>
                        <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                            <div className="text-medium-emphasis small">{t("Courses")}</div>
                            <div className="fs-5 fw-semibold">
                                <CountUp end={stats?.courses_count} />
                            </div>
                        </div>
                    </CCol>}
                    <CCol xs={6} md={isAdmin ? 3 : 4} lg={isAdmin ? 3 : 2}>
                        <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                            <div className="text-medium-emphasis small">{t("Papers")}</div>
                            <div className="fs-5 fw-semibold">
                                <CountUp end={stats?.papers_count} />
                            </div>
                        </div>
                    </CCol>
                    <CCol xs={6} md={isAdmin ? 3 : 4} lg={isAdmin ? 3 : 2} >
                        <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                            <div className="text-medium-emphasis small">{t("Books")}</div>
                            <div className="fs-5 fw-semibold">
                                <CountUp end={stats?.books_count} />
                            </div>
                        </div>
                    </CCol>
                    <CCol xs={6} md={isAdmin ? 3 : 4} lg={isAdmin ? 3 : 2}>
                        <div className="border-start border-start-4 border-start-primary py-1 px-3 mb-3">
                            <div className="text-medium-emphasis small">
                                {t("Conferences")}
                            </div>
                            <div className="fs-5 fw-semibold">
                                <CountUp end={stats?.conferences_count} />
                            </div>
                        </div>
                    </CCol>
                    <CCol xs={isAdmin ? 6 : 12} md={isAdmin ? 3 : 8} lg={isAdmin ? 3 : 4} >
                        <div className="border-start border-start-4 border-start-secondary py-1 px-3 mb-3">
                            <div className="text-medium-emphasis small">
                                {t("CommunityServices")}
                            </div>
                            <div className="fs-5 fw-semibold">
                                <CountUp end={stats?.community_services_count} />
                            </div>
                        </div>
                    </CCol>
                </CRow>
            </CCardFooter>
        </CCard>
    )
}

export default Stats