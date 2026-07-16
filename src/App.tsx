import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { theme } from './theme';
import { Dashboard } from './components/Dashboard';
import type { CountryData } from './components/Dashboard';
import { MedicalCopilot } from './components/MedicalCopilot';
import { SafetyGuide } from './components/SafetyGuide';
import { BrandingIntro } from './components/BrandingIntro';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { fetchCountries } from './utils/apiClient';

function App() {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [currentCountry, setCurrentCountry] = useState<CountryData | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [onlineStatus, setOnlineStatus] = useState<boolean>(navigator.onLine);

  // 실시간 온라인 여부 리스닝
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 국가 정보 실시간 수집 연동
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const list = await fetchCountries();
        const mappedList: CountryData[] = list.map(c => ({
          name: `${c.name} (${c.code})`,
          code: c.code,
          warningLevel: c.warningLevel,
          warningText: c.warningText,
          police: c.police,
          ambulance: c.ambulance,
          embassy: c.embassy,
          recentNotice: c.recentNotice || '최근 공지 사항이 없습니다.',
        }));
        setCountries(mappedList);
        if (mappedList.length > 0) {
          const defaultCountry = mappedList.find(c => c.code === 'JP') || mappedList[0];
          setCurrentCountry(defaultCountry);
        }
      } catch (err) {
        console.error('국가 데이터를 불러오는데 실패했습니다.', err);
      }
    };
    loadCountries();
  }, [onlineStatus]);

  // 국가 변경 핸들러
  const handleCountryChange = (countryName: string) => {
    const found = countries.find((c) => c.name === countryName);
    if (found) {
      setCurrentCountry(found);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* 오프라인 배너 */}
      {!onlineStatus && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            py: 1,
            backgroundColor: '#FF9800',
            color: '#FFFFFF',
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: 700,
            zIndex: 1000,
          }}
        >
          <WifiOffIcon fontSize="small" />
          네트워크 연결이 끊겼습니다. 안전 모드(로컬 IndexedDB 캐시)로 실행 중입니다.
        </Box>
      )}

      {/* 최상단 앱바 - 스크롤 시에도 상단 고정 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '480px',
          py: 2,
          px: 3,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid #E1E2EC',
          textAlign: 'center',
          zIndex: 100,
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
          px: 2.5,
          pt: '88px', /* fixed 헤더 높이(약 72px) + 여유 여백 */
          pb: '88px', /* fixed BottomNavigation 높이만큼 하단 여백 확보 */
        }}
      >
        {tabValue === 0 && currentCountry && (
          <Dashboard
            currentCountry={currentCountry}
            onCountryChange={handleCountryChange}
            countries={countries}
          />
        )}
        {tabValue === 1 && currentCountry && (
          <MedicalCopilot countryName={currentCountry.code} />
        )}
        {tabValue === 2 && currentCountry && (
          <SafetyGuide countryCode={currentCountry.code} />
        )}
        {tabValue === 3 && currentCountry && (
          <BrandingIntro countryCode={currentCountry.code} />
        )}
      </Box>

      {/* 하단 네비게이션 탭 */}
      <BottomNavigation
        value={tabValue}
        onChange={(_, newValue) => {
          setTabValue(newValue);
        }}
        showLabels
        sx={{
          position: 'fixed', /* absolute → fixed: 브라우저 뷰포트 기준으로 하단 고정 */
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '480px',
          borderTop: '1px solid #E1E2EC',
          height: 68,
          backgroundColor: 'background.paper',
          boxShadow: '0px -2px 10px rgba(0,0,0,0.03)',
          zIndex: 100,
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
