# 사주팔자 분석 프로그램

사주팔자는 동양 철학에 기반한 운명 해석 체계로, 태어난 년, 월, 일, 시의 천간(天干)과 지지(地支)를 분석하여 개인의 성격, 운세, 적성 등을 파악하는 프로그램입니다.

## 주요 기능

1. 사용자 정보 입력 시스템
   - 생년월일시 입력 (양력/음력 선택)
   - 음력 날짜 변환
   - 성별 정보 입력
   - 태어난 지역 정보

2. 사주 명식 계산 엔진
   - 4기둥(년주, 월주, 일주, 시주) 계산
   - 천간과 지지 조합 생성
   - 윤달 처리

3. 분석 시스템
   - 오행 분석
   - 십이운성 분석
   - 신살 분석
   - 대운 및 세운 계산

4. 결과 표시 및 해석
   - 사주팔자 차트 시각화
   - 성격 및 기질 분석
   - 직업 적성 분석
   - 건강 관련 정보
   - 대인관계 및 궁합 정보
   - 시기별 운세 정보

## 기술 스택

- Frontend: HTML5, CSS3, JavaScript
- Backend: Python
- Database: SQLite
- API: RESTful API

## 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/yourusername/saju-analysis.git
```

2. 의존성 설치
```bash
pip install -r requirements.txt
```

3. 서버 실행
```bash
python src/main.py
```

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 