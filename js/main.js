document.addEventListener('DOMContentLoaded', function() {
    const sajuForm = document.getElementById('sajuForm');
    const resultSection = document.querySelector('.result-section');
    const birthHourType = document.getElementById('birthHourType');
    const hour24Input = document.getElementById('hour24Input');
    const hourTraditionalInput = document.getElementById('hourTraditionalInput');
    const submitButton = document.querySelector('button[type="submit"]');
    const scrollToTopButton = document.getElementById('scrollToTop');

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.display = 'block';
        } else {
            scrollToTopButton.style.display = 'none';
        }
    });

    // 맨 위로 가기 버튼 클릭 이벤트
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
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

    // 결과 분석
    function analyzeResult(saju, elements) {
        const dominantElement = Object.entries(elements)
            .sort(([,a], [,b]) => b - a)[0][0];

        // 기본 정보 분석
        let basicInfo = `당신의 사주는 ${dominantElement}이(가) 강한 형상입니다. `;
        if (dominantElement === '木') {
            basicInfo += '봄의 기운이 강하여 새로운 시작과 성장을 상징합니다. 목(木)은 나무를 의미하며, 봄의 생명력과 성장을 대표합니다.';
        } else if (dominantElement === '火') {
            basicInfo += '여름의 기운이 강하여 열정과 활력을 상징합니다. 화(火)는 불을 의미하며, 여름의 열정과 활력을 대표합니다.';
        } else if (dominantElement === '土') {
            basicInfo += '중앙의 기운이 강하여 안정과 중용을 상징합니다. 토(土)는 땅을 의미하며, 안정과 중용을 대표합니다.';
        } else if (dominantElement === '金') {
            basicInfo += '가을의 기운이 강하여 결실과 정리를 상징합니다. 금(金)은 금속을 의미하며, 가을의 결실과 정리를 대표합니다.';
        } else if (dominantElement === '水') {
            basicInfo += '겨울의 기운이 강하여 지혜와 유연성을 상징합니다. 수(水)는 물을 의미하며, 겨울의 지혜와 유연성을 대표합니다.';
        }

        // 성격 분석
        let personality = '당신은 ';
        if (dominantElement === '木') {
            personality += '창의적이고 독립적인 성격을 가지고 있습니다. 새로운 도전을 즐기며, 타인을 돕는 것을 좋아합니다.';
        } else if (dominantElement === '火') {
            personality += '열정적이고 사교적인 성격을 가지고 있습니다. 리더십이 뛰어나며, 새로운 아이디어를 제시하는 것을 좋아합니다.';
        } else if (dominantElement === '土') {
            personality += '안정적이고 신중한 성격을 가지고 있습니다. 책임감이 강하며, 타인을 배려하는 것을 좋아합니다.';
        } else if (dominantElement === '金') {
            personality += '원칙적이고 완벽을 추구하는 성격을 가지고 있습니다. 정의감이 강하며, 질서를 중요시합니다.';
        } else if (dominantElement === '水') {
            personality += '지적이고 유연한 성격을 가지고 있습니다. 통찰력이 뛰어나며, 새로운 지식을 탐구하는 것을 좋아합니다.';
        }

        // 직업 분석
        let career = '당신에게 적합한 직업은 ';
        if (dominantElement === '木') {
            career += '교육, 환경, 디자인, 예술 분야입니다. 창의성과 새로운 아이디어를 활용할 수 있는 직업이 적합합니다.';
        } else if (dominantElement === '火') {
            career += '리더십이 필요한 관리직, 영업, 마케팅 분야입니다. 열정과 활력을 발휘할 수 있는 직업이 적합합니다.';
        } else if (dominantElement === '土') {
            career += '안정적인 공무원, 행정, 서비스 분야입니다. 책임감과 신중함을 발휘할 수 있는 직업이 적합합니다.';
        } else if (dominantElement === '金') {
            career += '법률, 금융, 회계 분야입니다. 원칙과 규율을 중요시하는 직업이 적합합니다.';
        } else if (dominantElement === '水') {
            career += '연구, 분석, 컨설팅 분야입니다. 통찰력과 지적 능력을 활용할 수 있는 직업이 적합합니다.';
        }

        // 건강 분석
        let health = '건강 관리에 있어 주의해야 할 부분은 ';
        if (dominantElement === '木') {
            health += '간과 담낭입니다. 스트레스 관리와 충분한 휴식이 중요합니다.';
        } else if (dominantElement === '火') {
            health += '심장과 소장입니다. 과로와 긴장을 피하고 적절한 운동이 필요합니다.';
        } else if (dominantElement === '土') {
            health += '위와 비장입니다. 규칙적인 식사와 소화기 관리가 중요합니다.';
        } else if (dominantElement === '金') {
            health += '폐와 대장입니다. 호흡기 관리와 면역력 강화가 필요합니다.';
        } else if (dominantElement === '水') {
            health += '신장과 방광입니다. 수분 섭취와 신체 순환 관리가 중요합니다.';
        }

        // 관계 분석
        let relationships = '대인 관계에서 ';
        if (dominantElement === '木') {
            relationships += '창의적이고 독립적인 성격으로 인해 때때로 타인과 마찰이 있을 수 있습니다. 하지만 따뜻한 마음씨로 주변 사람들의 신뢰를 얻습니다.';
        } else if (dominantElement === '火') {
            relationships += '열정적이고 사교적인 성격으로 많은 사람들과 좋은 관계를 맺습니다. 다만 때로는 성급한 판단을 할 수 있습니다.';
        } else if (dominantElement === '土') {
            relationships += '안정적이고 신중한 성격으로 주변 사람들의 든든한 버팀목이 됩니다. 신뢰할 수 있는 친구로 인정받습니다.';
        } else if (dominantElement === '金') {
            relationships += '원칙적이고 완벽을 추구하는 성격으로 때로는 융통성이 부족할 수 있습니다. 하지만 믿음직한 조언자로 인정받습니다.';
        } else if (dominantElement === '水') {
            relationships += '지적이고 유연한 성격으로 깊이 있는 대화를 나누는 것을 좋아합니다. 때로는 감정적 거리를 두는 경향이 있습니다.';
        }

        // 연애 분석
        let love = '연애와 결혼에 있어 ';
        if (dominantElement === '木') {
            love += '자유로운 연애를 추구하며, 상대방의 독립성을 존중합니다. 새로운 경험을 함께 나누는 것을 좋아합니다.';
        } else if (dominantElement === '火') {
            love += '열정적인 연애를 추구하며, 로맨틱한 순간을 중요시합니다. 다만 때로는 성급한 결정을 할 수 있습니다.';
        } else if (dominantElement === '土') {
            love += '안정적인 관계를 추구하며, 책임감 있는 파트너십을 중요시합니다. 신뢰와 배려가 바탕이 된 관계를 만듭니다.';
        } else if (dominantElement === '金') {
            love += '완벽한 관계를 추구하며, 원칙과 규율을 중요시합니다. 때로는 융통성이 부족할 수 있습니다.';
        } else if (dominantElement === '水') {
            love += '깊이 있는 정신적 교류를 추구하며, 지적 호기심을 공유하는 것을 좋아합니다. 때로는 감정적 거리를 두는 경향이 있습니다.';
        }

        // 재물 분석
        let wealth = '재물 운에 있어 ';
        if (dominantElement === '木') {
            wealth += '창의적인 아이디어를 통한 수입이 많습니다. 교육이나 예술 관련 분야에서 재물을 얻을 수 있습니다.';
        } else if (dominantElement === '火') {
            wealth += '열정과 노력을 통한 수입이 많습니다. 리더십을 발휘하는 직업에서 재물을 얻을 수 있습니다.';
        } else if (dominantElement === '土') {
            wealth += '안정적인 수입이 많습니다. 부동산이나 안정적인 직업을 통한 재물 축적이 가능합니다.';
        } else if (dominantElement === '金') {
            wealth += '체계적인 재물 관리가 가능합니다. 금융이나 법률 관련 분야에서 재물을 얻을 수 있습니다.';
        } else if (dominantElement === '水') {
            wealth += '지적 능력을 통한 수입이 많습니다. 연구나 컨설팅 분야에서 재물을 얻을 수 있습니다.';
        }

        // 행운 분석
        let luck = '행운의 시기와 방향은 ';
        if (dominantElement === '木') {
            luck += '봄철에 동쪽 방향이 행운을 가져옵니다. 새로운 시작과 성장의 시기입니다.';
        } else if (dominantElement === '火') {
            luck += '여름철에 남쪽 방향이 행운을 가져옵니다. 열정과 활력의 시기입니다.';
        } else if (dominantElement === '土') {
            luck += '중앙 방향이 행운을 가져옵니다. 안정과 중용의 시기입니다.';
        } else if (dominantElement === '金') {
            luck += '가을철에 서쪽 방향이 행운을 가져옵니다. 결실과 정리의 시기입니다.';
        } else if (dominantElement === '水') {
            luck += '겨울철에 북쪽 방향이 행운을 가져옵니다. 지혜와 유연성의 시기입니다.';
        }

        // 조언 분석
        let advice = '앞으로의 삶에 대한 조언은 ';
        if (dominantElement === '木') {
            advice += '창의성을 더욱 발전시키되, 때로는 타인의 의견도 경청하세요. 새로운 도전을 두려워하지 마세요.';
        } else if (dominantElement === '火') {
            advice += '열정을 유지하되, 때로는 신중한 판단이 필요합니다. 성급한 결정을 피하세요.';
        } else if (dominantElement === '土') {
            advice += '안정성을 유지하되, 때로는 새로운 변화를 받아들이세요. 과도한 보수성을 피하세요.';
        } else if (dominantElement === '金') {
            advice += '원칙을 지키되, 때로는 융통성이 필요합니다. 완벽을 추구하되 과도하지 않게 하세요.';
        } else if (dominantElement === '水') {
            advice += '지적 호기심을 유지하되, 감정적 교류도 중요합니다. 때로는 마음을 열어보세요.';
        }

        return {
            basicInfo,
            personality,
            career,
            health,
            relationships,
            love,
            wealth,
            luck,
            advice
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

        // 분석 결과 표시
        const resultElements = {
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

        Object.entries(resultElements).forEach(([id, content]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = content;
            }
        });
    }
}); 