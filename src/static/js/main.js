document.addEventListener('DOMContentLoaded', function() {
    const sajuForm = document.getElementById('sajuForm');
    const resultSection = document.querySelector('.result-section');
    const birthHourType = document.getElementById('birthHourType');
    const hour24Input = document.getElementById('hour24Input');
    const hourTraditionalInput = document.getElementById('hourTraditionalInput');
    const submitButton = document.querySelector('button[type="submit"]');

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

            // 테스트용 결과 데이터
            const calculateResult = {
                year: {
                    stem: '甲',
                    branch: '子'
                },
                month: {
                    stem: '丙',
                    branch: '寅'
                },
                day: {
                    stem: '戊',
                    branch: '辰'
                },
                hour: {
                    stem: '庚',
                    branch: '午'
                }
            };

            const analysisResult = {
                basicInfo: '당신의 사주는 목(木)이 강한 형상입니다. 봄의 기운이 강하여 새로운 시작과 성장을 상징합니다. 목(木)은 나무를 의미하며, 봄의 생명력과 성장을 대표합니다. 당신의 사주에서 목(木)이 강한 것은 창의성, 독립성, 성장의지가 강함을 의미합니다. 특히 봄철에 태어난 목(木)의 기운은 새로운 시작과 변화를 추구하는 성격을 형성합니다. 다만, 목(木)이 너무 강하면 완고하고 고집스러운 성격이 될 수 있으므로, 유연한 사고방식과 타인에 대한 이해가 필요합니다. 금(金)의 기운이 약한 것은 의사결정의 신중함이 필요함을 의미하며, 수(水)의 기운이 보조하는 것은 지적 호기심과 탐구심이 강함을 나타냅니다.',
                personality: '당신은 성실하고 책임감이 강한 성격을 가지고 있습니다. 새로운 도전을 즐기며, 타인을 돕는 것을 좋아합니다. 창의적이고 독립적인 성격으로, 자신의 의견을 잘 표현하는 편입니다. 때로는 완벽을 추구하는 성격이 있어 스트레스를 받을 수 있습니다. 목(木)의 기운이 강한 당신은 원칙과 규칙을 중요시하며, 정의감이 강합니다. 다만, 때로는 너무 완고하고 고집스러울 수 있으므로, 유연한 사고방식과 타인에 대한 이해가 필요합니다. 새로운 환경에 적응하는 능력이 뛰어나며, 도전적인 상황에서도 포기하지 않고 끝까지 해내는 강인한 성격을 가지고 있습니다.',
                career: '관리직, 교육자, 의료인, 연구원 등의 직업이 적합합니다. 특히 타인을 돕고 가르치는 일에서 큰 성취를 이룰 수 있습니다. 창의적인 분야나 환경 보호, 생태 관련 직업도 좋은 선택이 될 수 있습니다. 30대 후반부터 40대 초반에 경력 전환의 기회가 있을 수 있습니다. 목(木)의 기운이 강한 당신은 창의성과 독립성이 필요한 직업에서 성공할 가능성이 높습니다. 특히 교육, 환경, 생태, 디자인, 예술 분야에서 뛰어난 성과를 낼 수 있습니다. 다만, 금(金)의 기운이 약한 것은 의사결정의 신중함이 필요함을 의미하므로, 중요한 결정은 충분한 고민 후에 내리는 것이 좋습니다.',
                health: '심장과 혈관 건강에 주의가 필요합니다. 규칙적인 운동과 건강한 식습관을 유지하세요. 특히 봄철에는 알레르기나 호흡기 질환에 주의가 필요합니다. 스트레스 관리가 중요하며, 명상이나 요가와 같은 정신적 안정을 위한 활동을 추천합니다. 목(木)이 강한 당신은 간과 담낭 건강에 주의가 필요합니다. 과로와 스트레스로 인한 피로가 쌓이지 않도록 적절한 휴식과 운동이 중요합니다. 특히 봄철에는 알레르기나 호흡기 질환에 취약할 수 있으므로, 면역력 강화에 신경 쓰세요. 수(水)의 기운이 보조하는 것은 신장과 방광 건강이 양호함을 의미하지만, 과도한 수분 섭취는 피해야 합니다.',
                relationships: '가족과의 관계가 매우 중요합니다. 특히 부모님과의 관계를 소중히 여기세요. 연인과의 관계에서는 서로를 이해하고 배려하는 자세가 필요합니다. 친구 관계에서는 신중하게 선택하여 깊은 우정을 맺는 것이 좋습니다. 35세 전후에 중요한 인연을 만날 수 있습니다. 목(木)의 기운이 강한 당신은 독립적인 성격으로, 때로는 타인과의 관계에서 거리를 두는 경향이 있습니다. 하지만 가족과의 관계는 매우 중요하며, 특히 부모님과의 관계를 소중히 여겨야 합니다. 친구 관계에서는 신중하게 선택하여 깊은 우정을 맺는 것이 좋으며, 35세 전후에 중요한 인연을 만날 수 있습니다.',
                love: '연애와 결혼에 있어서는 신중한 선택이 필요합니다. 28-30세 사이에 좋은 인연을 만날 수 있으며, 32-34세에 결혼의 기회가 있습니다. 파트너와의 소통이 중요하며, 서로의 개성을 존중하는 관계를 만들어야 합니다. 결혼 후에는 가정의 안정이 중요합니다. 목(木)의 기운이 강한 당신은 독립적인 성격으로, 연애와 결혼에 있어서도 신중한 선택이 필요합니다. 28-30세 사이에 좋은 인연을 만날 수 있으며, 32-34세에 결혼의 기회가 있습니다. 파트너와의 소통이 중요하며, 서로의 개성을 존중하는 관계를 만들어야 합니다. 결혼 후에는 가정의 안정이 중요하며, 특히 자녀와의 관계에서 많은 기쁨을 얻을 수 있습니다. 다만, 때로는 완고한 성격으로 인해 갈등이 생길 수 있으므로, 유연한 사고방식과 타인에 대한 이해가 필요합니다.',
                wealth: '재물운은 안정적으로 형성됩니다. 30대 중반부터 본격적인 재물 축적이 시작되며, 40대에 큰 기회가 있을 수 있습니다. 부동산이나 환경 관련 투자가 유리할 수 있습니다. 다만, 과도한 투기나 위험한 투자는 피해야 합니다. 저축과 투자의 균형이 중요합니다. 목(木)의 기운이 강한 당신은 창의성과 독립성이 필요한 분야에서 재물을 얻을 수 있습니다. 30대 중반부터 본격적인 재물 축적이 시작되며, 40대에 큰 기회가 있을 수 있습니다. 부동산이나 환경 관련 투자가 유리할 수 있으며, 특히 친환경 제품이나 생태 관련 사업에서 성공할 가능성이 높습니다. 다만, 금(金)의 기운이 약한 것은 의사결정의 신중함이 필요함을 의미하므로, 과도한 투기나 위험한 투자는 피해야 합니다. 저축과 투자의 균형이 중요하며, 특히 40대 후반에는 큰 재물의 기회가 있을 수 있으므로, 그때를 대비한 준비가 필요합니다.',
                luck: '길운은 동쪽과 남쪽 방향에 있습니다. 봄과 여름에 행운이 따르며, 특히 3월과 7월에 좋은 기회가 있을 수 있습니다. 행운의 색상은 초록색과 빨간색입니다. 숫자 3과 7이 길한 숫자입니다. 중요한 결정은 오전 9시에서 11시 사이에 하는 것이 좋습니다. 목(木)의 기운이 강한 당신은 동쪽과 남쪽 방향이 길운입니다. 봄과 여름에 행운이 따르며, 특히 3월과 7월에 좋은 기회가 있을 수 있습니다. 행운의 색상은 초록색과 빨간색이며, 이 색상을 활용한 의상이나 소품이 도움이 될 수 있습니다. 숫자 3과 7이 길한 숫자이며, 중요한 결정은 오전 9시에서 11시 사이에 하는 것이 좋습니다. 다만, 금(金)의 기운이 약한 것은 의사결정의 신중함이 필요함을 의미하므로, 중요한 결정은 충분한 고민 후에 내리는 것이 좋습니다. 수(水)의 기운이 보조하는 것은 지적 호기심과 탐구심이 강함을 의미하며, 이를 활용한 학습과 자기계발이 행운을 가져올 수 있습니다.',
                advice: '1. 새로운 시작은 봄에 하는 것이 좋습니다.\n2. 중요한 결정은 충분한 고민 후에 하세요.\n3. 타인과의 관계에서 너무 완벽을 추구하지 마세요.\n4. 건강 관리에 특히 신경 쓰세요.\n5. 재물은 안정적으로 관리하세요.\n6. 독립적인 성격을 유지하되, 타인과의 소통도 중요합니다.\n7. 창의성과 독립성을 활용한 직업 선택이 좋습니다.\n8. 가족과의 관계를 소중히 여기세요.\n9. 스트레스 관리와 건강 관리에 신경 쓰세요.\n10. 중요한 결정은 오전 9시에서 11시 사이에 하세요.'
            };

            // 결과 표시
            displayResults(calculateResult, analysisResult);
            resultSection.style.display = 'block';
            
            // 결과 섹션으로 스크롤
            resultSection.scrollIntoView({ behavior: 'smooth' });
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