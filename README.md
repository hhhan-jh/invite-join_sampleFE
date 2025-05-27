# Rhythmeet 동아리 초대 시스템 예제코드

이 프로젝트는 음악 동아리 **Rhythmeet**의 초대 링크 시스템을 구현한 웹 애플리케이션입니다. 동아리 초대 링크 생성 - 링크 클릭으로 초대장 열기 - 가입 수락 버튼 클릭으로 동아리 가입 3가지 과정을 거칩니다.

## 페이지 구성 및 기능

### 1. 초대 링크 생성 페이지 (`/club/:clubId/invite`)

동아리 관리자나 멤버가 새로운 멤버를 초대하기 위한 링크를 생성하는 페이지입니다.

**핵심 코드:**
```javascript
// 초대 링크 생성 함수
const generateInviteLink = async () => {
  setLoading(true);
  setError('');
  const token = sessionStorage.getItem('userToken');
  
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
```

**주요 기능:**
- JWT 토큰을 사용한 인증된 사용자만 접근 가능
- 동아리 ID를 URL 파라미터로 받아 특정 동아리의 초대 링크 생성
- 생성된 링크의 클립보드 복사 기능
- 카카오톡 공유 기능 (메시지 템플릿 복사)
- 새로운 링크 재생성 기능
- 링크 만료 정보 표시 (7일)

### 2. 초대 수락 페이지 (`/invite/accept?code=xxx`)

초대 링크를 클릭한 사용자가 동아리 정보를 확인하고 가입을 결정하는 페이지입니다.

**핵심 코드:**
```javascript
// 동아리 가입 처리 함수
const joinClub = async () => {
  if (!code) {
    setError('초대 코드가 없습니다.');
    return;
  }

  setLoading(true);
  setError('');
  const token = sessionStorage.getItem('userToken');
  
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
      navigate('/welcome', { 
        state: { 
          message: '동아리 가입을 축하합니다! 🎉',
          clubName: '리듬밋 동아리'
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
```

**주요 기능:**
- URL 쿼리 파라미터로 전달된 초대 코드 검증
- 동아리 정보 미리보기 (이름, 설명, 통계)
- 로딩 상태 및 에러 처리
- 가입 성공 시 환영 페이지로 자동 이동
- 취소 버튼으로 홈페이지 이동

### 3. 환영 페이지 (`/welcome`)

동아리 가입이 완료된 후 사용자를 환영하고 다음 단계를 안내하는 페이지입니다.

**핵심 코드:**
```javascript
// Confetti 애니메이션 효과
useEffect(() => {
  const timer = setTimeout(() => {
    setShowConfetti(false);
  }, 5000);
  return () => clearTimeout(timer);
}, []);

// 페이지 이동 시 전달받은 상태 정보 처리
const { message, clubName } = location.state || {
  message: '가입을 축하합니다! 🎉',
  clubName: '동아리'
};
```

**주요 기능:**
- 5초간 지속되는 Confetti 축하 애니메이션
- 이전 페이지에서 전달받은 환영 메시지 표시
- 동아리 활동 안내 (정기 모임, 합주, 커뮤니티)
- 신규 멤버를 위한 다음 단계 가이드
- 동아리 메인 페이지 또는 홈으로 이동 버튼

## API 연동

### 1. 동아리 초대 링크 생성 API

**Endpoint:** `POST /api/invite/clubs/{clubId}`

**Request Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Request Example:**
```http
POST /api/invite/clubs/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Parameters:**
- `clubId` (Path Parameter): 초대 링크를 생성할 동아리의 ID

**Response Examples:**

**성공 응답:**
```json
{
  "success": true,
  "message": "동아리 초대 링크 생성 성공",
  "data": {
    "link": "https://localhost:5173/invite/accept?code=jaCprFeFtE"
  }
}
```

**에러 응답 - 초대 권한 없음:**
```json
{
  "success": false,
  "message": "초대 권한이 없습니다",
  "errorCode": "INVALID_ACCESS"
}
```
> 동아리 초대의 경우 해당 동아리 부원만, 팀 초대의 경우 해당 팀원인 경우에만 초대 권한이 주어집니다.

**에러 응답 - 존재하지 않는 동아리:**
```json
{
  "success": false,
  "message": "동아리가 존재하지 않습니다",
  "errorCode": "CLUB_NOT_FOUND"
}
```
> 미생성, 삭제 등으로 존재하지 않는 clubId로 요청했을 때 발생하는 에러입니다.

**Response Fields:**
- `success`: API 호출 성공 여부
- `message`: 응답 메시지
- `data.link`: 생성된 초대 링크 URL (성공 시)
- `errorCode`: 에러 코드 (실패 시)

### 2. 동아리 가입 API

**Endpoint:** `POST /api/join/clubs`

**Request Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Request Parameters:**
```
code: {INVITE_CODE}
```

**Request Example:**
```http
POST /api/join/clubs?code=jaCprFeFtE
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Parameters:**
- `code` (Query Parameter): 초대 링크에 포함된 초대 코드

**Response Examples:**

**성공 응답:**
```json
{
  "success": true,
  "message": "동아리 가입 성공"
}
```

**에러 응답 - 중복 가입:**
```json
{
  "success": false,
  "message": "이미 가입한 동아리입니다",
  "errorCode": "INVALID_ACCESS"
}
```
> 이미 해당 동아리에 가입한 경우 발생하는 에러입니다.

**에러 응답 - 유효하지 않은 초대 코드:**
```json
{
  "success": false,
  "message": "유효하지 않은 초대 코드입니다",
  "errorCode": "INVALID_ACCESS"
}
```
> 코드 만료, 가입 요청 타입 불일치(ex. 팀 전용으로 발급된 코드인데 동아리 가입으로 요청) 등으로 발생하는 에러입니다.

**Response Fields:**
- `success`: API 호출 성공 여부
- `message`: 응답 메시지 (성공/실패 사유)
- `errorCode`: 에러 코드 (실패 시)

## 기술 스택

- **Frontend:** React, React Router, Axios
- **Backend:** Spring Boot, Spring Security
- **Authentication:** JWT (JSON Web Token)
- **Styling:** CSS3 with animations and responsive design

## 시연 영상
https://github.com/user-attachments/assets/b8b60e49-ad6a-4a43-afbf-2044773ad75f

