import { useState, useEffect } from 'react';
import {
  ThemeProvider, CssBaseline, Box, Typography, BottomNavigation,
  BottomNavigationAction, CircularProgress, Button,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<boolean>(false);

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
      setIsLoading(true);
      setFetchError(false);
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
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadCountries();
  }, [onlineStatus]);

  // 국가 변경 핸들러
  const handleCountryChange = (countryName: string) => {
    const found = countries.find((c) => c.name === countryName);
    if (found) setCurrentCountry(found);
  };

  // 재시도 핸들러
  const handleRetry = () => {
    setFetchError(false);
    setIsLoading(true);
    // onlineStatus 토글로 useEffect 재실행
    setOnlineStatus(prev => prev);
    // 직접 재실행
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
      } catch {
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadCountries();
  };

  /* ─── 폴백 UI 렌더러 ─── */
  const renderFallback = () => {
    // 0404 AI 탭은 서버 없이도 사용 가능
    if (tabValue === 3) return null;

    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 14, gap: 2 }}>
          <CircularProgress color="primary" size={44} />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            서버에서 국가 정보를 불러오는 중...
          </Typography>
        </Box>
      );
    }

    if (!onlineStatus) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 10, px: 3, gap: 2 }}>
          <Box sx={{ p: 2.5, borderRadius: '50%', bgcolor: '#FFF3E0', color: '#F57C00', display: 'flex' }}>
            <SignalWifiOffIcon sx={{ fontSize: 44 }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>네트워크 연결 없음</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            현재 오프라인 상태입니다.<br />
            국가 정보를 불러오려면 인터넷에 연결해 주세요.<br />
            <strong>0404 AI 탭</strong>은 오프라인에서도 이용 가능합니다.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setTabValue(3)}
            startIcon={<AutoAwesomeIcon />}
            sx={{ borderRadius: '20px', fontWeight: 700 }}
          >
            0404 AI로 이동
          </Button>
        </Box>
      );
    }

    if (fetchError) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 10, px: 3, gap: 2 }}>
          <Box sx={{ p: 2.5, borderRadius: '50%', bgcolor: '#FEECEC', color: '#D32F2F', display: 'flex' }}>
            <ErrorOutlineIcon sx={{ fontSize: 44 }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>서버 연결 실패</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            서버에 연결할 수 없습니다.<br />
            잠시 후 다시 시도하거나 0404 AI를 이용해 주세요.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleRetry}
              sx={{ borderRadius: '20px', fontWeight: 700 }}
            >
              다시 시도
            </Button>
            <Button
              variant="outlined"
              onClick={() => setTabValue(3)}
              startIcon={<AutoAwesomeIcon />}
              sx={{ borderRadius: '20px', fontWeight: 700 }}
            >
              0404 AI로 이동
            </Button>
          </Box>
        </Box>
      );
    }

    return null;
  };

  const fallback = renderFallback();
  const showContent = !fallback && !!currentCountry;

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
      <Box sx={{ flexGrow: 1, px: 2.5, pt: '88px', pb: '88px' }}>

        {/* 폴백 UI (로딩 / 오프라인 / 에러) */}
        {fallback}

        {/* 정상 콘텐츠 */}
        {showContent && tabValue === 0 && (
          <Dashboard
            currentCountry={currentCountry}
            onCountryChange={handleCountryChange}
            countries={countries}
          />
        )}
        {showContent && tabValue === 1 && (
          <MedicalCopilot countryName={currentCountry.code} />
        )}
        {showContent && tabValue === 2 && (
          <SafetyGuide countryCode={currentCountry.code} />
        )}

        {/* 0404 AI: 서버 없이도 항상 접근 가능 */}
        {tabValue === 3 && (
          <BrandingIntro countryCode={currentCountry?.code ?? 'KR'} />
        )}
      </Box>

      {/* 하단 네비게이션 탭 */}
      <BottomNavigation
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        showLabels
        sx={{
          position: 'fixed',
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
        <BottomNavigationAction label="홈" icon={<HomeIcon />} sx={{ '& .MuiBottomNavigationAction-label': { fontWeight: 600 } }} />
        <BottomNavigationAction label="메디컬 카드" icon={<LocalHospitalIcon />} sx={{ '& .MuiBottomNavigationAction-label': { fontWeight: 600 } }} />
        <BottomNavigationAction label="안전 가이드" icon={<LibraryBooksIcon />} sx={{ '& .MuiBottomNavigationAction-label': { fontWeight: 600 } }} />
        <BottomNavigationAction label="0404 AI" icon={<AutoAwesomeIcon />} sx={{ '& .MuiBottomNavigationAction-label': { fontWeight: 600 } }} />
      </BottomNavigation>
    </ThemeProvider>
  );
}

export default App;
