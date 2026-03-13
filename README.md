# ⚡ Palli-Palli Task Tracker (빨리빨리)

> **"빨리빨리" (Palli-palli)**는 한국의 현대 문화적 특징으로, 놀라운 속도와 효율성을 상징합니다.

**Palli-Palli Task Tracker**는 단순한 할 일 목록 작성을 넘어, LLM(Groq를 통한 Llama 3)의 강력한 성능을 활용하여 사용자의 시간을 엄격하게 최적화하고 일정을 즉시 생성해 주는 AI 플래너입니다.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 주요 기능

- **🔥 한국 학생 모드 (K-Student Mode):** 극한의 생산성 모드입니다. AI가 오전 7시부터 밤 11시까지 작업을 배치하고, 휴식 시간을 최소화하며 "화이팅(Fighting)!"과 같은 강력한 동기 부여 조언을 제공합니다.
- **🧠 즉각적인 생성 (Groq AI):** Groq의 LPU 프로세서를 사용하여 복잡한 일정을 1초 미만으로 생성합니다.
- **🌍 다국어 지원:** **한국어**, **러시아어**, **영어** 인터페이스 및 생성을 완벽하게 지원합니다.
- **🎨 사이버펑크/다크 UI:** 세련된 다크 인터페이스 (Deep Black #121212 + Citrus Yellow #eab308)와 부드러운 애니메이션을 제공합니다.
- **💾 로컬 스토리지 (LocalStorage):** 생성된 계획은 브라우저에 저장되어 새로고침 후에도 유지됩니다.

## 🛠 기술 스택

### Frontend
- **프레임워크:** [Next.js 16 (App Router)](https://nextjs.org/) — 서버 사이드 렌더링 및 최신 라우팅.
- **언어:** TypeScript — 엄격한 타입 안정성.
- **스타일링:** [Tailwind CSS v4](https://tailwindcss.com/) — 빠르고 아름다운 UI 구성.
- **상태 관리:** React Hooks (`useState`, `useEffect`).

### Backend
- **프레임워크:** FastAPI — 고성능 비동기 Python 프레임워크.
- **AI 통합:** Groq SDK — `llama-3.3-70b-versatile` 모델에 대한 초저지연 액세스.
- **유효성 검사:** Pydantic — 입력 데이터 검증.

## 📂 프로젝트 구조

```bash
Palli-Palli-Task-Tracker/
├── app/                  # Next.js 프론트엔드 (App Router)
│   ├── page.tsx          # 메인 페이지 및 UI 로직
│   ├── layout.tsx        # 글로벌 레이아웃 및 폰트
│   └── globals.css       # Tailwind 스타일
├── backend/              # Python FastAPI 백엔드
│   ├── main.py           # API 진입점 및 프롬프트 엔지니어링
│   └── requirements.txt  # Python 의존성
└── ...
```

## 🏁 시작하기

실행을 위해서는 백엔드와 프론트엔드 각각을 위한 두 개의 터미널이 필요합니다.

### 사전 요구 사항
1. Node.js (v18+)
2. Python (v3.8+)
3. Groq Console에서 발급받은 API 키

### 1. 백엔드 설정 (Python)

```bash
# 백엔드 폴더로 이동
cd backend

# (권장) 가상 환경 생성
python -m venv venv
# 활성화:
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 루트 경로에 .env 파일을 생성하고 Groq 키 추가
# GROQ_API_KEY=gsk_...

# 서버 실행
uvicorn main:app --reload --port 8000
```

백엔드는 `http://localhost:8000`에서 실행됩니다. (API 문서: `http://localhost:8000/docs`)

### 2. 프론트엔드 설정 (Next.js)

```bash
# 프로젝트 루트 경로 (package.json이 있는 곳)

# 의존성 설치
npm install

# 개발 모드 실행
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 🧠 작동 원리

1. **입력:** 자유로운 형식으로 할 일 목록을 입력합니다.
2. **설정:** 모드(일반 또는 한국 학생), 시작/종료 시간, 언어를 선택합니다.
3. **API 호출:** 프론트엔드가 JSON 데이터를 FastAPI로 전송합니다.
4. **AI 처리:** 백엔드가 Llama 3(Groq)를 위한 복잡한 시스템 프롬프트를 구성하여 모델에게 "엄격한 한국 관리자"처럼 행동하도록 지시합니다.
5. **파싱:** 모델의 응답(JSON)을 정제하여 클라이언트로 반환합니다.
6. **렌더링:** React가 애니메이션과 함께 카드를 렌더링합니다.

## 📸 스크린샷

*(인터페이스 스크린샷을 여기에 추가하세요)*

---

### 💡 프로젝트 아이디어

이 프로젝트는 현대의 LLM이 문화적 생산성 개념을 활용하여 개인의 효율성을 높이는 일상적인 도구에 어떻게 통합될 수 있는지를 보여주기 위해 만들어졌습니다.

---

Made with ❤️ and ☕ (lots of coffee).
Fighting! (화이팅!)# Palli-Palli-task-tracker
