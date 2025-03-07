document.addEventListener('DOMContentLoaded', function() {
    const sajuForm = document.getElementById('sajuForm');
    const resultSection = document.querySelector('.result-section');
    const submitButton = document.querySelector('button[type="submit"]');
    const scrollToTopButton = document.getElementById('scrollToTop');
    const downloadPDFButton = document.getElementById('downloadPDF');

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.display = 'block';
            downloadPDFButton.style.display = 'block';
        } else {
            scrollToTopButton.style.display = 'none';
            downloadPDFButton.style.display = 'none';
        }
    });

    // 맨 위로 가기 버튼 클릭 이벤트
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // PDF 다운로드 버튼 클릭 이벤트
    downloadPDFButton.addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const element = document.querySelector('.result-section');
        const opt = {
            margin: 1,
            filename: `${name}_사주분석.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // PDF 생성 전에 로딩 상태 표시
        downloadPDFButton.disabled = true;
        downloadPDFButton.textContent = '⏳';

        // PDF 생성
        html2pdf().set(opt).from(element).save().then(() => {
            // PDF 생성 완료 후 버튼 상태 복구
            downloadPDFButton.disabled = false;
            downloadPDFButton.textContent = '📄';
        });
    });

    // 입력값 검증 함수
    function validateDate(year, month, day) {
        const date = new Date(year, month - 1, day);
        return date.getDate() === day && date.getMonth() === month - 1;
    }

    // 로딩 상태 표시 함수
    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? '분석 중...' : '분석하기';
    }

    // 천간(天干) 배열
    const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    // 지지(地支) 배열
    const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    // 오행(五行) 배열
    const fiveElements = ['木', '火', '土', '金', '水'];

    // 연도 천간 계산
    function calculateYearStem(year) {
        return heavenlyStems[(year - 4) % 10];
    }

    // 연도 지지 계산
    function calculateYearBranch(year) {
        return earthlyBranches[(year - 4) % 12];
    }

    // 월 천간 계산
    function calculateMonthStem(year, month) {
        const yearStemIndex = (year - 4) % 10;
        const monthOffset = (yearStemIndex % 5) * 2;
        return heavenlyStems[(monthOffset + month - 1) % 10];
    }

    // 월 지지 계산
    function calculateMonthBranch(month) {
        return earthlyBranches[(month + 1) % 12];
    }

    // 일 천간 계산 (정확한 버전)
    function calculateDayStem(year, month, day) {
        // 1900년 1월 1일은 '己亥'일이므로, 이를 기준으로 계산
        const baseYear = 1900;
        const baseMonth = 1;
        const baseDay = 1;
        const baseStemIndex = 5; // 己는 천간 배열의 5번째

        // 날짜 차이 계산
        const date1 = new Date(year, month - 1, day);
        const date2 = new Date(baseYear, baseMonth - 1, baseDay);
        const diffDays = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));

        // 천간 인덱스 계산 (음수 처리 포함)
        let stemIndex = (baseStemIndex + diffDays) % 10;
        if (stemIndex < 0) stemIndex += 10;

        return heavenlyStems[stemIndex];
    }

    // 일 지지 계산 (정확한 버전)
    function calculateDayBranch(year, month, day) {
        // 1900년 1월 1일은 '己亥'일이므로, 이를 기준으로 계산
        const baseYear = 1900;
        const baseMonth = 1;
        const baseDay = 1;
        const baseBranchIndex = 11; // 亥는 지지 배열의 11번째

        // 날짜 차이 계산
        const date1 = new Date(year, month - 1, day);
        const date2 = new Date(baseYear, baseMonth - 1, baseDay);
        const diffDays = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));

        // 지지 인덱스 계산 (음수 처리 포함)
        let branchIndex = (baseBranchIndex + diffDays) % 12;
        if (branchIndex < 0) branchIndex += 12;

        return earthlyBranches[branchIndex];
    }

    // 시간 천간 계산
    function calculateHourStem(hour) {
        return heavenlyStems[Math.floor(hour / 2) % 10];
    }

    // 시간 지지 계산
    function calculateHourBranch(hour) {
        return earthlyBranches[Math.floor(hour / 2) % 12];
    }

    // 오행 계산
    function calculateFiveElement(stem) {
        const stemIndex = heavenlyStems.indexOf(stem);
        return fiveElements[Math.floor(stemIndex / 2)];
    }

    // 사주 계산
    function calculateSaju(year, month, day, hour) {
        return {
            year: {
                stem: calculateYearStem(year),
                branch: calculateYearBranch(year),
                element: calculateFiveElement(calculateYearStem(year))
            },
            month: {
                stem: calculateMonthStem(year, month),
                branch: calculateMonthBranch(month),
                element: calculateFiveElement(calculateMonthStem(year, month))
            },
            day: {
                stem: calculateDayStem(year, month, day),
                branch: calculateDayBranch(year, month, day),
                element: calculateFiveElement(calculateDayStem(year, month, day))
            },
            hour: {
                stem: calculateHourStem(hour),
                branch: calculateHourBranch(hour),
                element: calculateFiveElement(calculateHourStem(hour))
            }
        };
    }

    // 오행 분석
    function analyzeFiveElements(saju) {
        const elements = {
            '木': 0,
            '火': 0,
            '土': 0,
            '金': 0,
            '水': 0
        };

        // 천간의 오행 분석
        Object.values(saju).forEach(pillar => {
            elements[calculateFiveElement(pillar.stem)]++;
        });

        // 지지의 오행 분석
        const branchElements = {
            '子': '水',
            '丑': '土',
            '寅': '木',
            '卯': '木',
            '辰': '土',
            '巳': '火',
            '午': '火',
            '未': '土',
            '申': '金',
            '酉': '金',
            '戌': '土',
            '亥': '水'
        };

        Object.values(saju).forEach(pillar => {
            elements[branchElements[pillar.branch]] += 0.5;
        });

        // 결과 정규화
        const total = Object.values(elements).reduce((a, b) => a + b, 0);
        Object.keys(elements).forEach(key => {
            elements[key] = Math.round((elements[key] / total) * 100) / 100;
        });

        return elements;
    }

    // 천복 강도 계산
    function calculateFortuneStrength(elements) {
        const total = Object.values(elements).reduce((a, b) => a + b, 0);
        const maxElement = Math.max(...Object.values(elements));
        return (maxElement / total) * 100;
    }

    // 천복 분석
    function analyzeHeavenlyFortune(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const fortunePatterns = {
            '木': '창의적 재물',
            '火': '열정적 재물',
            '土': '안정적 재물',
            '金': '체계적 재물',
            '水': '지적 재물'
        };
        
        return {
            type: fortunePatterns[dominantElement],
            strength: calculateFortuneStrength(elements),
            timing: determineFortuneTiming(saju)
        };
    }

    // 천시 분석
    function analyzeHeavenlyTiming(saju) {
        const yearStem = saju.year.stem;
        const monthStem = saju.month.stem;
        const dayStem = saju.day.stem;
        const hourStem = saju.hour.stem;
        
        return {
            majorTiming: determineMajorTiming(yearStem),
            minorTiming: determineMinorTiming(monthStem, dayStem),
            dailyTiming: determineDailyTiming(hourStem)
        };
    }

    // 주요 시기 결정
    function determineMajorTiming(yearStem) {
        const timingPatterns = {
            '甲': '20-30대',
            '乙': '20-30대',
            '丙': '30-40대',
            '丁': '30-40대',
            '戊': '40-50대',
            '己': '40-50대',
            '庚': '50-60대',
            '辛': '50-60대',
            '壬': '60-70대',
            '癸': '60-70대'
        };
        return timingPatterns[yearStem] || '전생애';
    }

    // 부가 시기 결정
    function determineMinorTiming(monthStem, dayStem) {
        const timingPatterns = {
            '甲': '봄',
            '乙': '봄',
            '丙': '여름',
            '丁': '여름',
            '戊': '사계절',
            '己': '사계절',
            '庚': '가을',
            '辛': '가을',
            '壬': '겨울',
            '癸': '겨울'
        };
        return `${timingPatterns[monthStem] || '사계절'}, ${timingPatterns[dayStem] || '사계절'}`;
    }

    // 일일 시기 결정
    function determineDailyTiming(hourStem) {
        const timingPatterns = {
            '甲': '아침',
            '乙': '아침',
            '丙': '낮',
            '丁': '낮',
            '戊': '하루종일',
            '己': '하루종일',
            '庚': '저녁',
            '辛': '저녁',
            '壬': '밤',
            '癸': '밤'
        };
        return timingPatterns[hourStem] || '하루종일';
    }

    // 천복 시기 결정
    function determineFortuneTiming(saju) {
        const yearStem = saju.year.stem;
        const timingPatterns = {
            '甲': '봄철',
            '乙': '봄철',
            '丙': '여름철',
            '丁': '여름철',
            '戊': '사계절',
            '己': '사계절',
            '庚': '가을철',
            '辛': '가을철',
            '壬': '겨울철',
            '癸': '겨울철'
        };
        return timingPatterns[yearStem] || '사계절';
    }

    // 천수 계산 함수 추가
    function calculateLongevity(elements) {
        const total = Object.values(elements).reduce((a, b) => a + b, 0);
        const maxElement = Math.max(...Object.values(elements));
        const minElement = Math.min(...Object.values(elements));
        
        // 균형도 계산 (0-100)
        const balance = ((maxElement - minElement) / total) * 100;
        
        // 수명 예측 (기본 80세 기준)
        let baseAge = 80;
        
        // 균형도에 따른 수정
        if (balance > 70) {
            baseAge -= 10; // 균형이 많이 깨진 경우
        } else if (balance > 50) {
            baseAge -= 5; // 약간의 불균형
        } else if (balance < 20) {
            baseAge += 5; // 매우 균형 잡힌 경우
        }
        
        return {
            age: baseAge,
            balance: 100 - balance,
            health: balance < 50 ? '양호' : '주의 필요'
        };
    }

    // 천수 분석 함수 수정
    function analyzeHeavenlyLongevity(saju) {
        const elements = analyzeFiveElements(saju);
        const healthPatterns = {
            '木': { organs: ['간', '담낭'], strength: 0.8 },
            '火': { organs: ['심장', '소장'], strength: 0.7 },
            '土': { organs: ['위', '비장'], strength: 0.9 },
            '金': { organs: ['폐', '대장'], strength: 0.6 },
            '水': { organs: ['신장', '방광'], strength: 0.7 }
        };
        
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const longevity = calculateLongevity(elements);
        
        return {
            healthPattern: healthPatterns[dominantElement],
            longevity: longevity,
            healthAdvice: generateHealthAdvice(dominantElement, longevity)
        };
    }

    // 건강 조언 생성 함수 추가
    function generateHealthAdvice(dominantElement, longevity) {
        const advice = {
            '木': '간과 담낭 건강에 특히 주의하세요. 스트레스 관리가 중요합니다.',
            '火': '심장과 소장 건강에 주의하세요. 과도한 열정을 조절하세요.',
            '土': '위와 비장 건강에 주의하세요. 규칙적인 식사가 중요합니다.',
            '金': '폐와 대장 건강에 주의하세요. 호흡 운동이 도움이 됩니다.',
            '水': '신장과 방광 건강에 주의하세요. 충분한 수분 섭취가 중요합니다.'
        };
        
        let baseAdvice = advice[dominantElement];
        
        // 균형도에 따른 추가 조언
        if (longevity.balance < 50) {
            baseAdvice += ' 오행의 균형이 많이 깨져있어 전반적인 건강 관리가 필요합니다.';
        } else if (longevity.balance < 70) {
            baseAdvice += ' 약간의 불균형이 있으니 건강에 더욱 신경 쓰세요.';
        } else {
            baseAdvice += ' 오행의 균형이 잘 잡혀있어 건강한 생활이 가능합니다.';
        }
        
        return baseAdvice;
    }

    // 천재 분석
    function analyzeHeavenlyTalent(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const talentPatterns = {
            '木': {
                type: '창의적 재능',
                fields: ['예술', '디자인', '교육'],
                strength: 0.8
            },
            '火': {
                type: '리더십 재능',
                fields: ['경영', '영업', '마케팅'],
                strength: 0.7
            },
            '土': {
                type: '안정적 재능',
                fields: ['행정', '서비스', '관리'],
                strength: 0.9
            },
            '金': {
                type: '분석적 재능',
                fields: ['법률', '금융', '회계'],
                strength: 0.8
            },
            '水': {
                type: '지적 재능',
                fields: ['연구', '분석', '컨설팅'],
                strength: 0.7
            }
        };
        
        return talentPatterns[dominantElement];
    }

    // 천명 분석
    function analyzeHeavenlyDestiny(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const destinyPatterns = {
            '木': {
                purpose: '창의와 혁신',
                mission: '새로운 가치 창출',
                impact: '사회적 변화'
            },
            '火': {
                purpose: '리더십과 영향력',
                mission: '사람들의 이끌기',
                impact: '조직 발전'
            },
            '土': {
                purpose: '안정과 조화',
                mission: '사회적 안정',
                impact: '공동체 발전'
            },
            '金': {
                purpose: '정의와 규율',
                mission: '사회적 정의 실현',
                impact: '제도 개선'
            },
            '水': {
                purpose: '지혜와 통찰',
                mission: '지식의 전파',
                impact: '문화 발전'
            }
        };
        
        return destinyPatterns[dominantElement];
    }

    // 천덕 분석
    function analyzeHeavenlyVirtue(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const virtuePatterns = {
            '木': {
                type: '창의적 덕',
                benefactors: ['예술가', '교육자'],
                timing: '봄철'
            },
            '火': {
                type: '열정적 덕',
                benefactors: ['리더', '기업가'],
                timing: '여름철'
            },
            '土': {
                type: '안정적 덕',
                benefactors: ['행정가', '관리자'],
                timing: '사계절'
            },
            '金': {
                type: '정의적 덕',
                benefactors: ['법조인', '금융가'],
                timing: '가을철'
            },
            '水': {
                type: '지혜적 덕',
                benefactors: ['학자', '연구자'],
                timing: '겨울철'
            }
        };
        
        return virtuePatterns[dominantElement];
    }

    // 천요 분석
    function analyzeHeavenlyWeakness(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const weaknessPatterns = {
            '木': {
                type: '과도한 창의성',
                risk: '불안정성',
                prevention: '안정적 생활'
            },
            '火': {
                type: '과도한 열정',
                risk: '소진',
                prevention: '휴식과 조절'
            },
            '土': {
                type: '과도한 안정성',
                risk: '보수성',
                prevention: '새로운 도전'
            },
            '金': {
                type: '과도한 완벽주의',
                risk: '스트레스',
                prevention: '유연한 사고'
            },
            '水': {
                type: '과도한 지적탐구',
                risk: '고립',
                prevention: '대인관계'
            }
        };
        
        return weaknessPatterns[dominantElement];
    }

    // 천인 분석
    function analyzeHeavenlyAuthority(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const authorityPatterns = {
            '木': {
                type: '창의적 권위',
                field: '예술/교육',
                strength: 0.8
            },
            '火': {
                type: '리더십 권위',
                field: '경영/정치',
                strength: 0.7
            },
            '土': {
                type: '안정적 권위',
                field: '행정/관리',
                strength: 0.9
            },
            '金': {
                type: '법적 권위',
                field: '법률/금융',
                strength: 0.8
            },
            '水': {
                type: '지적 권위',
                field: '학문/연구',
                strength: 0.7
            }
        };
        
        return authorityPatterns[dominantElement];
    }

    // 천부 분석
    function analyzeHeavenlyGift(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const giftPatterns = {
            '木': {
                type: '창의적 재능',
                manifestation: '예술적 표현',
                development: '창의성 개발'
            },
            '火': {
                type: '리더십 재능',
                manifestation: '사람 이끌기',
                development: '의사소통 능력'
            },
            '土': {
                type: '안정적 재능',
                manifestation: '조직 관리',
                development: '책임감'
            },
            '金': {
                type: '분석적 재능',
                manifestation: '문제 해결',
                development: '논리적 사고'
            },
            '水': {
                type: '지적 재능',
                manifestation: '연구 분석',
                development: '탐구 정신'
            }
        };
        
        return giftPatterns[dominantElement];
    }

    // 천상 분석
    function analyzeHeavenlyAppearance(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const appearancePatterns = {
            '木': {
                type: '창의적 외모',
                features: ['긴 체형', '활기찬 표정'],
                impression: '독창적'
            },
            '火': {
                type: '열정적 외모',
                features: ['강인한 체형', '밝은 표정'],
                impression: '활기찬'
            },
            '土': {
                type: '안정적 외모',
                features: ['균형잡힌 체형', '차분한 표정'],
                impression: '신뢰감'
            },
            '金': {
                type: '단정한 외모',
                features: ['정돈된 체형', '진지한 표정'],
                impression: '단정한'
            },
            '水': {
                type: '지적 외모',
                features: ['우아한 체형', '차분한 표정'],
                impression: '지적'
            }
        };
        
        return appearancePatterns[dominantElement];
    }

    // 천식 분석
    function analyzeHeavenlySustenance(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const sustenancePatterns = {
            '木': {
                type: '창의적 식록',
                source: '예술/교육',
                stability: 0.8
            },
            '火': {
                type: '열정적 식록',
                source: '경영/영업',
                stability: 0.7
            },
            '土': {
                type: '안정적 식록',
                source: '행정/관리',
                stability: 0.9
            },
            '金': {
                type: '체계적 식록',
                source: '법률/금융',
                stability: 0.8
            },
            '水': {
                type: '지적 식록',
                source: '연구/컨설팅',
                stability: 0.7
            }
        };
        
        return sustenancePatterns[dominantElement];
    }

    // 천귀 분석
    function analyzeHeavenlyNobility(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const nobilityPatterns = {
            '木': {
                type: '창의적 귀함',
                status: '예술가/교육자',
                influence: 0.8
            },
            '火': {
                type: '리더십 귀함',
                status: '경영자/정치인',
                influence: 0.7
            },
            '土': {
                type: '안정적 귀함',
                status: '행정가/관리자',
                influence: 0.9
            },
            '金': {
                type: '법적 귀함',
                status: '법조인/금융가',
                influence: 0.8
            },
            '水': {
                type: '지적 귀함',
                status: '학자/연구자',
                influence: 0.7
            }
        };
        
        return nobilityPatterns[dominantElement];
    }

    // 천살 분석
    function analyzeHeavenlyObstacle(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const obstaclePatterns = {
            '木': {
                type: '창의적 장애',
                challenge: '불안정성',
                solution: '안정적 접근'
            },
            '火': {
                type: '열정적 장애',
                challenge: '성급함',
                solution: '신중한 판단'
            },
            '土': {
                type: '안정적 장애',
                challenge: '보수성',
                solution: '새로운 시도'
            },
            '金': {
                type: '완벽주의 장애',
                challenge: '과도한 요구',
                solution: '유연한 사고'
            },
            '水': {
                type: '지적 장애',
                challenge: '과도한 분석',
                solution: '직관적 판단'
            }
        };
        
        return obstaclePatterns[dominantElement];
    }

    // 천권 분석
    function analyzeHeavenlyPower(saju) {
        const elements = analyzeFiveElements(saju);
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const powerPatterns = {
            '木': {
                type: '창의적 권력',
                domain: '예술/교육',
                strength: 0.8
            },
            '火': {
                type: '리더십 권력',
                domain: '경영/정치',
                strength: 0.7
            },
            '土': {
                type: '안정적 권력',
                domain: '행정/관리',
                strength: 0.9
            },
            '金': {
                type: '법적 권력',
                domain: '법률/금융',
                strength: 0.8
            },
            '水': {
                type: '지적 권력',
                domain: '학문/연구',
                strength: 0.7
            }
        };
        
        return powerPatterns[dominantElement];
    }

    // 천간합 분석
    function analyzeHeavenlyStemCombination(saju) {
        const stems = Object.values(saju).map(pillar => pillar.stem);
        const combinations = {
            '甲己': '토합',
            '乙庚': '금합',
            '丙辛': '수합',
            '丁壬': '목합',
            '戊癸': '화합'
        };
        
        let foundCombinations = [];
        for (let i = 0; i < stems.length; i++) {
            for (let j = i + 1; j < stems.length; j++) {
                const combination = stems[i] + stems[j];
                if (combinations[combination]) {
                    foundCombinations.push({
                        stems: combination,
                        type: combinations[combination]
                    });
                }
            }
        }
        
        return foundCombinations;
    }

    // 천간충 분석
    function analyzeHeavenlyStemConflict(saju) {
        const stems = Object.values(saju).map(pillar => pillar.stem);
        const conflicts = {
            '甲庚': '목금충',
            '乙辛': '목금충',
            '丙壬': '화수충',
            '丁癸': '화수충',
            '戊甲': '토목충',
            '己乙': '토목충',
            '庚丙': '금화충',
            '辛丁': '금화충',
            '壬戊': '수토충',
            '癸己': '수토충'
        };
        
        let foundConflicts = [];
        for (let i = 0; i < stems.length; i++) {
            for (let j = i + 1; j < stems.length; j++) {
                const combination = stems[i] + stems[j];
                if (conflicts[combination]) {
                    foundConflicts.push({
                        stems: combination,
                        type: conflicts[combination]
                    });
                }
            }
        }
        
        return foundConflicts;
    }

    // 기본 정보 생성 함수들
    function generateBasicInfo(dominantElement) {
        const elementInfo = {
            '木': {
                name: '목(木)',
                nature: '봄의 기운',
                characteristics: '성장과 발전',
                direction: '동쪽',
                season: '봄',
                color: '청색/녹색'
            },
            '火': {
                name: '화(火)',
                nature: '여름의 기운',
                characteristics: '열정과 확장',
                direction: '남쪽',
                season: '여름',
                color: '적색/주황색'
            },
            '土': {
                name: '토(土)',
                nature: '중앙의 기운',
                characteristics: '안정과 조화',
                direction: '중앙',
                season: '사계절',
                color: '황색/갈색'
            },
            '金': {
                name: '금(金)',
                nature: '가을의 기운',
                characteristics: '결실과 정의',
                direction: '서쪽',
                season: '가을',
                color: '백색/은색'
            },
            '水': {
                name: '수(水)',
                nature: '겨울의 기운',
                characteristics: '지혜와 통찰',
                direction: '북쪽',
                season: '겨울',
                color: '흑색/청색'
            }
        };

        const info = elementInfo[dominantElement];
        return `당신의 사주는 ${info.name}가 가장 강한 형상입니다.
${info.nature}이 두드러지며, ${info.characteristics}의 기운이 강합니다.
방위로는 ${info.direction}이 길방이며, ${info.season}에 기운이 가장 왕성합니다.
${info.color}계열이 당신의 행운의 색이 됩니다.
이는 당신이 ${info.characteristics}의 성질을 타고났음을 의미합니다.`;
    }

    function generatePersonality(dominantElement) {
        const personalityInfo = {
            '木': {
                core: '창의적이고 독립적인 성격으로, 새로운 아이디어를 제시하는 것을 좋아합니다.',
                strength: '혁신적인 사고와 진취적인 태도가 큰 장점입니다.',
                challenge: '때로는 너무 이상적이거나 고집스러울 수 있습니다.',
                growth: '안정성과 현실성을 조금 더 고려하면 좋습니다.',
                potential: '예술적 재능과 창의적 리더십이 잠재되어 있습니다.'
            },
            '火': {
                core: '열정적이고 적극적인 성격으로, 리더십이 뛰어납니다.',
                strength: '강한 카리스마와 영향력 있는 언변이 특징입니다.',
                challenge: '감정적 기복이 있을 수 있으며, 때로 성급할 수 있습니다.',
                growth: '차분함과 인내심을 기르면 더욱 좋습니다.',
                potential: '타인을 이끌고 영감을 주는 능력이 있습니다.'
            },
            '土': {
                core: '안정적이고 신중한 성격으로, 책임감이 강합니다.',
                strength: '믿음직하고 성실하며 조직력이 뛰어납니다.',
                challenge: '변화를 두려워하고 보수적일 수 있습니다.',
                growth: '새로운 도전에 더 열린 마음을 가지면 좋습니다.',
                potential: '관리와 조정 능력이 뛰어나며 신뢰를 얻기 쉽습니다.'
            },
            '金': {
                core: '정직하고 원칙적인 성격으로, 완벽을 추구합니다.',
                strength: '정확하고 체계적이며 분석력이 뛰어납니다.',
                challenge: '지나친 완벽주의로 스트레스를 받을 수 있습니다.',
                growth: '유연성을 기르고 실수를 받아들이는 연습이 필요합니다.',
                potential: '뛰어난 판단력과 정의감으로 신뢰를 얻습니다.'
            },
            '水': {
                core: '지적이고 통찰력 있는 성격으로, 깊이 있는 사고를 합니다.',
                strength: '높은 지적 능력과 직관력이 돋보입니다.',
                challenge: '때로는 너무 깊이 생각하여 결정을 미룰 수 있습니다.',
                growth: '실천력과 결단력을 기르면 더욱 좋습니다.',
                potential: '학문적 성취와 창의적 문제 해결 능력이 뛰어납니다.'
            }
        };

        const info = personalityInfo[dominantElement];
        return Object.values(info).join('\n');
    }

    function generateCareer(dominantElement) {
        const careerInfo = {
            '木': {
                suitable: '예술, 디자인, 교육, 창의적 분야가 적성에 잘 맞습니다.',
                detail: '특히 창의력을 필요로 하는 직업이 추천됩니다.',
                examples: '디자이너, 교사, 작가, 건축가, 환경 컨설턴트 등이 유망합니다.',
                timing: '오전 시간대에 업무 효율이 가장 높습니다.',
                advice: '자유로운 업무 환경에서 능력을 최대한 발휘할 수 있습니다.'
            },
            '火': {
                suitable: '경영, 영업, 마케팅, 리더십 분야가 적성에 잘 맞습니다.',
                detail: '사람들과 소통하고 이끄는 직업이 추천됩니다.',
                examples: 'CEO, 영업관리자, 마케팅 디렉터, 연예인, 정치인 등이 유망합니다.',
                timing: '오후 시간대에 업무 효율이 가장 높습니다.',
                advice: '활동적이고 역동적인 환경에서 최고의 성과를 낼 수 있습니다.'
            },
            '土': {
                suitable: '행정, 서비스, 관리, 부동산 분야가 적성에 잘 맞습니다.',
                detail: '안정적이고 체계적인 직업이 추천됩니다.',
                examples: '공무원, 부동산 전문가, 프로젝트 매니저, 보험설계사 등이 유망합니다.',
                timing: '규칙적인 업무 시간에 효율이 가장 높습니다.',
                advice: '안정적이고 체계적인 환경에서 능력을 발휘할 수 있습니다.'
            },
            '金': {
                suitable: '법률, 금융, 회계, IT 분야가 적성에 잘 맞습니다.',
                detail: '정확성과 분석력을 필요로 하는 직업이 추천됩니다.',
                examples: '변호사, 회계사, 금융분석가, 프로그래머 등이 유망합니다.',
                timing: '이른 아침 시간대에 업무 효율이 가장 높습니다.',
                advice: '체계적이고 전문적인 환경에서 최고의 성과를 낼 수 있습니다.'
            },
            '水': {
                suitable: '연구, 분석, 컨설팅, 의료 분야가 적성에 잘 맞습니다.',
                detail: '깊이 있는 전문성을 필요로 하는 직업이 추천됩니다.',
                examples: '연구원, 의사, 심리상담사, 투자분석가 등이 유망합니다.',
                timing: '늦은 저녁 시간대에 업무 효율이 가장 높습니다.',
                advice: '독립적이고 전문적인 환경에서 능력을 발휘할 수 있습니다.'
            }
        };

        const info = careerInfo[dominantElement];
        return Object.values(info).join('\n');
    }

    function generateHealth(dominantElement) {
        const healthInfo = {
            '木': {
                organs: '간, 담낭, 근육, 관절과 특히 관련이 있습니다.',
                strengths: '빠른 회복력과 유연성이 장점입니다.',
                weaknesses: '스트레스에 민감하고 근육 긴장이 있을 수 있습니다.',
                exercise: '요가, 스트레칭, 등산이 건강에 도움이 됩니다.',
                advice: '규칙적인 운동과 충분한 휴식이 필요합니다.'
            },
            '火': {
                organs: '심장, 소장, 혈액순환과 특히 관련이 있습니다.',
                strengths: '높은 에너지와 활력이 장점입니다.',
                weaknesses: '혈압과 심장 관련 주의가 필요할 수 있습니다.',
                exercise: '유산소 운동, 수영, 달리기가 건강에 도움이 됩니다.',
                advice: '과로를 피하고 적절한 운동이 필요합니다.'
            },
            '土': {
                organs: '위, 비장, 소화기관과 특히 관련이 있습니다.',
                strengths: '안정적인 신진대사가 장점입니다.',
                weaknesses: '소화 기능이 약할 수 있습니다.',
                exercise: '가벼운 산책, 태극권이 건강에 도움이 됩니다.',
                advice: '규칙적인 식사와 적절한 영양 섭취가 중요합니다.'
            },
            '金': {
                organs: '폐, 대장, 호흡기관과 특히 관련이 있습니다.',
                strengths: '강한 면역력이 장점입니다.',
                weaknesses: '호흡기 질환에 주의가 필요할 수 있습니다.',
                exercise: '호흡 운동, 걷기가 건강에 도움이 됩니다.',
                advice: '깨끗한 공기와 규칙적인 운동이 필요합니다.'
            },
            '水': {
                organs: '신장, 방광, 내분비계와 특히 관련이 있습니다.',
                strengths: '적응력과 회복력이 장점입니다.',
                weaknesses: '신장 기능과 수분 균형에 주의가 필요할 수 있습니다.',
                exercise: '수영, 요가가 건강에 도움이 됩니다.',
                advice: '충분한 수분 섭취와 적절한 휴식이 중요합니다.'
            }
        };

        const info = healthInfo[dominantElement];
        return Object.values(info).join('\n');
    }

    function generateRelationships(dominantElement) {
        const relationshipInfo = {
            '木': {
                style: '독립적이고 창의적인 관계를 추구합니다.',
                strength: '새로운 아이디어와 활동을 통해 관계를 발전시킵니다.',
                challenge: '때로는 너무 독립적이어서 상대방을 소외시킬 수 있습니다.',
                ideal: '자유로운 소통과 성장이 가능한 관계가 이상적입니다.',
                advice: '상대방의 안정성 욕구도 고려해야 합니다.'
            },
            '火': {
                style: '열정적이고 적극적인 관계를 추구합니다.',
                strength: '강한 카리스마로 관계를 리드합니다.',
                challenge: '때로는 너무 강렬해서 상대방을 부담스럽게 할 수 있습니다.',
                ideal: '활동적이고 자극이 있는 관계가 이상적입니다.',
                advice: '상대방의 페이스도 존중해야 합니다.'
            },
            '土': {
                style: '안정적이고 신뢰감 있는 관계를 추구합니다.',
                strength: '믿음직하고 책임감 있는 태도로 관계를 유지합니다.',
                challenge: '때로는 너무 보수적이어서 관계가 정체될 수 있습니다.',
                ideal: '상호 신뢰와 안정감이 있는 관계가 이상적입니다.',
                advice: '새로운 경험도 함께 시도해보세요.'
            },
            '金': {
                style: '정직하고 원칙적인 관계를 추구합니다.',
                strength: '명확한 의사소통으로 관계를 발전시킵니다.',
                challenge: '때로는 너무 완벽주의적이어서 관계가 경직될 수 있습니다.',
                ideal: '서로 존중하고 이해하는 관계가 이상적입니다.',
                advice: '때로는 유연한 태도도 필요합니다.'
            },
            '水': {
                style: '지적이고 깊이 있는 관계를 추구합니다.',
                strength: '깊은 이해와 통찰로 관계를 발전시킵니다.',
                challenge: '때로는 너무 분석적이어서 감정적 교류가 부족할 수 있습니다.',
                ideal: '지적 교류와 정서적 교감이 균형 잡힌 관계가 이상적입니다.',
                advice: '감정적 표현도 중요합니다.'
            }
        };

        const info = relationshipInfo[dominantElement];
        return Object.values(info).join('\n');
    }

    function generateWealth(dominantElement) {
        const wealthInfo = {
            '木': {
                tendency: '창의적인 방법으로 재물을 얻는 경향이 있습니다.',
                strength: '새로운 기회를 잘 포착하고 도전적인 투자를 선호합니다.',
                timing: '봄철과 아침 시간대에 재물운이 강합니다.',
                advice: '안정적인 저축도 함께 고려해야 합니다.',
                potential: '창업과 프리랜서 활동에서 높은 수익이 기대됩니다.'
            },
            '火': {
                tendency: '열정적인 활동을 통해 재물을 얻는 경향이 있습니다.',
                strength: '리더십과 인맥을 통한 수익 창출이 뛰어납니다.',
                timing: '여름철과 낮 시간대에 재물운이 강합니다.',
                advice: '충동적인 지출을 조심해야 합니다.',
                potential: '영업과 마케팅 분야에서 높은 수익이 기대됩니다.'
            },
            '土': {
                tendency: '안정적인 방법으로 재물을 얻는 경향이 있습니다.',
                strength: '꾸준한 저축과 투자로 재산을 불립니다.',
                timing: '사계절 모두 안정적인 재물운이 있습니다.',
                advice: '너무 보수적인 투자는 피해야 합니다.',
                potential: '부동산과 안정적인 사업에서 높은 수익이 기대됩니다.'
            },
            '金': {
                tendency: '체계적인 방법으로 재물을 얻는 경향이 있습니다.',
                strength: '정확한 분석과 계획적인 투자가 특징입니다.',
                timing: '가을철과 저녁 시간대에 재물운이 강합니다.',
                advice: '과도한 절약은 피해야 합니다.',
                potential: '금융과 투자 분야에서 높은 수익이 기대됩니다.'
            },
            '水': {
                tendency: '지적 능력으로 재물을 얻는 경향이 있습니다.',
                strength: '깊은 통찰력으로 투자 기회를 포착합니다.',
                timing: '겨울철과 밤 시간대에 재물운이 강합니다.',
                advice: '너무 신중한 결정은 피해야 합니다.',
                potential: '연구개발과 컨설팅 분야에서 높은 수익이 기대됩니다.'
            }
        };

        const info = wealthInfo[dominantElement];
        return Object.values(info).join('\n');
    }

    function generateLuck(dominantElement) {
        const luckInfo = {
            '木': {
                general: '창의적인 도전과 새로운 시작에서 행운이 따릅니다.',
                timing: '봄철과 동쪽 방향에서 특히 좋은 기운을 받습니다.',
                colors: '초록색과 청색 계열이 행운의 색입니다.',
                numbers: '3, 8이 행운의 숫자입니다.',
                advice: '새로운 시도와 도전을 두려워하지 마세요.'
            },
            '火': {
                general: '열정적인 활동과 사교적인 만남에서 행운이 따릅니다.',
                timing: '여름철과 남쪽 방향에서 특히 좋은 기운을 받습니다.',
                colors: '빨간색과 주황색 계열이 행운의 색입니다.',
                numbers: '2, 7이 행운의 숫자입니다.',
                advice: '적극적인 사회활동이 행운을 가져올 것입니다.'
            },
            '土': {
                general: '안정적인 계획과 꾸준한 노력에서 행운이 따릅니다.',
                timing: '사계절 모두 중앙에서 좋은 기운을 받습니다.',
                colors: '노란색과 갈색 계열이 행운의 색입니다.',
                numbers: '5, 10이 행운의 숫자입니다.',
                advice: '차분하고 안정적인 접근이 행운을 가져올 것입니다.'
            },
            '金': {
                general: '정확한 판단과 체계적인 접근에서 행운이 따릅니다.',
                timing: '가을철과 서쪽 방향에서 특히 좋은 기운을 받습니다.',
                colors: '흰색과 금색 계열이 행운의 색입니다.',
                numbers: '4, 9가 행운의 숫자입니다.',
                advice: '원칙을 지키는 것이 행운을 가져올 것입니다.'
            },
            '水': {
                general: '지적 탐구와 직관적 판단에서 행운이 따릅니다.',
                timing: '겨울철과 북쪽 방향에서 특히 좋은 기운을 받습니다.',
                colors: '검은색과 남색 계열이 행운의 색입니다.',
                numbers: '1, 6이 행운의 숫자입니다.',
                advice: '깊이 있는 통찰이 행운을 가져올 것입니다.'
            }
        };

        const info = luckInfo[dominantElement];
        return Object.values(info).join('\n');
    }

    function generateAdvice(dominantElement) {
        const adviceInfo = {
            '木': {
                core: '창의성을 더욱 발전시키고, 안정성도 함께 추구하세요.',
                life: '새로운 도전을 두려워하지 말되, 기본적인 안정성은 유지하세요.',
                relationship: '독립성을 유지하면서도 타인과의 조화를 이루세요.',
                career: '창의적인 분야에서 자신의 재능을 발휘하세요.',
                health: '규칙적인 운동과 충분한 휴식이 필요합니다.'
            },
            '火': {
                core: '열정을 조절하고, 신중함도 함께 가지세요.',
                life: '활동적인 생활을 즐기되, 과도한 소진은 피하세요.',
                relationship: '리더십을 발휘하면서도 배려심을 잃지 마세요.',
                career: '대인관계를 활용한 직업에서 성공할 수 있습니다.',
                health: '과로를 피하고 적절한 휴식을 취하세요.'
            },
            '土': {
                core: '안정성을 유지하면서도 새로운 도전을 시도하세요.',
                life: '기본에 충실하되, 변화를 두려워하지 마세요.',
                relationship: '신뢰를 바탕으로 하되, 새로운 인연도 만드세요.',
                career: '안정적인 직업에서 시작하여 점진적으로 발전하세요.',
                health: '규칙적인 생활습관을 유지하세요.'
            },
            '金': {
                core: '원칙을 지키되, 유연한 사고도 함께 하세요.',
                life: '완벽을 추구하되, 실수도 받아들이세요.',
                relationship: '정직함을 유지하면서도 포용력을 키우세요.',
                career: '전문성을 키우되, 다양한 경험도 쌓으세요.',
                health: '정신적 스트레스 관리에 신경 쓰세요.'
            },
            '水': {
                core: '지적 탐구를 하되, 실천적인 면도 고려하세요.',
                life: '깊이 있는 사고와 함께 행동력도 키우세요.',
                relationship: '이해심을 가지고 적극적으로 소통하세요.',
                career: '전문성을 바탕으로 실용적인 접근을 하세요.',
                health: '충분한 휴식과 규칙적인 운동이 필요합니다.'
            }
        };

        const info = adviceInfo[dominantElement];
        return Object.values(info).join('\n');
    }

    // 인생시기별 운세 생성 함수
    function generateLifeStages(dominantElement) {
        const stageInfo = {
            '木': {
                early: {
                    education: '창의적인 교육환경이 중요한 시기입니다.',
                    growth: '자유로운 성장과 발달이 두드러집니다.',
                    family: '가족과의 활동적인 관계가 형성됩니다.',
                    talent: '예술적 재능이 일찍 발견될 수 있습니다.',
                    advice: '다양한 경험을 할 수 있는 기회를 제공하세요.',
                    challenge: '규칙과 질서를 배우는 것이 필요합니다.',
                    potential: '창의적 잠재력이 크게 발현되는 시기입니다.'
                },
                youth: {
                    study: '자기주도적 학습이 효과적입니다.',
                    career: '창의적 분야로의 진로가 유망합니다.',
                    love: '자유로운 연애 스타일이 예상됩니다.',
                    growth: '독창적인 아이디어로 주목받을 수 있습니다.',
                    challenge: '안정성과 현실성을 고려해야 합니다.',
                    opportunity: '새로운 도전의 기회가 많습니다.',
                    advice: '열정을 실용적으로 활용하세요.'
                },
                middle: {
                    career: '창의적 리더십이 발휘되는 시기입니다.',
                    family: '가정에서 혁신적인 변화가 있습니다.',
                    wealth: '독창적인 수입원이 생길 수 있습니다.',
                    growth: '사회적 영향력이 확대됩니다.',
                    challenge: '안정성과 균형이 필요합니다.',
                    opportunity: '새로운 사업 기회가 있습니다.',
                    advice: '위험과 기회를 잘 판단하세요.'
                },
                mature: {
                    achievement: '창의적 업적이 인정받는 시기입니다.',
                    social: '사회적 공헌도가 높아집니다.',
                    health: '유연성 운동이 중요합니다.',
                    family: '자녀의 독립을 지원하게 됩니다.',
                    challenge: '건강관리가 필요합니다.',
                    opportunity: '멘토링 기회가 많아집니다.',
                    advice: '경험을 나누는 것이 중요합니다.'
                },
                elder: {
                    retirement: '창의적인 여가 활동이 중요합니다.',
                    health: '규칙적인 운동이 필수적입니다.',
                    hobby: '예술적 취미 활동이 좋습니다.',
                    wisdom: '후학 양성에 도움을 줄 수 있습니다.',
                    challenge: '건강관리가 최우선입니다.',
                    opportunity: '새로운 배움의 기회가 있습니다.',
                    advice: '경험을 다음 세대에 전수하세요.'
                }
            },
            '火': {
                early: {
                    education: '적극적인 교육 참여가 특징입니다.',
                    growth: '활발한 성장과 발달을 보입니다.',
                    family: '가족의 사랑과 관심이 많습니다.',
                    talent: '리더십 재능이 일찍 나타납니다.',
                    advice: '에너지를 긍정적으로 발산하게 하세요.',
                    challenge: '감정 조절이 필요할 수 있습니다.',
                    potential: '강한 카리스마가 발현되는 시기입니다.'
                },
                youth: {
                    study: '실천적 학습이 효과적입니다.',
                    career: '대인관계 분야가 유망합니다.',
                    love: '열정적인 연애가 예상됩니다.',
                    growth: '리더십 역량이 발전합니다.',
                    challenge: '충동성을 조절해야 합니다.',
                    opportunity: '인맥 형성의 기회가 많습니다.',
                    advice: '네트워크 형성에 집중하세요.'
                },
                middle: {
                    career: '리더십이 절정에 달하는 시기입니다.',
                    family: '가정의 화목이 중요해집니다.',
                    wealth: '사업적 성과가 두드러집니다.',
                    growth: '조직 내 영향력이 커집니다.',
                    challenge: '일과 가정의 균형이 필요합니다.',
                    opportunity: '승진이나 발전 기회가 많습니다.',
                    advice: '책임감 있는 결정이 중요합니다.'
                },
                mature: {
                    achievement: '사회적 성취가 정점을 찍습니다.',
                    social: '존경받는 위치에 오릅니다.',
                    health: '스트레스 관리가 중요합니다.',
                    family: '가족 관계가 더욱 돈독해집니다.',
                    challenge: '과로를 조심해야 합니다.',
                    opportunity: '지도자 역할의 기회가 많습니다.',
                    advice: '건강과 성취의 균형을 찾으세요.'
                },
                elder: {
                    retirement: '활동적인 노후가 예상됩니다.',
                    health: '적절한 운동이 필요합니다.',
                    hobby: '사회활동 참여가 활발합니다.',
                    wisdom: '후배 양성에 열정을 보입니다.',
                    challenge: '과도한 활동을 조심하세요.',
                    opportunity: '사회공헌 활동이 많아집니다.',
                    advice: '건강한 열정을 유지하세요.'
                }
            },
            '土': {
                early: {
                    education: '체계적인 교육이 효과적입니다.',
                    growth: '안정적인 성장을 보입니다.',
                    family: '가족과의 유대가 매우 중요합니다.',
                    talent: '실용적인 재능이 돋보입니다.',
                    advice: '기본기를 잘 다지도록 하세요.',
                    challenge: '변화를 두려워할 수 있습니다.',
                    potential: '안정적인 성장이 기대되는 시기입니다.'
                },
                youth: {
                    study: '체계적인 학습이 중요합니다.',
                    career: '안정적인 직종이 유망합니다.',
                    love: '신중한 연애가 예상됩니다.',
                    growth: '책임감이 발달합니다.',
                    challenge: '융통성이 필요할 수 있습니다.',
                    opportunity: '전문성 개발의 기회가 많습니다.',
                    advice: '기초를 탄탄히 다지세요.'
                },
                middle: {
                    career: '전문성이 인정받는 시기입니다.',
                    family: '가정의 안정이 최고조에 달합니다.',
                    wealth: '재산이 안정적으로 증가합니다.',
                    growth: '사회적 신뢰도가 높아집니다.',
                    challenge: '혁신의 필요성을 느낍니다.',
                    opportunity: '자산 증식의 기회가 많습니다.',
                    advice: '안정 속 혁신을 추구하세요.'
                },
                mature: {
                    achievement: '전문가로서 인정받습니다.',
                    social: '신뢰할 수 있는 조언자가 됩니다.',
                    health: '규칙적인 생활이 중요합니다.',
                    family: '가족의 중심 역할을 합니다.',
                    challenge: '변화 수용이 필요합니다.',
                    opportunity: '자문역할의 기회가 많습니다.',
                    advice: '경험을 바탕으로 조언하세요.'
                },
                elder: {
                    retirement: '안정적인 노후가 예상됩니다.',
                    health: '규칙적인 생활이 핵심입니다.',
                    hobby: '원예나 독서가 좋습니다.',
                    wisdom: '신뢰받는 조언자 역할을 합니다.',
                    challenge: '고집을 내려놓아야 합니다.',
                    opportunity: '전문 자문 역할이 많아집니다.',
                    advice: '경험과 지식을 공유하세요.'
                }
            },
            '金': {
                early: {
                    education: '논리적인 교육이 효과적입니다.',
                    growth: '정확하고 체계적인 성장을 보입니다.',
                    family: '원칙이 있는 가정교육이 중요합니다.',
                    talent: '분석적 재능이 돋보입니다.',
                    advice: '규율과 원칙을 가르치세요.',
                    challenge: '감정 표현이 부족할 수 있습니다.',
                    potential: '뛰어난 판단력이 발현되는 시기입니다.'
                },
                youth: {
                    study: '분석적 학습이 효과적입니다.',
                    career: '전문직이 유망합니다.',
                    love: '이성적인 연애가 예상됩니다.',
                    growth: '전문성이 발달합니다.',
                    challenge: '감정 교류가 필요합니다.',
                    opportunity: '자격증 취득의 기회가 많습니다.',
                    advice: '전문성 개발에 집중하세요.'
                },
                middle: {
                    career: '전문성이 절정에 달합니다.',
                    family: '가정의 원칙이 확립됩니다.',
                    wealth: '계획적인 재산 증식이 있습니다.',
                    growth: '사회적 권위가 생깁니다.',
                    challenge: '유연성이 필요합니다.',
                    opportunity: '전문직 발전의 기회가 많습니다.',
                    advice: '원칙과 유연성을 조화시키세요.'
                },
                mature: {
                    achievement: '전문가로서 최고조에 달합니다.',
                    social: '권위있는 위치에 오릅니다.',
                    health: '정기적인 검진이 중요합니다.',
                    family: '자녀의 성공을 지원합니다.',
                    challenge: '고집을 줄여야 합니다.',
                    opportunity: '자문위원 역할이 많아집니다.',
                    advice: '지식을 나누는 것이 중요합니다.'
                },
                elder: {
                    retirement: '체계적인 노후가 예상됩니다.',
                    health: '정기적인 관리가 필요합니다.',
                    hobby: '수집이나 연구가 좋습니다.',
                    wisdom: '전문적인 조언자가 됩니다.',
                    challenge: '고집을 내려놓아야 합니다.',
                    opportunity: '전문 자문 역할이 많아집니다.',
                    advice: '경험과 지식을 공유하세요.'
                }
            },
            '水': {
                early: {
                    education: '창의적이고 자유로운 교육이 좋습니다.',
                    growth: '지적 호기심이 왕성합니다.',
                    family: '지적 자극이 있는 가정환경이 중요합니다.',
                    talent: '학구적 재능이 일찍 나타납니다.',
                    advice: '호기심을 자유롭게 발산하게 하세요.',
                    challenge: '실천력이 부족할 수 있습니다.',
                    potential: '지적 성장이 두드러지는 시기입니다.'
                },
                youth: {
                    study: '탐구적 학습이 효과적입니다.',
                    career: '연구직이 유망합니다.',
                    love: '지적인 교류가 중요합니다.',
                    growth: '학문적 성취가 있습니다.',
                    challenge: '현실감이 필요합니다.',
                    opportunity: '학술적 성과의 기회가 많습니다.',
                    advice: '이론과 실천을 병행하세요.'
                },
                middle: {
                    career: '연구 성과가 돋보이는 시기입니다.',
                    family: '자녀 교육에 영향력이 큽니다.',
                    wealth: '지적 재산권으로 수익이 생깁니다.',
                    growth: '학문적 성취가 높아집니다.',
                    challenge: '현실적 판단이 필요합니다.',
                    opportunity: '연구 개발의 기회가 많습니다.',
                    advice: '지식의 실용화가 중요합니다.'
                },
                mature: {
                    achievement: '학문적 성과가 정점을 찍습니다.',
                    social: '지적 권위자로 인정받습니다.',
                    health: '정신 건강이 중요합니다.',
                    family: '가족의 정신적 지주가 됩니다.',
                    challenge: '현실과의 균형이 필요합니다.',
                    opportunity: '교육자 역할이 많아집니다.',
                    advice: '지혜를 나누는 것이 중요합니다.'
                },
                elder: {
                    retirement: '지적 활동이 활발한 노후가 예상됩니다.',
                    health: '마음의 평화가 중요합니다.',
                    hobby: '독서와 연구가 좋습니다.',
                    wisdom: '지혜로운 스승 역할을 합니다.',
                    challenge: '현실적 생활이 필요합니다.',
                    opportunity: '교육 멘토 역할이 많아집니다.',
                    advice: '지혜를 후대에 전수하세요.'
                }
            }
        };

        const info = stageInfo[dominantElement];
        return {
            earlyLife: Object.values(info.early).join('\n'),
            youthLife: Object.values(info.youth).join('\n'),
            middleLife: Object.values(info.middle).join('\n'),
            matureLife: Object.values(info.mature).join('\n'),
            elderLife: Object.values(info.elder).join('\n')
        };
    }

    // 결과 분석
    function analyzeResult(saju, elements) {
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];

        // 기본 분석 결과
        const basicAnalysis = {
            basicInfo: generateBasicInfo(dominantElement),
            lifeStages: generateLifeStages(dominantElement),
            personality: generatePersonality(dominantElement),
            career: generateCareer(dominantElement),
            health: generateHealth(dominantElement),
            relationships: generateRelationships(dominantElement),
            wealth: generateWealth(dominantElement),
            luck: generateLuck(dominantElement),
            advice: generateAdvice(dominantElement)
        };

        // 운세 관련 분석
        const fortuneAnalysis = {
            fortune: analyzeHeavenlyFortune(saju),
            timing: analyzeHeavenlyTiming(saju),
            longevity: analyzeHeavenlyLongevity(saju),
            talent: analyzeHeavenlyTalent(saju)
        };

        // 사주 데이터
        const sajuData = {
            year: saju.year,
            month: saju.month,
            day: saju.day,
            hour: saju.hour
        };

        return {
            ...sajuData,
            ...basicAnalysis,
            ...fortuneAnalysis,
            elements: elements
        };
    }

    // 시간 변환 및 검증 함수
    function validateAndConvertHour(hour) {
        if (!hour || hour.trim() === '') {
            throw new Error('시간을 입력해주세요.');
        }

        const hourNum = parseInt(hour);
        if (isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
            throw new Error('올바른 시간을 입력해주세요 (0-23).');
        }
        return hourNum;
    }

    // 폼 제출 이벤트 핸들러 수정
    sajuForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        setLoading(true);

        try {
            // 입력값 가져오기
            const name = document.getElementById('name').value;
            const year = parseInt(document.getElementById('birthYear').value);
            const month = parseInt(document.getElementById('birthMonth').value);
            const day = parseInt(document.getElementById('birthDay').value);
            const isLunar = document.getElementById('isLunar').checked;
            
            // 시간 입력 처리 - 24시간제만 사용
            const hourInput = document.getElementById('birthHour').value;
            const hour = validateAndConvertHour(hourInput);

            // 날짜 유효성 검사
            if (!validateDate(year, month, day)) {
                throw new Error('유효하지 않은 날짜입니다.');
            }

            // 음력일 경우 양력으로 변환 (추후 구현)
            let solarDate = { year, month, day };
            if (isLunar) {
                // TODO: 음력을 양력으로 변환하는 로직 구현
                console.warn('음력 변환은 아직 구현되지 않았습니다.');
            }

            // 사주 계산
            const saju = calculateSaju(solarDate.year, solarDate.month, solarDate.day, hour);
            const elements = analyzeFiveElements(saju);
            const result = analyzeResult(saju, elements);

            // 결과 표시
            displayResults(result);
            
            // 결과 섹션 표시 및 스크롤
            const resultSection = document.querySelector('.result-section');
            if (resultSection) {
                resultSection.style.display = 'block';
                resultSection.scrollIntoView({ behavior: 'smooth' });
            }

        } catch (error) {
            alert(error.message);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    });

    function displayResults(result) {
        if (!result) return;

        const resultSection = document.querySelector('.result-section');
        if (!resultSection) return;

        // 결과 섹션 초기화
        resultSection.innerHTML = '';

        // 사주 차트 섹션 생성
        const chartSection = document.createElement('div');
        chartSection.className = 'saju-chart-section';
        chartSection.innerHTML = `
            <h3>사주 팔자</h3>
            <div class="saju-chart">
                ${['year', 'month', 'day', 'hour'].map(pillar => `
                    <div class="${pillar}-pillar pillar">
                        <div class="pillar-label">${
                            pillar === 'year' ? '年' :
                            pillar === 'month' ? '月' :
                            pillar === 'day' ? '日' : '時'
                        }</div>
                        <div class="heavenly-stem">${result[pillar]?.stem || ''}</div>
                        <div class="earthly-branch">${result[pillar]?.branch || ''}</div>
                    </div>
                `).join('')}
            </div>
        `;
        resultSection.appendChild(chartSection);

        // 오행 분석 섹션 생성
        if (result.elements) {
            const elementalSection = document.createElement('div');
            elementalSection.className = 'elemental-analysis-section';
            elementalSection.innerHTML = `
                <h3>오행 분석</h3>
                <div class="elemental-analysis">
                    ${Object.entries(result.elements).map(([element, value]) => `
                        <div class="element-row">
                            <span class="element-name">${element}</span>
                            <div class="element-bar-container">
                                <div class="element-bar" style="width: ${value * 100}%"></div>
                            </div>
                            <span class="element-value">${Math.round(value * 100)}%</span>
                        </div>
                    `).join('')}
                </div>
            `;
            resultSection.appendChild(elementalSection);
        }

        // 인생시기별 운세 섹션 생성
        if (result.lifeStages) {
            const lifeStagesSection = document.createElement('div');
            lifeStagesSection.className = 'life-stages-section';
            lifeStagesSection.innerHTML = `
                <h3>인생시기별 운세</h3>
                <div class="analysis-content">
                    <div class="stage-group">
                        <h4>초년운 (0~15세)</h4>
                        <div id="earlyLife" class="stage-content">
                            ${result.lifeStages.earlyLife?.split('\n').map(line => `<p>${line}</p>`).join('') || ''}
                        </div>
                    </div>
                    <div class="stage-group">
                        <h4>청년운 (16~30세)</h4>
                        <div id="youthLife" class="stage-content">
                            ${result.lifeStages.youthLife?.split('\n').map(line => `<p>${line}</p>`).join('') || ''}
                        </div>
                    </div>
                    <div class="stage-group">
                        <h4>중년운 (31~45세)</h4>
                        <div id="middleLife" class="stage-content">
                            ${result.lifeStages.middleLife?.split('\n').map(line => `<p>${line}</p>`).join('') || ''}
                        </div>
                    </div>
                    <div class="stage-group">
                        <h4>장년운 (46~60세)</h4>
                        <div id="matureLife" class="stage-content">
                            ${result.lifeStages.matureLife?.split('\n').map(line => `<p>${line}</p>`).join('') || ''}
                        </div>
                    </div>
                    <div class="stage-group">
                        <h4>노년운 (61세 이후)</h4>
                        <div id="elderLife" class="stage-content">
                            ${result.lifeStages.elderLife?.split('\n').map(line => `<p>${line}</p>`).join('') || ''}
                        </div>
                    </div>
                </div>
            `;
            resultSection.appendChild(lifeStagesSection);
        }

        // 나머지 분석 결과 섹션들 생성
        const sections = [
            { id: 'basicInfo', title: '기본 정보', content: result.basicInfo },
            { id: 'personality', title: '성격 분석', content: result.personality },
            { id: 'career', title: '적성 직업', content: result.career },
            { id: 'health', title: '건강 분석', content: result.health },
            { id: 'relationships', title: '대인관계', content: result.relationships },
            { id: 'wealth', title: '재물운', content: result.wealth },
            { id: 'luck', title: '운세 분석', content: result.luck },
            { id: 'advice', title: '조언', content: result.advice }
        ];

        const analysisContainer = document.createElement('div');
        analysisContainer.className = 'analysis-container';
        
        sections.forEach(section => {
            if (section.content) {
                const sectionElement = document.createElement('div');
                sectionElement.className = 'analysis-section';
                sectionElement.innerHTML = `
                    <h3>${section.title}</h3>
                    <div class="analysis-content">
                        ${(typeof section.content === 'string' ? section.content.split('\n') : [])
                            .map(line => `<p>${line}</p>`).join('')}
                    </div>
                `;
                analysisContainer.appendChild(sectionElement);
            }
        });

        resultSection.appendChild(analysisContainer);

        // 인생시기별 운세 표시
        const lifeStages = ['earlyLife', 'youthLife', 'middleLife', 'matureLife', 'elderLife'];
        const stageElements = ['wood', 'fire', 'earth', 'metal', 'water'];
        
        lifeStages.forEach((stage, index) => {
            const content = result.lifeStages[stage];
            if (content) {
                const stageElement = document.getElementById(stage);
                if (stageElement) {
                    const stageGroup = stageElement.closest('.stage-group');
                    if (stageGroup) {
                        // 기존 오행 클래스 제거
                        stageGroup.classList.remove('wood', 'fire', 'earth', 'metal', 'water');
                        // 해당 시기의 주요 오행 클래스 추가
                        const dominantElement = content.dominantElement || stageElements[index];
                        stageGroup.classList.add(dominantElement.toLowerCase());
                    }
                    stageElement.innerHTML = content.description || '';
                }
            }
        });
    }
}); 