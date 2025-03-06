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

// 결과 생성 함수들
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