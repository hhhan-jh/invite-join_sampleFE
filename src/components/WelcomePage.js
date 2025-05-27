import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  
  const { message, clubName } = location.state || {
    message: '가입을 축하합니다! 🎉',
    clubName: '동아리'
  };

  useEffect(() => {
    // 5초 후 confetti 효과 중지
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const goToClubMain = () => {
    // 실제로는 동아리 메인 페이지로 이동
    navigate('/');
  };

  return (
    <div className="welcome-container">
      {showConfetti && <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div key={i} className={`confetti confetti-${i % 6}`}></div>
        ))}
      </div>}
      
      <div className="welcome-card">
        <div className="success-animation">
          <div className="checkmark-container">
            <div className="checkmark">✓</div>
          </div>
        </div>
        
        <h1 className="welcome-title">환영합니다! 🎉</h1>
        <p className="welcome-message">{message}</p>
        
        <div className="club-welcome-info">
          <h2>🎵 {clubName}</h2>
          <p>이제 동아리의 정식 멤버가 되었습니다!</p>
        </div>
        
        <div className="welcome-features">
          <div className="feature">
            <div className="feature-icon">📅</div>
            <h3>정기 모임 참여</h3>
            <p>매주 진행되는 정기 모임에 참여할 수 있어요</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎸</div>
            <h3>합주 및 공연</h3>
            <p>다양한 악기로 함께 연주하고 공연해요</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💬</div>
            <h3>커뮤니티 활동</h3>
            <p>멤버들과 소통하고 친목을 도모해요</p>
          </div>
        </div>
        
        <div className="next-steps">
          <h3>다음 단계 🚀</h3>
          <div className="steps-list">
            <div className="step">
              <span className="step-number">1</span>
              <span>프로필을 완성해주세요</span>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <span>다른 멤버들과 인사해보세요</span>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <span>첫 모임 일정을 확인해보세요</span>
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="primary-btn" onClick={goToClubMain}>
            동아리 메인으로 이동 🏠
          </button>
          <button className="secondary-btn" onClick={() => navigate('/')}>
            홈으로 돌아가기
          </button>
        </div>
        
        <div className="welcome-footer">
          <p>🎶 음악으로 하나되는 우리들의 이야기가 시작됩니다!</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;