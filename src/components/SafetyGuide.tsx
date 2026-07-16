import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { fetchNotices, isOnline as checkOnline } from '../utils/apiClient';
import type { OfflineNotice } from '../utils/localDb';

interface SafetyGuideProps {
  countryCode: string;
}

export const SafetyGuide: React.FC<SafetyGuideProps> = ({ countryCode }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notices, setNotices] = useState<OfflineNotice[]>([]);
  const [isOnlineSim, setIsOnlineSim] = useState<boolean>(checkOnline());
  const [activeAccordion, setActiveAccordion] = useState<string | false>(false);

  // 실시간 공지 로드 (온라인 / 오프라인 감지 연동)
  useEffect(() => {
    const loadNotices = async () => {
      try {
        const data = await fetchNotices(countryCode);
        setNotices(data);
      } catch (err) {
        console.error('공지 데이터를 불러오는데 실패했습니다.', err);
      }
    };
    loadNotices();
  }, [countryCode, isOnlineSim]);

  // 키워드 필터링 적용
  const filteredData = notices.filter(
    (item: OfflineNotice) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 아코디언 핸들러
  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (event) {
      setActiveAccordion(isExpanded ? panel : false);
    }
  };

  return (
    <Box sx={{ pb: 14 }}>
      {/* 컴포넌트 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
          디지털 응급 가이드
        </Typography>
        <Typography variant="body2" color="text.secondary">
          외교부 공식 공공데이터 기반 위기 대응 가이드북입니다. 상황을 검색하여 맞춤형 공식 지침을 바로 조회할 수 있습니다.
        </Typography>
      </Box>

      {/* 오프라인 페일오버 시스템 제어판 */}
      <Card
        sx={{
          mb: 3,
          backgroundColor: isOnlineSim ? 'rgba(76, 175, 80, 0.05)' : 'rgba(244, 67, 54, 0.05)',
          borderColor: isOnlineSim ? 'success.light' : 'error.light',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
              {isOnlineSim ? (
                <WifiIcon color="success" sx={{ fontSize: 24, flexShrink: 0 }} />
              ) : (
                <WifiOffIcon color="error" sx={{ fontSize: 24, flexShrink: 0 }} />
              )}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: isOnlineSim ? 'success.dark' : 'error.dark' }}>
                  {isOnlineSim ? '온라인 모드 (실시간 데이터 연동)' : '오프라인 시뮬레이션 모드 (IndexedDB 페일오버 활성화)'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isOnlineSim
                    ? '네트워크가 정상 작동 중입니다. 데이터가 로컬 IndexedDB에 백그라운드 캐싱됩니다.'
                    : '통신 단절 재난 상황을 가정하여, 기기 내부에 저장된 캐싱 데이터만으로 구동됩니다.'}
                </Typography>
              </Box>
            </Box>
            <FormControlLabel
              control = {
                <Switch
                  checked={isOnlineSim}
                  onChange={(e) => {
                    setIsOnlineSim(e.target.checked);
                    // 브라우저의 실제 online 상태 강제 시뮬레이션을 위함
                    if (!e.target.checked) {
                      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
                    } else {
                      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
                    }
                  }}
                  color="success"
                />
              }
              label=""
              sx={{ m: 0 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* 실시간 알림 */}
      {!isOnlineSim && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 3, fontWeight: 500 }}>
          통신 단절 감지로 인해 기기에 백업된 안전 데이터가 IndexedDB로부터 성공적으로 자동 로드되었습니다.
        </Alert>
      )}

      {/* 가이드 아코디언 리스트 */}
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
        위기 상황 대처 매뉴얼 ({filteredData.length}건)
      </Typography>

      {filteredData.length > 0 ? (
        <Box>
          {filteredData.map((item: OfflineNotice, idx: number) => {
            const panelId = `panel-${idx}`;
            return (
              <Accordion
                key={idx}
                expanded={activeAccordion === panelId}
                onChange={handleAccordionChange(panelId)}
                disableGutters
                elevation={0}
                sx={{
                  mb: 1.5,
                  border: '1px solid #E1E2EC',
                  borderRadius: '16px !important',
                  '&::before': { display: 'none' },
                  overflow: 'hidden',
                  backgroundColor: activeAccordion === panelId ? 'primary.light' : 'background.paper',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    px: 2.5,
                    py: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    <Chip
                      label="안전공지"
                      size="small"
                      variant="outlined"
                      color="primary"
                      icon={<BookmarkBorderIcon style={{ fontSize: '0.9rem' }} />}
                      sx={{ fontWeight: 600, flexShrink: 0 }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 700, flexGrow: 1 }}>
                      {item.title}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    px: 2.5,
                    pb: 2.5,
                    pt: 0,
                    backgroundColor: 'background.paper',
                  }}
                >
                  <Divider sx={{ mb: 2 }} />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      whiteSpace: 'pre-line',
                      lineHeight: 1.6,
                      fontWeight: 500,
                    }}
                  >
                    {item.content.replace(/<[^>]*>/g, '')} {/* HTML 태그 스트립 처리 */}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ) : (
        <Card sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            수집된 실시간 안전 가이드가 없습니다. 온라인 동기화를 먼저 진행해 주세요.
          </Typography>
        </Card>
      )}

      {/* 하단 플로팅 상황 검색창 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 68, // 바텀 네비게이션 바로 위 고정
          left: 0,
          right: 0,
          p: 2,
          backgroundColor: 'background.default',
          borderTop: '1px solid #E1E2EC',
          zIndex: 10,
          boxShadow: '0px -6px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* AI 안내 라벨 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, px: 0.5 }}>
          <AutoAwesomeIcon color="primary" sx={{ fontSize: '0.95rem' }} />
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
            0404 AI
          </Typography>
        </Box>
        <TextField
          fullWidth
          placeholder="현재 겪고 계신 상황이나 질문을 입력하세요 (예: 여권을 분실했어요)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 6,
              backgroundColor: 'background.paper',
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <AutoAwesomeIcon color="primary" sx={{ opacity: 0.8 }} />
                </InputAdornment>
              ),
            }
          }}
        />
      </Box>
    </Box>
  );
};
