import React, { useCallback, useEffect, useState } from "react";
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
import { IoCopyOutline, IoCheckmark } from "react-icons/io5";

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
  const [copiedId, setCopiedId] = useState(null);
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

  const handleCopy = (txt, id) => {
    copyTextToClipboard(txt)
      .then(() => {
        setCopiedId(id); // Set the copiedId to the ID of the card being copied

        setTimeout(() => {
          setCopiedId(null); // Reset after 1.5 seconds
        }, 1500);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    // Assuming delete makes an API call to remove by ID
    api
      .delete(`/ai/summarize/${id}`)
      .then(() => {
        // Filter out the deleted summary from local state
        const filtered = data.filter((d) => d.id !== id);
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
            <p>{d.content}</p>

            <CRow xs={{ cols: 2, gutter: 4 }} className="mt-2">
              <CCol className="text-start">
                <CButton
                  color={copiedId === d.id ? "success" : "primary"} // Compare the ID
                  variant="outline"
                  shape="rounded-pill"
                  onClick={() => handleCopy(d.content, d.id)} // Pass the ID to handleCopy
                >
                  {copiedId === d.id ? ( // Compare the ID
                    <>
                      <IoCheckmark />
                      <span className="ms-1">{t("Copied")}</span>
                    </>
                  ) : (
                    <>
                      <IoCopyOutline />
                      <span className="ms-1">{t("Copy")}</span>
                    </>
                  )}
                </CButton>
              </CCol>
              <CCol className="text-end">
                <CButton
                  color="danger"
                  variant="outline"
                  shape="rounded-pill"
                  onClick={() => handleDelete(d.id)}
                >
                  <MdDeleteOutline />
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      ))}
    </>
  );
};

export default TextSummarizer;
