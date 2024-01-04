import React from "react";
import { TextBox } from "devextreme-react";

export function renderLngSwitcher(data, type) {
  const renderField = () => {
    if (!data) {
      return <TextBox className="name" readOnly={true} />;
    }

    const { name, value } = data;
    return (
      <div className="rz-selectBox small">
        <img
          style={{ marginLeft: "12px" }}
          src={`${process.env.PUBLIC_SRC_URL}/images/flags/${value}.svg`}
          alt={name}
          height={20}
        />
        <TextBox className="title" defaultValue={name} readOnly={true} />
      </div>
    );
  };

  const renderItem = () => {
    const { name, value } = data;

    return (
      <div className="rz-selectBox small">
        <img
          className="mr-10"
          src={`${process.env.PUBLIC_SRC_URL}/images/flags/${value}.svg`}
          alt={name}
          height={20}
        />
        <span className="title">{name}</span>
      </div>
    );
  };

  return type === "field"
    ? renderField()
    : type === "item"
      ? renderItem()
      : null;
}
