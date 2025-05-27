import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ClubInvite.css';

const ClubInvite = () => {
  const { clubId } = useParams(); // URL에서 clubId 추출
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 초대 링크 생성
  const generateInviteLink = async () => {
    setLoading(true);
    setError('');
    const token = sessionStorage.getItem('userToken'); // sessionStorage에서 토큰 가져오기

    
    try {
        const response = await axios.post(
            `http://localhost:8080/api/invite/clubs/${clubId}`,
            {},
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
      
      if (response.data.success) {
        setInviteLink(response.data.data.link);
      } else {
        setError('초대 링크 생성에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 클립보드에 복사
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 메시지 사라짐
    } catch (err) {
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  // 카카오톡 공유 (실제 카카오 SDK 연동 필요)
  const shareToKakao = () => {
    // 실제로는 카카오 SDK 설정 후 사용
    const message = `🎵 Rhythmeet 동아리에 초대합니다!\n\n아래 링크를 클릭해서 참여해주세요:\n${inviteLink}`;
    
    // 임시로 클립보드 복사 + 안내
    navigator.clipboard.writeText(message);
    alert('카카오톡에 붙여넣기할 메시지가 복사되었습니다!\n카카오톡을 열어서 붙여넣기 해주세요.');
  };

  return (
    <div className="club-invite-container">
      <div className="invite-card">
        <h1>🎵 동아리 초대하기</h1>
        <p className="club-info">동아리 ID: {clubId}</p>
        
        {!inviteLink ? (
          <div className="generate-section">
            <p>친구들을 동아리에 초대해보세요!</p>
            <button 
              className="generate-btn"
              onClick={generateInviteLink}
              disabled={loading}
            >
              {loading ? '생성 중...' : '초대 링크 생성하기'}
            </button>
          </div>
        ) : (
          <div className="link-section">
            <h3>초대 링크가 생성되었습니다! 🎉</h3>
            <div className="link-display">
              <input 
                type="text" 
                value={inviteLink} 
                readOnly 
                className="link-input"
              />
              <button 
                className="copy-btn"
                onClick={copyToClipboard}
              >
                {copied ? '복사됨!' : '복사'}
              </button>
            </div>
            
            <div className="share-buttons">
              <button className="kakao-btn" onClick={shareToKakao}>
                📱 카카오톡으로 공유
              </button>
              <button className="new-link-btn" onClick={generateInviteLink}>
                🔄 새 링크 생성
              </button>
            </div>
            
            <div className="link-info">
              <p>💡 이 링크는 7일 후 만료됩니다</p>
              <p>🔗 친구들이 링크를 클릭하면 자동으로 동아리에 가입됩니다</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubInvite;