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

//hooks
import summarizeContent from "src/hooks/sumarizeContent";

//devextreme
import { TextArea } from "devextreme-react";
import { MdDeleteOutline } from "react-icons/md";

const TextSummarizer = () => {
  //#region constants
  const { t } = useTranslation();
  //#endregion

  //#region refs
  const textAreaRef = useRef(null);
  //#endregion

  //#region states
  const [value, setValue] = useState(null);
  const [data, setData] = useState([null]);
  const [submitting, setSubmitting] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  //#endregion

  //#region functions
  const onTextAreaValueChanged = useCallback((e) => {
    setValue(e.value);
  }, []);

  const onHandleClear = () => {
    textAreaRef.current._instance.clear();
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await summarizeContent(value);

    if (result) {
      debugger;
      localStorage.setItem(
        "summary",
        JSON.stringify(data?.length > 0 ? [...data, result] : [result])
      );

      fetchLocalStorage();
    }

    setSubmitting(false);
  };

  const fetchLocalStorage = async () => {
    const result = await localStorage.getItem("summary");

    setData(JSON.parse(result)?.reverse());
  };

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    }
  }

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

  const handleDelete = (txt) => {
    const filtered = data?.filter((d) => d !== txt);

    setData(filtered);

    localStorage.setItem("summary", JSON.stringify(filtered));
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchLocalStorage();
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
            ref={textAreaRef}
            height={250}
            defaultValue={value}
            placeholder={t("PasteContentHere") + "..."}
            onValueChanged={onTextAreaValueChanged}
          />

          <CRow xs={{ cols: 2, gutter: 4 }} className="mt-2">
            <CCol className="text-start">
              <CButton
                disabled={submitting}
                color="light"
                onClick={onHandleClear}
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
            <p>{d}</p>
            <div className="flex gap-5 items-center justify-end mt-2">
              <p
                className="text-gray-500 font-semibold cursor-pointer"
                onClick={() => handleCopy(d)}
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
