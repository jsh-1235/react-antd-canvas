import "./App.css";

import React, { useState, useEffect, Suspense } from "react";

import { Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";

import { Layout, Menu } from "antd";

import { AppstoreOutlined } from "@ant-design/icons";

const pages = ["drawing", "canvas", "svg"];

const Drawing = React.lazy(() => import("./pages/Drawing"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [match, setMatch] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState("1");

  useEffect(() => {
    // console.log(window.location.href, window.location.pathname, location.pathname);

    pages.forEach((page, index) => {
      if (location.pathname.includes(page)) {
        setSelectedKeys(String(index + 1));

        // console.log(page, String(index + 1), location.pathname, location.pathname.includes(page));
      }
    });

    window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => {
      setMatch(e.matches);

      console.log(e.matches);

      // navigate("/");
    });

    return () => {
      // console.log("componentWillUnmount");
    };
  }, []);

  useEffect(() => {
    // console.log("selectedKeys", selectedKeys);
  });

  const handleSelectMenu = (item) => {
    setSelectedKeys(item.key);

    // console.log(item);
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh", backgroundColor: "white" }}>
        <header className="header">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[selectedKeys]}
            selectedKeys={[selectedKeys]}
            onClick={handleSelectMenu}
            items={pages.map((page, index) => {
              const key = index + 1;
              return {
                key,
                label: <Link to={`/${page}`}>{`${String(page).toUpperCase()}`}</Link>,
                icon: <AppstoreOutlined />,
              };
            })}></Menu>
        </header>
        <main className="main">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Drawing />} />
              <Route path="/drawing" element={<Drawing />}>
                <Route path=":id" element={<Drawing />} />
              </Route>
              {/* <Route path="/transition" element={<Transitions />} /> */}
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <footer className="footer">It is ©2018 Created by BT Inc</footer>
      </Layout>
    </>
  );
}

export default App;
