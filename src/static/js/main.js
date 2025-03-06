document.addEventListener('DOMContentLoaded', function() {
    const sajuForm = document.getElementById('sajuForm');
    const resultSection = document.querySelector('.result-section');

    // 입력값 검증 함수
    function validateDate(year, month, day) {
        const date = new Date(year, month - 1, day);
        return date.getDate() === day && date.getMonth() === month - 1;
    }

    sajuForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const year = parseInt(document.getElementById('birthYear').value);
        const month = parseInt(document.getElementById('birthMonth').value);
        const day = parseInt(document.getElementById('birthDay').value);
        const hour = parseInt(document.getElementById('birthHour').value);

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
            personality: '당신은 성실하고 책임감이 강한 성격을 가지고 있습니다. 새로운 도전을 즐기며, 타인을 돕는 것을 좋아합니다.',
            career: '관리직, 교육자, 의료인, 연구원 등의 직업이 적합합니다. 특히 타인을 돕고 가르치는 일에서 큰 성취를 이룰 수 있습니다.',
            health: '심장과 혈관 건강에 주의가 필요합니다. 규칙적인 운동과 건강한 식습관을 유지하세요.',
            relationships: '가족과의 관계가 매우 중요합니다. 특히 부모님과의 관계를 소중히 여기세요. 연인과의 관계에서는 서로를 이해하고 배려하는 자세가 필요합니다.'
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
        document.getElementById('personality').textContent = analysisResult.personality;
        document.getElementById('career').textContent = analysisResult.career;
        document.getElementById('health').textContent = analysisResult.health;
        document.getElementById('relationships').textContent = analysisResult.relationships;
    }
}); 