document.addEventListener('DOMContentLoaded', function() {
    const sajuForm = document.getElementById('sajuForm');
    const resultSection = document.querySelector('.result-section');
    const birthHourType = document.getElementById('birthHourType');
    const hour24Input = document.getElementById('hour24Input');
    const hourTraditionalInput = document.getElementById('hourTraditionalInput');
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

    // 생시 입력 방식 전환
    birthHourType.addEventListener('change', function() {
        if (this.value === '24hour') {
            hour24Input.style.display = 'block';
            hourTraditionalInput.style.display = 'none';
            document.getElementById('birthHour').required = true;
            document.getElementById('birthHourTraditional').required = false;
        } else {
            hour24Input.style.display = 'none';
            hourTraditionalInput.style.display = 'block';
            document.getElementById('birthHour').required = false;
            document.getElementById('birthHourTraditional').required = true;
        }
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

    // 일 천간 계산 (간단한 버전)
    function calculateDayStem(day) {
        return heavenlyStems[day % 10];
    }

    // 일 지지 계산 (간단한 버전)
    function calculateDayBranch(day) {
        return earthlyBranches[day % 12];
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
                stem: calculateDayStem(day),
                branch: calculateDayBranch(day),
                element: calculateFiveElement(calculateDayStem(day))
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
        const elements = {};
        fiveElements.forEach(element => {
            elements[element] = 0;
        });

        Object.values(saju).forEach(pillar => {
            elements[pillar.element]++;
        });

        return elements;
    }

    // 천격 분석
    function analyzeHeavenlyPattern(saju) {
        const stems = Object.values(saju).map(pillar => pillar.stem);
        const branches = Object.values(saju).map(pillar => pillar.branch);
        
        // 천간의 조화 분석
        const stemHarmony = analyzeStemHarmony(stems);
        // 지지의 조화 분석
        const branchHarmony = analyzeBranchHarmony(branches);
        
        return {
            stemHarmony,
            branchHarmony,
            overallPattern: determineOverallPattern(stemHarmony, branchHarmony)
        };
    }

    // 천간 조화 분석
    function analyzeStemHarmony(stems) {
        const combinations = {
            '甲己': '토합',
            '乙庚': '금합',
            '丙辛': '수합',
            '丁壬': '목합',
            '戊癸': '화합'
        };
        
        let harmony = [];
        for (let i = 0; i < stems.length; i++) {
            for (let j = i + 1; j < stems.length; j++) {
                const combination = stems[i] + stems[j];
                if (combinations[combination]) {
                    harmony.push(combinations[combination]);
                }
            }
        }
        
        return harmony;
    }

    // 지지 조화 분석
    function analyzeBranchHarmony(branches) {
        const combinations = {
            '子丑': '토합',
            '寅亥': '목합',
            '卯戌': '화합',
            '辰酉': '금합',
            '巳申': '수합',
            '午未': '화합'
        };
        
        let harmony = [];
        for (let i = 0; i < branches.length; i++) {
            for (let j = i + 1; j < branches.length; j++) {
                const combination = branches[i] + branches[j];
                if (combinations[combination]) {
                    harmony.push(combinations[combination]);
                }
            }
        }
        
        return harmony;
    }

    // 전체 패턴 결정
    function determineOverallPattern(stemHarmony, branchHarmony) {
        const allHarmony = [...stemHarmony, ...branchHarmony];
        const elementCounts = {
            '목합': 0,
            '화합': 0,
            '토합': 0,
            '금합': 0,
            '수합': 0
        };
        
        allHarmony.forEach(harmony => {
            elementCounts[harmony]++;
        });
        
        return elementCounts;
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

    // 천수 분석
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
        
        return {
            healthPattern: healthPatterns[dominantElement],
            longevity: calculateLongevity(elements),
            healthAdvice: generateHealthAdvice(dominantElement)
        };
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

    // 결과 분석
    function analyzeResult(saju, elements) {
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];

        // 기존 분석 결과
        const basicAnalysis = {
            basicInfo: generateBasicInfo(dominantElement),
            personality: generatePersonality(dominantElement),
            career: generateCareer(dominantElement),
            health: generateHealth(dominantElement),
            relationships: generateRelationships(dominantElement),
            love: generateLove(dominantElement),
            wealth: generateWealth(dominantElement),
            luck: generateLuck(dominantElement),
            advice: generateAdvice(dominantElement)
        };

        // 새로운 천(天) 관련 분석 추가
        const heavenlyAnalysis = {
            pattern: analyzeHeavenlyPattern(saju),
            fortune: analyzeHeavenlyFortune(saju),
            timing: analyzeHeavenlyTiming(saju),
            longevity: analyzeHeavenlyLongevity(saju),
            talent: analyzeHeavenlyTalent(saju),
            destiny: analyzeHeavenlyDestiny(saju),
            virtue: analyzeHeavenlyVirtue(saju),
            weakness: analyzeHeavenlyWeakness(saju),
            authority: analyzeHeavenlyAuthority(saju),
            gift: analyzeHeavenlyGift(saju),
            appearance: analyzeHeavenlyAppearance(saju),
            sustenance: analyzeHeavenlySustenance(saju),
            nobility: analyzeHeavenlyNobility(saju),
            obstacle: analyzeHeavenlyObstacle(saju),
            power: analyzeHeavenlyPower(saju),
            stemCombination: analyzeHeavenlyStemCombination(saju),
            stemConflict: analyzeHeavenlyStemConflict(saju)
        };

        return {
            ...basicAnalysis,
            ...heavenlyAnalysis
        };
    }

    sajuForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        setLoading(true);

        try {
            // 입력값 가져오기
            const year = parseInt(document.getElementById('birthYear').value);
            const month = parseInt(document.getElementById('birthMonth').value);
            const day = parseInt(document.getElementById('birthDay').value);
            let hour;

            // 생시 입력 방식에 따라 시간 가져오기
            if (birthHourType.value === '24hour') {
                hour = parseInt(document.getElementById('birthHour').value);
            } else {
                hour = parseInt(document.getElementById('birthHourTraditional').value);
            }

            // 입력값 검증
            if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour)) {
                throw new Error('모든 필드를 입력해주세요.');
            }

            // 날짜 유효성 검사
            if (!validateDate(year, month, day)) {
                throw new Error('올바른 날짜를 입력해주세요.');
            }

            // 시간 유효성 검사
            if (hour < 0 || hour > 23) {
                throw new Error('올바른 시간을 입력해주세요 (0-23).');
            }

            // 연도 범위 검사
            if (year < 1900 || year > 2100) {
                throw new Error('연도는 1900년부터 2100년 사이여야 합니다.');
            }

            // 사주 계산
            const saju = calculateSaju(year, month, day, hour);
            const elements = analyzeFiveElements(saju);
            const analysisResult = analyzeResult(saju, elements);

            // 결과 표시
            displayResults(saju, analysisResult);
            resultSection.style.display = 'block';
            resultSection.scrollIntoView({ behavior: 'smooth' });

            // 기본 정보 표시
            const name = document.getElementById('name').value;
            const gender = document.getElementById('gender').value;
            const isLunar = document.getElementById('isLunar').value === 'yes';
            const location = document.getElementById('location').value;
            document.getElementById('basicInfo').textContent = `이름: ${name}\n생년월일시: ${year}년 ${month}월 ${day}일 ${hour}시\n성별: ${gender === 'male' ? '남성' : '여성'}\n음력: ${isLunar ? '예' : '아니오'}\n태어난 지역: ${location || '미입력'}`;
            
            // 천고 표시
            document.getElementById('heavenlyLuck').textContent = `${name}님의 천고는 재성(財星)과 인성(印星)의 조합이 특별합니다. 특히 지지(地支)에서 축(丑), 미(未), 술(戌)과 같은 '창고'를 의미하는 지지에 재성이나 인성이 위치하여 천고가 강한 형상입니다. 이는 물질적 풍요와 행운이 축적되어 있음을 의미하며, 특히 30대 후반부터 40대 초반에 그 복이 본격적으로 발현될 것으로 보입니다. 재성과 인성이 적절히 배치되어 있어 안정적인 재물 축적과 학문적 성취가 가능할 것으로 예상됩니다. 특히 금(金)과 목(木)의 조화가 잘 이루어져 있어, 창의적인 아이디어를 통해 재물을 얻을 수 있는 구조입니다. 35세 전후에 큰 재물의 기회가 있을 것으로 보이며, 이는 하늘이 부여한 천고의 발현이 될 것입니다.`;
            
            // 천역 표시
            document.getElementById('heavenlyDuty').textContent = `${name}님의 천역은 관성(官星)의 특별한 배치에서 찾을 수 있습니다. 정관(正官)이 강하게 작용하여 규율과 질서를 중시하는 성향이 있으며, 이는 사회적 책임과 의무를 다하는 데 적합한 구조입니다. 특히 관성과 인성이 조화롭게 배치되어 있어, 공직이나 법률, 규율과 관련된 분야에서 천역을 수행할 가능성이 높습니다. 35세 전후에 중요한 공직이나 사회적 역할을 맡게 될 가능성이 있으며, 이는 하늘이 부여한 천역을 수행하는 계기가 될 것입니다. 관성의 강한 작용은 리더십과 책임감을 의미하며, 이는 사회적 기여와 발전에 큰 역할을 할 수 있음을 시사합니다.`;
            
            // 천문 표시
            document.getElementById('heavenlyPattern').textContent = `${name}님의 천문은 인성(印星)의 특별한 작용에서 찾을 수 있습니다. 정인(正印)이 자(子)나 해(亥) 지지에 위치하여 학문적 통찰력과 연구 능력이 뛰어난 형상입니다. 특히 인성과 관성이 조화롭게 배치되어 있어, 깊은 통찰과 패턴 인식을 통한 새로운 지식의 창출이 가능합니다. 이는 단순한 지식의 축적이 아닌, 깊은 통찰을 통한 새로운 패턴의 발견과 이해를 가능하게 합니다. 40대 중반부터 본격적인 학문적 성취나 연구 성과가 나타날 것으로 예상되며, 이는 하늘이 부여한 천문의 발현이 될 것입니다. 특히 수(水)와 목(木)의 조화가 학문적 통찰력을 더욱 강화시킬 것으로 보입니다.`;
            
            // 천예 표시
            document.getElementById('heavenlyArt').textContent = `${name}님의 천예는 상관(傷官)의 특별한 작용에서 찾을 수 있습니다. 상관이 강하게 작용하여 창의적인 예술 재능이 두드러지는 형상입니다. 특히 화(火)와 수(水) 오행이 조화롭게 배치되어 있어 예술적 감성이 풍부하며, 음악이나 미술 같은 예술 분야에서 뛰어난 성과를 낼 수 있는 구조입니다. 이는 단순한 기술적 능력이 아닌, 창의적인 표현과 혁신적인 아이디어를 가능하게 합니다. 25-30세 사이에 예술적 재능이 본격적으로 발현될 것으로 보이며, 특히 디자인이나 미디어 아트 분야에서 성공할 가능성이 높습니다. 상관과 정인의 조화는 예술적 통찰력과 표현력을 더욱 강화시킬 것으로 예상됩니다.`;
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    });

    function displayResults(calculateResult, analysisResult) {
        // 기존 결과 표시
        displayBasicResults(calculateResult, analysisResult);
        
        // 새로운 천(天) 관련 결과 표시
        displayHeavenlyResults(analysisResult);
    }

    function displayBasicResults(calculateResult, analysisResult) {
        // 사주 차트 표시
        const pillars = ['year', 'month', 'day', 'hour'];
        pillars.forEach(pillar => {
            const pillarElement = document.querySelector(`.${pillar}-pillar`);
            if (pillarElement) {
                const stemElement = pillarElement.querySelector('.heavenly-stem');
                const branchElement = pillarElement.querySelector('.earthly-branch');
                if (stemElement) stemElement.textContent = calculateResult[pillar].stem;
                if (branchElement) branchElement.textContent = calculateResult[pillar].branch;
            }
        });

        // 기본 분석 결과 표시
        const basicElements = {
            basicInfo: analysisResult.basicInfo,
            personality: analysisResult.personality,
            career: analysisResult.career,
            health: analysisResult.health,
            relationships: analysisResult.relationships,
            love: analysisResult.love,
            wealth: analysisResult.wealth,
            luck: analysisResult.luck,
            advice: analysisResult.advice
        };

        Object.entries(basicElements).forEach(([id, content]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = content;
            }
        });
    }

    function displayHeavenlyResults(analysisResult) {
        // 천격 분석 결과
        const patternElement = document.getElementById('heavenlyPattern');
        if (patternElement) {
            patternElement.textContent = generatePatternAnalysis(analysisResult.pattern);
        }

        // 천복 분석 결과
        const fortuneElement = document.getElementById('heavenlyFortune');
        if (fortuneElement) {
            fortuneElement.textContent = generateFortuneAnalysis(analysisResult.fortune);
        }

        // 천시 분석 결과
        const timingElement = document.getElementById('heavenlyTiming');
        if (timingElement) {
            timingElement.textContent = generateTimingAnalysis(analysisResult.timing);
        }

        // 천수 분석 결과
        const longevityElement = document.getElementById('heavenlyLongevity');
        if (longevityElement) {
            longevityElement.textContent = generateLongevityAnalysis(analysisResult.longevity);
        }

        // 천재 분석 결과
        const talentElement = document.getElementById('heavenlyTalent');
        if (talentElement) {
            talentElement.textContent = generateTalentAnalysis(analysisResult.talent);
        }

        // 천명 분석 결과
        const destinyElement = document.getElementById('heavenlyDestiny');
        if (destinyElement) {
            destinyElement.textContent = generateDestinyAnalysis(analysisResult.destiny);
        }

        // 천덕 분석 결과
        const virtueElement = document.getElementById('heavenlyVirtue');
        if (virtueElement) {
            virtueElement.textContent = generateVirtueAnalysis(analysisResult.virtue);
        }

        // 천요 분석 결과
        const weaknessElement = document.getElementById('heavenlyWeakness');
        if (weaknessElement) {
            weaknessElement.textContent = generateWeaknessAnalysis(analysisResult.weakness);
        }

        // 천인 분석 결과
        const authorityElement = document.getElementById('heavenlyAuthority');
        if (authorityElement) {
            authorityElement.textContent = generateAuthorityAnalysis(analysisResult.authority);
        }

        // 천부 분석 결과
        const giftElement = document.getElementById('heavenlyGift');
        if (giftElement) {
            giftElement.textContent = generateGiftAnalysis(analysisResult.gift);
        }

        // 천상 분석 결과
        const appearanceElement = document.getElementById('heavenlyAppearance');
        if (appearanceElement) {
            appearanceElement.textContent = generateAppearanceAnalysis(analysisResult.appearance);
        }

        // 천식 분석 결과
        const sustenanceElement = document.getElementById('heavenlySustenance');
        if (sustenanceElement) {
            sustenanceElement.textContent = generateSustenanceAnalysis(analysisResult.sustenance);
        }

        // 천귀 분석 결과
        const nobilityElement = document.getElementById('heavenlyNobility');
        if (nobilityElement) {
            nobilityElement.textContent = generateNobilityAnalysis(analysisResult.nobility);
        }

        // 천살 분석 결과
        const obstacleElement = document.getElementById('heavenlyObstacle');
        if (obstacleElement) {
            obstacleElement.textContent = generateObstacleAnalysis(analysisResult.obstacle);
        }

        // 천권 분석 결과
        const powerElement = document.getElementById('heavenlyPower');
        if (powerElement) {
            powerElement.textContent = generatePowerAnalysis(analysisResult.power);
        }

        // 천간합 분석 결과
        const stemCombinationElement = document.getElementById('heavenlyStemCombination');
        if (stemCombinationElement) {
            stemCombinationElement.textContent = generateStemCombinationAnalysis(analysisResult.stemCombination);
        }

        // 천간충 분석 결과
        const stemConflictElement = document.getElementById('heavenlyStemConflict');
        if (stemConflictElement) {
            stemConflictElement.textContent = generateStemConflictAnalysis(analysisResult.stemConflict);
        }
    }

    // 분석 결과 생성 함수들
    function generatePatternAnalysis(pattern) {
        return `당신의 천격은 ${pattern.overallPattern}의 조화를 보여주고 있습니다. 
        천간의 조화: ${pattern.stemHarmony.join(', ')}
        지지의 조화: ${pattern.branchHarmony.join(', ')}`;
    }

    function generateFortuneAnalysis(fortune) {
        return `당신의 천복은 ${fortune.type}의 형태를 보여주고 있습니다. 
        복의 강도: ${fortune.strength}
        발현 시기: ${fortune.timing}`;
    }

    function generateTimingAnalysis(timing) {
        return `당신의 천시는 다음과 같습니다:
        주요 시기: ${timing.majorTiming}
        부가 시기: ${timing.minorTiming}
        일일 시기: ${timing.dailyTiming}`;
    }

    function generateLongevityAnalysis(longevity) {
        return `당신의 천수는 다음과 같습니다:
        건강 패턴: ${longevity.healthPattern.type}
        관련 장기: ${longevity.healthPattern.organs.join(', ')}
        건강 조언: ${longevity.healthAdvice}`;
    }

    function generateTalentAnalysis(talent) {
        return `당신의 천재는 다음과 같습니다:
        재능 유형: ${talent.type}
        적합 분야: ${talent.fields.join(', ')}
        재능 강도: ${talent.strength}`;
    }

    function generateDestinyAnalysis(destiny) {
        return `당신의 천명은 다음과 같습니다:
        목적: ${destiny.purpose}
        사명: ${destiny.mission}
        영향력: ${destiny.impact}`;
    }

    function generateVirtueAnalysis(virtue) {
        return `당신의 천덕은 다음과 같습니다:
        덕의 유형: ${virtue.type}
        귀인: ${virtue.benefactors.join(', ')}
        시기: ${virtue.timing}`;
    }

    function generateWeaknessAnalysis(weakness) {
        return `당신의 천요는 다음과 같습니다:
        약점 유형: ${weakness.type}
        도전 과제: ${weakness.challenge}
        해결 방안: ${weakness.solution}`;
    }

    function generateAuthorityAnalysis(authority) {
        return `당신의 천인은 다음과 같습니다:
        권위 유형: ${authority.type}
        분야: ${authority.field}
        강도: ${authority.strength}`;
    }

    function generateGiftAnalysis(gift) {
        return `당신의 천부는 다음과 같습니다:
        재능 유형: ${gift.type}
        발현 방식: ${gift.manifestation}
        발전 방향: ${gift.development}`;
    }

    function generateAppearanceAnalysis(appearance) {
        return `당신의 천상은 다음과 같습니다:
        외모 유형: ${appearance.type}
        특징: ${appearance.features.join(', ')}
        인상: ${appearance.impression}`;
    }

    function generateSustenanceAnalysis(sustenance) {
        return `당신의 천식은 다음과 같습니다:
        식록 유형: ${sustenance.type}
        수입원: ${sustenance.source}
        안정성: ${sustenance.stability}`;
    }

    function generateNobilityAnalysis(nobility) {
        return `당신의 천귀는 다음과 같습니다:
        귀함 유형: ${nobility.type}
        지위: ${nobility.status}
        영향력: ${nobility.influence}`;
    }

    function generateObstacleAnalysis(obstacle) {
        return `당신의 천살은 다음과 같습니다:
        장애 유형: ${obstacle.type}
        도전: ${obstacle.challenge}
        해결책: ${obstacle.solution}`;
    }

    function generatePowerAnalysis(power) {
        return `당신의 천권은 다음과 같습니다:
        권력 유형: ${power.type}
        영역: ${power.domain}
        강도: ${power.strength}`;
    }

    function generateStemCombinationAnalysis(combinations) {
        if (combinations.length === 0) {
            return '현재 특별한 천간합이 발견되지 않았습니다.';
        }
        return `당신의 천간합은 다음과 같습니다:
        ${combinations.map(combo => `${combo.stems}: ${combo.type}`).join('\n')}`;
    }

    function generateStemConflictAnalysis(conflicts) {
        if (conflicts.length === 0) {
            return '현재 특별한 천간충이 발견되지 않았습니다.';
        }
        return `당신의 천간충은 다음과 같습니다:
        ${conflicts.map(conflict => `${conflict.stems}: ${conflict.type}`).join('\n')}`;
    }
}); 