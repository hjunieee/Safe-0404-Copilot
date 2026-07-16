import { createTheme } from '@mui/material/styles';

// 머터리얼 3 테마 설정
export const theme = createTheme({
  palette: {
    primary: {
      main: '#0A56A6', // 신뢰성 블루
      light: '#E1F0FF',
      dark: '#003164',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4F5F72', // 차분한 세일러 블루
      light: '#D3E4F9',
      dark: '#171C23',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#BA1A1A', // 비상 경보 레드
      light: '#FFDAD6',
      dark: '#410002',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FF', // 배경색
      paper: '#FFFFFF', // 카드 배경색
    },
    text: {
      primary: '#1A1C1E',
      secondary: '#43474E',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Noto Sans KR", sans-serif',
    h1: {
      fontSize: '2.0rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.2rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.85rem',
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16, // 모서리 둥글기 기본값
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24, // 버튼 둥글기
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: 'none',
          border: '1px solid #E1E2EC', // 아웃라인 카드 형태
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 'auto', // 가로폭 좁아짐 허용
          padding: '6px 0',
          color: '#43474E', // 비활성 상태 색상
          '&.Mui-selected': {
            color: '#0A56A6', // 활성 상태 색상
            paddingTop: '6px', // 활성화 시 위아래 정렬 튐 보정
          },
        },
        label: {
          fontSize: '0.72rem !important', // 글자 크기 고정 (줄바꿈 방지)
          fontWeight: 600,
          marginTop: '3px',
          '&.Mui-selected': {
            fontSize: '0.72rem !important', // 활성화 시 크기 커짐 억제
          },
        },
      },
    },
  },
});
