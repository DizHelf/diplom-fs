import Container from "@mui/material/Container";

import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components";
import {
  Home,
  FullPost,
  Registration,
  AddPost,
  Login,
  Message,
  UserChat,
} from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe } from "./redux/slices/auth";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/messages/:id" element={<UserChat />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
