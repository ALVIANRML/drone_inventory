import React from "react";
import { Breadcrumb } from "antd";

const BreadCrumpComponent = ({ number, data, setRoute }) => {
  const items = [
    {
      title: <a onClick={() => setRoute("home")}>Home</a>,
    },
  ];

  if (number === 2) {
    items.push({
      title: data,
    });
  }

  return <Breadcrumb items={items} />;
};

export default BreadCrumpComponent;
