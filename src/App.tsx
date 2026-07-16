import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { theme } from './theme';
import { Dashboard } from './components/Dashboard';
import type { CountryData } from './components/Dashboard';
import { MedicalCopilot } from './components/MedicalCopilot';
import { SafetyGuide } from './components/SafetyGuide';
import { BrandingIntro } from './components/BrandingIntro';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // 0404 AI 탭 아이콘용

// 국가별 가상 데이터 셋
const COUNTRIES: CountryData[] = [
  {
    name: '일본 (도쿄)',
    code: 'JP',
    warningLevel: 1,
    warningText: '여행유의 (1단계)',
    police: '110',
    ambulance: '119',
    embassy: '+81-3-3452-7611',
    recentNotice: '오키나와 인근 지진 발생에 따른 쓰나미 여파 주의. 해안가 접근 자제 및 현지 방송 모니터링 요망.',
  },
  {
    name: '프랑스 (파리)',
    code: 'FR',
    warningLevel: 2,
    warningText: '여행자제 (2단계)',
    police: '17',
    ambulance: '15',
    embassy: '+33-1-4753-0101',
    recentNotice: '파리 시내 시위 발생으로 인파 밀집 지역 방문 자제. 야간 외출 시 개인 소지품 도난 주의.',
  },
  {
    name: '필리핀 (민다나오)',
    code: 'PH',
    warningLevel: 3,
    warningText: '철수권고 (3단계)',
    police: '911',
    ambulance: '911',
    embassy: '+63-2-8856-7188',
    recentNotice: '민다나오 지역 치안 불안 및 무장단체 활동 지속에 따른 신변 안전 유의. 해당 지역 방문객은 즉시 철수 요망.',
  },
  {
    name: '우크라이나 (키이우)',
    code: 'UA',
    warningLevel: 4,
    warningText: '여행금지 (4단계)',
    police: '102',
    ambulance: '103',
    embassy: '+48-22-742-0300 (주폴란드 대사관 임시대피소)',
    recentNotice: '우크라이나 전역 여행금지 발령 중. 즉시 안전한 인근 국가로 대피 및 철수 요망. 무단 입국 시 여권법에 의거 처벌 가능.',
  },
];

function App() {
  // 상태 변수 정의
  const [currentCountry, setCurrentCountry] = useState<CountryData>(COUNTRIES[0]);
  const [tabValue, setTabValue] = useState<number>(0);

  // 국가 변경 핸들러
  const handleCountryChange = (countryName: string) => {
    const found = COUNTRIES.find((c) => c.name === countryName);
    if (found) {
      setCurrentCountry(found);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* 최상단 앱바 */}
      <Box
        sx={{
          py: 2,
          px: 3,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid #E1E2EC',
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
          Safe 0404 Copilot
        </Typography>
      </Box>

      {/* 콘텐츠 영역 */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          px: 2.5,
          pt: 3,
          pb: 10, // 하단 네비게이션 가림 방지 패딩
        }}
      >
        {tabValue === 0 && (
          <Dashboard
            currentCountry={currentCountry}
            onCountryChange={handleCountryChange}
            countries={COUNTRIES}
          />
        )}
        {tabValue === 1 && (
          <MedicalCopilot countryName={currentCountry.name.split(' ')[0]} />
        )}
        {tabValue === 2 && <SafetyGuide />}
        {tabValue === 3 && <BrandingIntro />}
      </Box>

      {/* 하단 네비게이션 탭 */}
      <BottomNavigation
        value={tabValue}
        onChange={(_, newValue) => {
          setTabValue(newValue);
        }}
        showLabels
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid #E1E2EC',
          height: 68,
          backgroundColor: 'background.paper',
          boxShadow: '0px -2px 10px rgba(0,0,0,0.03)',
        }}
      >
        <BottomNavigationAction
          label="홈"
          icon={<HomeIcon />}
          sx={{ '& .MuiBottomNavigationAction-label': { fontWeight: 600 } }}
        />
        <BottomNavigationAction
          label="메디컬 카드"
          icon={<LocalHospitalIcon />}
          sx={{ '& .MuiBottomNavigationAction-label': { fontWeight: 600 } }}
        />
        <BottomNavigationAction
          label="안전 가이드"
          icon={<LibraryBooksIcon />}
          sx={{ '& .MuiBottomNavigationAction-label': { fontWeight: 600 } }}
        />
        <BottomNavigationAction
          label="0404 AI"
          icon={<AutoAwesomeIcon />}
          sx={{ '& .MuiBottomNavigationAction-label': { fontWeight: 600 } }}
        />
      </BottomNavigation>
    </ThemeProvider>
  );
}

export default App;
