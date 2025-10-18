import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ClubInvite from './components/ClubInvite';
import InviteAccept from './components/InviteAccept';
import WelcomePage from './components/WelcomePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 초대 링크 생성 페이지 */}
          <Route path="/club/:clubId/invite" element={<ClubInvite />} />
          
          {/* 초대 링크 수락 페이지 */}
          <Route path="/invite/accept" element={<InviteAccept />} />
          
          {/* 가입 성공 환영 페이지 */}
          <Route path="/welcome" element={<WelcomePage />} />
          
          {/* 기본 페이지 (테스트용) */}
          <Route path="/" element={
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>Rhythmeet</h1>
              <p><Link to="/club/1/invite">동아리 초대 링크 생성 테스트</Link></p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
