import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";

//react-icons
import { RiAiGenerate } from "react-icons/ri";

//devextreme
import { TextArea } from "devextreme-react";
import { MdDeleteOutline } from "react-icons/md";
import api from "src/hooks/api";

const TextSummarizer = () => {
  //#region constants
  const { t } = useTranslation();
  //#endregion

  //#region states
  const [value, setValue] = useState(null);
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  //#endregion

  //#region functions
  const onTextAreaValueChanged = useCallback((e) => {
    setValue(e.value);
  }, []);

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post("/ai/summarize", { content: value });
      if (response.data) {
        // Prepend the new summary to the existing list, ensuring prevData is always treated as an array
        setData((prevData) => [
          response.data,
          ...(Array.isArray(prevData) ? prevData : []),
        ]);

        setValue(""); // Reset the input value state
      }
    } catch (error) {
      console.error("Error summarizing content:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchSummarizes = async () => {
    try {
      const result = await api.get("/ai/summarize");
      setData(result?.data.reverse());
    } catch (error) {
      console.error("Failed to fetch summaries:", error);
      // Optionally set an error state here to show an error message to the user
    }
  };

  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    }
  };

  const handleCopy = (txt) => {
    copyTextToClipboard(txt)
      .then(() => {
        setIsCopy(true);

        setTimeout(() => {
          setIsCopy(false);
        }, 1500);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (summary) => {
    // Assuming delete makes an API call to remove by ID
    api
      .delete(`/ai/summarize/${summary.id}`)
      .then(() => {
        // Filter out the deleted summary from local state
        const filtered = data.filter((d) => d.id !== summary.id);
        setData(filtered);
      })
      .catch((err) => console.log("Error deleting summary:", err));
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchSummarizes();
  }, []);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <RiAiGenerate />
            <span className="title">{t("TextSummarizer")}</span>
          </h6>
        </CCardHeader>

        <CCardBody>
          <TextArea
            height={250}
            value={value}
            placeholder={t("PasteContentHere") + "..."}
            onValueChanged={onTextAreaValueChanged}
          />

          <CRow xs={{ cols: 2, gutter: 4 }} className="mt-2">
            <CCol className="text-start">
              <CButton
                disabled={submitting}
                color="light"
                onClick={() => setValue("")}
              >
                {t("Clear")}
              </CButton>
            </CCol>
            <CCol className="text-end">
              <CButton disabled={submitting} onClick={onHandleSubmit}>
                {submitting ? t("PleaseWait") + "..." : t("Summarize")}
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {data?.map((d, index) => (
        <CCard key={index} className="mt-4">
          <CCardBody>
            <p>{d.content}</p> {/* Updated to render the content property */}
            <div className="flex gap-5 items-center justify-end mt-2">
              <p
                className="text-gray-500 font-semibold cursor-pointer"
                onClick={() => handleCopy(d.content)} // Update to pass content to the copy function
              >
                {isCopy ? t("Copied") : t("Copy")}
              </p>
              <span className="cursor-pointer" onClick={() => handleDelete(d)}>
                <MdDeleteOutline />
              </span>
            </div>
          </CCardBody>
        </CCard>
      ))}
    </>
  );
};

export default TextSummarizer;
