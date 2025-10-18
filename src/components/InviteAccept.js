import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './InviteAccept.css';

const InviteAccept = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [clubInfo, setClubInfo] = useState(null);
  
  const code = searchParams.get('code'); // URL에서 ?code=xxx 추출


  useEffect(() => {
    if (!code) {
      setError('유효하지 않은 초대 링크입니다.');
    }
  }, [code]);

  // 동아리 가입 처리
  const joinClub = async () => {
    if (!code) {
      setError('초대 코드가 없습니다.');
      return;
    }

    setLoading(true);
    setError('');

    const token = sessionStorage.getItem('userToken'); // sessionStorage에서 토큰 가져오기

    
    try {
        const response = await axios.post(
            'http://localhost:8080/api/join/clubs',
            null,
            {
              params: { code },
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
      
      if (response.data.success) {
        // 성공시 환영 페이지로 이동
        navigate('/welcome', { 
          state: { 
            message: '동아리 가입을 축하합니다! 🎉',
            clubName: '리듬밋 동아리' // 실제로는 응답에서 받아올 수 있음
          }
        });
      } else {
        setError(response.data.message || '가입에 실패했습니다.');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('서버 오류가 발생했습니다: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!code) {
    return (
      <div className="invite-accept-container">
        <div className="accept-card">
          <div className="error-content">
            <h2>❌ 유효하지 않은 링크</h2>
            <p>초대 링크가 올바르지 않습니다.</p>
            <button onClick={() => navigate('/')} className="home-btn">
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="invite-accept-container">
      <div className="accept-card">
        <div className="invite-header">
          <h1>🎵 동아리 초대</h1>
          <p>리듬밋 동아리에 초대되었습니다!</p>
        </div>

        <div className="club-preview">
          <div className="club-icon">🎸</div>
          <h2>리듬밋 동아리</h2>
          <p className="club-description">
            음악을 사랑하는 사람들이 모인 동아리입니다.<br/>
            함께 연주하고, 공연하고, 음악으로 소통해요! 🎶
          </p>
          
          <div className="club-stats">
            <div className="stat">
              <span className="stat-number">42</span>
              <span className="stat-label">멤버</span>
            </div>
            <div className="stat">
              <span className="stat-number">15</span>
              <span className="stat-label">공연</span>
            </div>
            <div className="stat">
              <span className="stat-number">8</span>
              <span className="stat-label">악기</span>
            </div>
          </div>
        </div>

        <div className="action-section">
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
          
          <button 
            className="join-btn"
            onClick={joinClub}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                가입 처리 중...
              </>
            ) : (
              '동아리 가입하기 🚀'
            )}
          </button>
          
          <button 
            className="cancel-btn"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            취소
          </button>
        </div>

        <div className="invite-info">
          <p>💡 가입하면 동아리의 모든 활동에 참여할 수 있어요</p>
          <p>🔒 언제든지 탈퇴할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
};

export default InviteAccept;
