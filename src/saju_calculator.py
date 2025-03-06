from datetime import datetime
from korean_lunar_calendar import KoreanLunarCalendar

class SajuCalculator:
    # 천간
    HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
    # 지지
    EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    # 오행
    FIVE_ELEMENTS = ['木', '火', '土', '金', '水']

    @staticmethod
    def convert_lunar_to_solar(year, month, day):
        calendar = KoreanLunarCalendar()
        calendar.setLunarDate(year, month, day, False)
        return calendar.getSolarDate()

    @staticmethod
    def get_year_pillar(year):
        stem_index = (year - 4) % 10
        branch_index = (year - 4) % 12
        return {
            'stem': SajuCalculator.HEAVENLY_STEMS[stem_index],
            'branch': SajuCalculator.EARTHLY_BRANCHES[branch_index]
        }

    @staticmethod
    def get_month_pillar(year, month):
        # TODO: 월주 계산 로직 구현
        pass

    @staticmethod
    def get_day_pillar(year, month, day):
        # TODO: 일주 계산 로직 구현
        pass

    @staticmethod
    def get_hour_pillar(day_stem, hour):
        # TODO: 시주 계산 로직 구현
        pass

    @staticmethod
    def calculate_four_pillars(birth_date, is_lunar=False):
        if is_lunar:
            year, month, day = SajuCalculator.convert_lunar_to_solar(
                birth_date.year, birth_date.month, birth_date.day
            )
        else:
            year, month, day = birth_date.year, birth_date.month, birth_date.day

        year_pillar = SajuCalculator.get_year_pillar(year)
        month_pillar = SajuCalculator.get_month_pillar(year, month)
        day_pillar = SajuCalculator.get_day_pillar(year, month, day)
        hour_pillar = SajuCalculator.get_hour_pillar(day_pillar['stem'], birth_date.hour)

        return {
            'year': year_pillar,
            'month': month_pillar,
            'day': day_pillar,
            'hour': hour_pillar
        } 