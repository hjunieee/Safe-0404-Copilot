import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HubIcon from '@mui/icons-material/Hub';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // AI Sparkle 아이콘

// 국가별 안전 데이터 규격
export interface CountryData {
  name: string;
  code: string;
  warningLevel: number; // 1: 여행유의, 2: 여행자제, 3: 철수권고, 4: 여행금지
  warningText: string;
  police: string;
  ambulance: string;
  embassy: string;
  recentNotice: string;
}

interface DashboardProps {
  currentCountry: CountryData;
  onCountryChange: (countryName: string) => void;
  countries: CountryData[];
}

// 대시보드 컴포넌트
export const Dashboard: React.FC<DashboardProps> = ({
  currentCountry,
  onCountryChange,
  countries,
}) => {
  // 여행경보 색상 획득
  const getWarningLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return '#FFC107'; // 여행유의: 황색
      case 2:
        return '#FF9800'; // 여행자제: 주황색
      case 3:
        return '#E65100'; // 철수권고: 적색계열
      case 4:
        return '#BA1A1A'; // 여행금지: 흑적색
      default:
        return '#4CAF50';
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* 가상 위치 설정 제어판 */}
      <Card sx={{ mb: 3, backgroundColor: 'primary.light', border: 'none' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="primary.dark" sx={{ fontWeight: 500 }}>
                📍 가상 GPS 위치 설정
              </Typography>
              <Typography variant="caption" color="text.secondary">
                국가 변경 시 경보 단계 및 비상 연락망 자동 갱신
              </Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="country-select-label">현재 체류 국가</InputLabel>
              <Select
                labelId="country-select-label"
                value={currentCountry.name}
                label="현재 체류 국가"
                onChange={(e) => onCountryChange(e.target.value as string)}
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  fontSize: '0.9rem',
                }}
              >
                {countries.map((c) => (
                  <MenuItem key={c.name} value={c.name}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* 여행경보 및 현황 보드 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
          현재 GPS 기준 감지 위치
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
          {currentCountry.name}
        </Typography>
        <Chip
          icon={<WarningAmberIcon style={{ color: '#FFFFFF', fontSize: '1rem' }} />}
          label={`${currentCountry.warningText}`}
          sx={{
            backgroundColor: getWarningLevelColor(currentCountry.warningLevel),
            color: '#FFFFFF',
            fontWeight: 600,
            px: 1,
            py: 0.5,
            borderRadius: '8px',
          }}
        />
      </Box>

      {/* 실시간 긴급 핫라인 다이얼 */}
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
        긴급 핫라인 (원클릭 다이얼)
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2, mb: 4 }}>
        <Box sx={{ gridColumn: 'span 12' }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            size="large"
            startIcon={<PhoneEnabledIcon />}
            href={`tel:${currentCountry.embassy}`}
            sx={{
              py: 2,
              fontSize: '1.05rem',
              borderRadius: 4,
              boxShadow: '0px 4px 12px rgba(186, 26, 26, 0.2)',
            }}
          >
            현지 대한민국 대사관 연결 ({currentCountry.embassy})
          </Button>
        </Box>
        <Box sx={{ gridColumn: 'span 6' }}>
          <Card
            sx={{
              textAlign: 'center',
              cursor: 'pointer',
              height: '100%',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <LocalPoliceIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                현지 경찰
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main', mt: 0.5 }}>
                {currentCountry.police}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                href={`tel:${currentCountry.police}`}
                sx={{ mt: 1.5, borderRadius: 3 }}
              >
                전화 걸기
              </Button>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ gridColumn: 'span 6' }}>
          <Card
            sx={{
              textAlign: 'center',
              cursor: 'pointer',
              height: '100%',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <CardContent sx={{ py: 3 }}>
              <MedicalServicesIcon color="error" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                현지 구급차
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 700, color: 'error.main', mt: 0.5 }}>
                {currentCountry.ambulance}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                href={`tel:${currentCountry.ambulance}`}
                sx={{ mt: 1.5, borderRadius: 3 }}
              >
                전화 걸기
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 영사콜센터 공통 라인 */}
      <Card sx={{ mb: 4, border: '1px solid #D3E4F9', backgroundColor: 'background.paper' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                backgroundColor: 'primary.light',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <HubIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                외교부 영사콜센터 (24시간)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                해외 +82-2-3210-0404 (유료)
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              href="tel:+82-2-3210-0404"
              sx={{ borderRadius: 3, px: 2, flexShrink: 0 }}
            >
              통화
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 실시간 위치 안전 정보 공지 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 2 }}>
        <AutoAwesomeIcon color="primary" sx={{ fontSize: '1.15rem' }} />
        <Typography variant="h3" sx={{ fontWeight: 700, m: 0 }}>
          0404 AI 실시간 안전 공지
        </Typography>
      </Box>
      <Card sx={{ borderLeft: `6px solid ${getWarningLevelColor(currentCountry.warningLevel)}` }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 1.5 }}>
            <WarningAmberIcon
              style={{ color: getWarningLevelColor(currentCountry.warningLevel), marginTop: '2px', flexShrink: 0 }}
            />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {currentCountry.name} 여행 경보 세부 지침
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {currentCountry.recentNotice}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                * 본 가이드는 외교부 안전정보 API 데이터 기반으로 작성되었으며, 오프라인 상태에서도 IndexedDB 캐싱을 통해 즉시 확인 가능합니다.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
