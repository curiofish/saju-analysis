document.addEventListener('DOMContentLoaded', function() {
    // 연도 선택 옵션 생성
    const yearSelect = document.getElementById('birthYear');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '년';
        yearSelect.appendChild(option);
    }

    // 월 선택에 따른 일자 옵션 생성
    const monthSelect = document.getElementById('birthMonth');
    const daySelect = document.getElementById('birthDay');

    function updateDays() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        
        // 기존 일자 옵션 제거
        daySelect.innerHTML = '<option value="">선택하세요</option>';
        
        if (year && month) {
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const option = document.createElement('option');
                option.value = day;
                option.textContent = day + '일';
                daySelect.appendChild(option);
            }
        }
    }

    monthSelect.addEventListener('change', updateDays);
    yearSelect.addEventListener('change', updateDays);

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

        const formData = {
            name: document.getElementById('name').value,
            birthYear: year,
            birthMonth: month,
            birthDay: day,
            birthHour: hour,
            isLunar: document.getElementById('isLunar').checked,
            gender: document.getElementById('gender').value,
            location: document.getElementById('location').value
        };

        try {
            // 사주 계산 API 호출
            const calculateResponse = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const calculateResult = await calculateResponse.json();

            // 사주 분석 API 호출
            const analysisResponse = await fetch('/api/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(calculateResult)
            });

            const analysisResult = await analysisResponse.json();

            // 결과 표시
            displayResults(calculateResult, analysisResult);
            resultSection.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
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