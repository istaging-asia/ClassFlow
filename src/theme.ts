import type { ThemeConfig } from 'antd';

// ClassFlow 모던 컬러 팔레트
// Primary: Indigo/Violet 계열 - 신뢰감 있고 세련된 느낌
export const classflowTheme: ThemeConfig = {
  token: {
    colorPrimary: '#5B5BF6',
    colorInfo: '#5B5BF6',
    colorSuccess: '#12B886',
    colorWarning: '#F5A623',
    colorError: '#F5484A',
    colorLink: '#5B5BF6',
    borderRadius: 10,
    borderRadiusLG: 14,
    fontFamily:
      "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Roboto, 'Helvetica Neue', Arial, sans-serif",
    colorBgLayout: '#F5F6FB',
    colorTextBase: '#1D1E2C',
    fontSize: 14,
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      bodyBg: '#F5F6FB',
      headerPadding: '0 24px',
      headerHeight: 64,
    },
    Menu: {
      itemSelectedBg: '#EEEEFE',
      itemSelectedColor: '#5B5BF6',
      itemHoverColor: '#5B5BF6',
      horizontalItemSelectedBg: 'transparent',
      horizontalItemSelectedColor: '#5B5BF6',
    },
    Card: {
      borderRadiusLG: 16,
      boxShadowTertiary:
        '0 1px 2px rgba(20,20,50,0.04), 0 4px 12px rgba(20,20,50,0.04)',
    },
    Button: {
      controlHeight: 38,
      fontWeight: 500,
    },
    Table: {
      headerBg: '#F8F8FD',
      headerColor: '#6B6C80',
      borderColor: '#EEEEF3',
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
};

// 브랜드 그라데이션 (배경/포인트용)
export const brandGradient = 'linear-gradient(135deg, #6C6CF9 0%, #5B5BF6 45%, #4C4CE0 100%)';

export const accentPalette = [
  '#5B5BF6',
  '#12B886',
  '#F5A623',
  '#F5484A',
  '#22B8CF',
  '#845EF7',
];
