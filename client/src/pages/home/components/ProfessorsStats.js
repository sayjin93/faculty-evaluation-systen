import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

//coreUI
import {
    CCard,
    CCardBody,
    CCardHeader,
} from "@coreui/react";

//devextreme
import { Column } from "devextreme-react/data-grid";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//components
import CustomDataGrid from "src/components/CustomDataGrid";
import Skeleton from 'src/components/Skeleton';

const ProfessorsStats = () => {
    //#region constants
    const { t } = useTranslation();
    const handleError = useErrorHandler();
    //#endregion

    //#region states
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState([]);
    //#endregion

    //#region functions
    const fetchProfessorsData = async () => {
        await api
            .get("/report/professors-data")
            .then((response) => {
                setStats(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                handleError(error);
            });
    };
    //#endregion

    //#region useEffect
    useEffect(() => {
        fetchProfessorsData();
    }, []);
    //#endregion

    return (
        <CCard
            textColor="primary"
            className="border-primary border-top-primary border-top-3 mb-4"
        >
            <CCardHeader>{t("ProfessorsStatistics")}</CCardHeader>

            <CCardBody>
                {(() => {
                    if (isLoading) {
                        return <Skeleton className="h-48 mb-1" times={6} />
                    } else {
                        return (
                            <CustomDataGrid dataSource={stats}>
                                <Column
                                    dataField="professor"
                                    caption={t("Professor")}
                                    dataType="string"
                                />
                                <Column
                                    dataField="courses"
                                    caption={t("Courses")}
                                    dataType="number"
                                />
                                <Column
                                    dataField="total_week_hours"
                                    caption={t("WeekHours")}
                                    dataType="number"
                                />
                                <Column
                                    dataField="papers"
                                    caption={t("Papers")}
                                    dataType="number"
                                />
                                <Column
                                    dataField="books"
                                    caption={t("Books")}
                                    dataType="number"
                                />
                                <Column
                                    dataField="conferences"
                                    caption={t("Conferences")}
                                    dataType="number"
                                />
                                <Column
                                    dataField="community_service"
                                    caption={t("CommunityServices")}
                                    dataType="number"
                                />
                            </CustomDataGrid>
                        )
                    }
                })()}

            </CCardBody>
        </CCard>
    )
}

export default ProfessorsStats