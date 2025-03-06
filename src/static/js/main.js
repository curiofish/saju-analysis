document.addEventListener('DOMContentLoaded', function() {
    const sajuForm = document.getElementById('sajuForm');
    const resultSection = document.querySelector('.result-section');

    sajuForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            birthDate: document.getElementById('birthDate').value,
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