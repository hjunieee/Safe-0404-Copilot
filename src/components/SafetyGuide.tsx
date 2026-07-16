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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // AI Sparkle 아이콘

// FAQ 및 가이드 데이터 규격
interface GuideItem {
  id: string;
  category: string;
  title: string;
  content: string;
}

const GUIDE_DATABASE: GuideItem[] = [
  {
    id: 'passport',
    category: '행정 / 분실',
    title: '여권을 분실했을 때 대처 요령',
    content: '1. 가까운 현지 경찰서에 방문하여 여권 분실 신고서(Police Report)를 작성 및 발급받으십시오.\n2. 현지 대한민국 대사관 또는 총영사관을 방문하여 단수여권(긴급여권) 또는 여행증명서를 신청하십시오.\n3. 준비물: 경찰서 분실 신고서, 여권용 사진 2매, 여권 사본(있는 경우), 수수료.',
  },
  {
    id: 'robbery',
    category: '치안 / 도난',
    title: '소매치기 피해 및 긴급 자금 지원 안내',
    content: '1. 현지 경찰서에 즉시 신고하여 분실증명서를 발급받으십시오.\n2. 현금이 모두 분실되어 당장 자금이 필요한 경우 외교부의 [신속해외송금] 제도를 이용할 수 있습니다.\n3. 국내 연고자가 외교부 지정 계좌로 한화를 입금하면, 현지 재외공관에서 즉시 그에 상당하는 외화를 수령할 수 있습니다. (최대 3,000달러 상당)',
  },
  {
    id: 'earthquake',
    category: '재해 / 안전',
    title: '지진 발생 시 행동 지침',
    content: '1. 진동이 진행 중일 때는 튼튼한 탁자나 테이블 밑으로 들어가 머리를 감싸고 보호하십시오.\n2. 빌딩 가나 낙하물이 많은 곳에서 벗어나 넒은 공터(운동장, 공원 등)로 대피하십시오.\n3. 대피 시 엘리베이터는 절대 탑승하지 말고 비상 계단을 이용하십시오.\n4. 가스 밸브를 잠그고 전기 차단기를 내려 화재 위험을 원천 차단하십시오.',
  },
  {
    id: 'arrest',
    category: '사건 / 사고',
    title: '현지 경찰에 체포되거나 연행되었을 때',
    content: '1. 불리한 진술을 피하고, 묵비권을 행사할 권리가 있음을 인지하십시오.\n2. 체포 즉시 대한민국 영사와의 접견(영사접견권)을 강하게 요청하십시오.\n3. 현지 재외공관 영사는 체포 경위를 파악하고, 부당한 대우가 없는지 감시하며, 현지 변호사 및 통역인 명단을 제공하는 등의 법률 조력을 수행합니다.',
  },
];

export const SafetyGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeAccordion, setActiveAccordion] = useState<string | false>(false);

  // 로컬 스토리지 캐싱 적재
  useEffect(() => {
    localStorage.setItem('safe0404_cached_guides', JSON.stringify(GUIDE_DATABASE));
  }, []);

  // 통신 여부에 따른 출력 데이터 선택
  const getDisplayData = () => {
    if (isOnline) {
      return GUIDE_DATABASE;
    } else {
      const localData = localStorage.getItem('safe0404_cached_guides');
      return localData ? JSON.parse(localData) : [];
    }
  };

  // 키워드 필터링 적용
  const filteredData = getDisplayData().filter(
    (item: GuideItem) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 아코디언 핸들러
  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (event) {
      setActiveAccordion(isExpanded ? panel : false);
    }
  };

  return (
    <Box sx={{ pb: 14 }}> {/* 하단 플로팅 검색바 여백 확보 */}
      {/* 컴포넌트 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
          디지털 응급 가이드
        </Typography>
        <Typography variant="body2" color="text.secondary">
          외교부 공식 공공데이터 기반 위기 대응 가이드북입니다. 상황을 채팅하듯 입력하여 맞춤형 공식 지침을 검색할 수 있습니다.
        </Typography>
      </Box>

      {/* 오프라인 페일오버 시스템 제어판 */}
      <Card
        sx={{
          mb: 3,
          backgroundColor: isOnline ? 'rgba(76, 175, 80, 0.05)' : 'rgba(244, 67, 54, 0.05)',
          borderColor: isOnline ? 'success.light' : 'error.light',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
              {isOnline ? (
                <WifiIcon color="success" sx={{ fontSize: 24, flexShrink: 0 }} />
              ) : (
                <WifiOffIcon color="error" sx={{ fontSize: 24, flexShrink: 0 }} />
              )}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: isOnline ? 'success.dark' : 'error.dark' }}>
                  {isOnline ? '온라인 모드 (실시간 데이터 연동)' : '오프라인 모드 (IndexedDB 페일오버 활성화)'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isOnline
                    ? '네트워크가 정상 작동 중입니다. 데이터가 로컬 스토리지에 백그라운드 캐싱됩니다.'
                    : '통신 단절 재난 상황을 가정하여, 기기 내부에 저장된 캐싱 데이터만으로 구동됩니다.'}
                </Typography>
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
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
      {!isOnline && (
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
          {filteredData.map((item: GuideItem) => (
            <Accordion
              key={item.id}
              expanded={activeAccordion === item.id}
              onChange={handleAccordionChange(item.id)}
              disableGutters
              elevation={0}
              sx={{
                mb: 1.5,
                border: '1px solid #E1E2EC',
                borderRadius: '16px !important',
                '&::before': { display: 'none' },
                overflow: 'hidden',
                backgroundColor: activeAccordion === item.id ? 'primary.light' : 'background.paper',
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
                    label={item.category}
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
                  {item.content}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Card sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            검색 결과가 없습니다. 다른 상황을 묘사해 보세요.
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
