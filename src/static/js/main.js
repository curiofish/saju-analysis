document.addEventListener('DOMContentLoaded', function() {
    const sajuForm = document.getElementById('sajuForm');
    const resultSection = document.querySelector('.result-section');
    const birthHourType = document.getElementById('birthHourType');
    const hour24Input = document.getElementById('hour24Input');
    const hourTraditionalInput = document.getElementById('hourTraditionalInput');

    // 생시 입력 방식 전환
    birthHourType.addEventListener('change', function() {
        if (this.value === '24hour') {
            hour24Input.style.display = 'block';
            hourTraditionalInput.style.display = 'none';
        } else {
            hour24Input.style.display = 'none';
            hourTraditionalInput.style.display = 'block';
        }
    });

    // 입력값 검증 함수
    function validateDate(year, month, day) {
        const date = new Date(year, month - 1, day);
        return date.getDate() === day && date.getMonth() === month - 1;
    }

    sajuForm.addEventListener('submit', function(e) {
        e.preventDefault();

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
            alert('모든 필드를 입력해주세요.');
            return;
        }

        // 날짜 유효성 검사
        if (!validateDate(year, month, day)) {
            alert('올바른 날짜를 입력해주세요.');
            return;
        }

        // 시간 유효성 검사
        if (hour < 0 || hour > 23) {
            alert('올바른 시간을 입력해주세요 (0-23).');
            return;
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
            basicInfo: '당신의 사주는 목(木)이 강한 형상입니다. 봄의 기운이 강하여 새로운 시작과 성장을 상징합니다.',
            personality: '당신은 성실하고 책임감이 강한 성격을 가지고 있습니다. 새로운 도전을 즐기며, 타인을 돕는 것을 좋아합니다. 창의적이고 독립적인 성격으로, 자신의 의견을 잘 표현하는 편입니다. 때로는 완벽을 추구하는 성격이 있어 스트레스를 받을 수 있습니다.',
            career: '관리직, 교육자, 의료인, 연구원 등의 직업이 적합합니다. 특히 타인을 돕고 가르치는 일에서 큰 성취를 이룰 수 있습니다. 창의적인 분야나 환경 보호, 생태 관련 직업도 좋은 선택이 될 수 있습니다. 30대 후반부터 40대 초반에 경력 전환의 기회가 있을 수 있습니다.',
            health: '심장과 혈관 건강에 주의가 필요합니다. 규칙적인 운동과 건강한 식습관을 유지하세요. 특히 봄철에는 알레르기나 호흡기 질환에 주의가 필요합니다. 스트레스 관리가 중요하며, 명상이나 요가와 같은 정신적 안정을 위한 활동을 추천합니다.',
            relationships: '가족과의 관계가 매우 중요합니다. 특히 부모님과의 관계를 소중히 여기세요. 연인과의 관계에서는 서로를 이해하고 배려하는 자세가 필요합니다. 친구 관계에서는 신중하게 선택하여 깊은 우정을 맺는 것이 좋습니다. 35세 전후에 중요한 인연을 만날 수 있습니다.',
            love: '연애와 결혼에 있어서는 신중한 선택이 필요합니다. 28-30세 사이에 좋은 인연을 만날 수 있으며, 32-34세에 결혼의 기회가 있습니다. 파트너와의 소통이 중요하며, 서로의 개성을 존중하는 관계를 만들어야 합니다. 결혼 후에는 가정의 안정이 중요합니다.',
            wealth: '재물운은 안정적으로 형성됩니다. 30대 중반부터 본격적인 재물 축적이 시작되며, 40대에 큰 기회가 있을 수 있습니다. 부동산이나 환경 관련 투자가 유리할 수 있습니다. 다만, 과도한 투기나 위험한 투자는 피해야 합니다. 저축과 투자의 균형이 중요합니다.',
            luck: '길운은 동쪽과 남쪽 방향에 있습니다. 봄과 여름에 행운이 따르며, 특히 3월과 7월에 좋은 기회가 있을 수 있습니다. 행운의 색상은 초록색과 빨간색입니다. 숫자 3과 7이 길한 숫자입니다. 중요한 결정은 오전 9시에서 11시 사이에 하는 것이 좋습니다.',
            advice: '1. 새로운 시작은 봄에 하는 것이 좋습니다.\n2. 중요한 결정은 충분한 고민 후에 하세요.\n3. 타인과의 관계에서 너무 완벽을 추구하지 마세요.\n4. 건강 관리에 특히 신경 쓰세요.\n5. 재물은 안정적으로 관리하세요.'
        };

        // 결과 표시
        displayResults(calculateResult, analysisResult);
        resultSection.style.display = 'block';
    });

    function displayResults(calculateResult, analysisResult) {
        // 사주 차트 표시
        const pillars = ['year', 'month', 'day', 'hour'];
        pillars.forEach(pillar => {
            const pillarElement = document.querySelector(`.${pillar}-pillar`);
            pillarElement.querySelector('.heavenly-stem').textContent = calculateResult[pillar].stem;
            pillarElement.querySelector('.earthly-branch').textContent = calculateResult[pillar].branch;
        });

        // 분석 결과 표시
        document.getElementById('basicInfo').textContent = analysisResult.basicInfo;
        document.getElementById('personality').textContent = analysisResult.personality;
        document.getElementById('career').textContent = analysisResult.career;
        document.getElementById('health').textContent = analysisResult.health;
        document.getElementById('relationships').textContent = analysisResult.relationships;
        document.getElementById('love').textContent = analysisResult.love;
        document.getElementById('wealth').textContent = analysisResult.wealth;
        document.getElementById('luck').textContent = analysisResult.luck;
        document.getElementById('advice').textContent = analysisResult.advice;
    }
}); 