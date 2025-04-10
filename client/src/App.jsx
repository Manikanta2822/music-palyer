import React from "react";
import AuthProvider from "./Context/Context";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Navigation from "./Navigation/Navigation";
import Register from "./Register/Register";
import Login from "./Login/Login";
import Home from "./Home/Home";
import Track from "./Track/Track";
import SearchMusic from "./Searchmusic/SearchMusic";
import Admin from "./Admin/Admin";
import { MusicProvider } from "./Context/MusicContext";
import MusicPlayer from "./MusicPlayer/MusicPlayer";


function App() {
  return (
    <MusicProvider>
    <Router>
      <Navigation/>
    <AuthProvider/>
        <Routes>
          <Route path="/users" element={<Admin />} />
          <Route path="/track/:trackId" element={<Track />} />
          <Route path="/search" element={<SearchMusic />} />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          </Routes>
          <MusicPlayer/>
      </Router>
      </MusicProvider>
  );
}

export default App;
