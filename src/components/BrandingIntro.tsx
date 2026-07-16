import React from 'react';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShieldIcon from '@mui/icons-material/Shield';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

export const BrandingIntro: React.FC = () => {
  return (
    <Box sx={{ pb: 4 }}>
      {/* 타이틀 및 헤더 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              backgroundColor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 40 }} />
          </Box>
        </Box>
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
          0404 AI 브랜드 스토리
        </Typography>
        <Typography variant="body2" color="text.secondary">
          외교부 영사 조력 시스템의 신뢰성과 첨단 AI 기술이 결합된 독창적인 재외국민 안전 플랫폼
        </Typography>
      </Box>

      {/* 0404 숫자의 의미 */}
      <Card sx={{ mb: 4, borderLeft: '6px solid #0A56A6' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <LocalPhoneIcon color="primary" />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              왜 '0404' 인가요?
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            해외에서 예기치 못한 위기 상황에 처했을 때 가장 먼저 찾아야 하는 번호는 외교부 영사콜센터 핫라인인 <strong>02-3210-0404</strong>입니다.
            <br />
            <br />
            <strong>0404 AI</strong>는 이 상징적인 번호에서 영감을 얻어, 낯선 환경에서도 대한민국 정부가 언제나 곁에서 생명줄을 이어주고 있다는 심리적 신뢰와 든든함을 제공하고자 탄생했습니다.
          </Typography>
        </CardContent>
      </Card>

      {/* 3대 핵심 가치 */}
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 800 }}>
        0404 AI 3대 기술 지향성
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        
        {/* 가치 1: RAG 신뢰성 */}
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
              <Box
                sx={{
                  p: 1.2,
                  borderRadius: 3,
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    오답 없는 RAG 아키텍처
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  범용 AI가 지닌 치명적인 오정보(할루시네이션) 위험을 철저히 극복합니다. 오직 검색(Retrieval)된 <strong>외교부 공식 안전 규정 및 대사관 연락처</strong> 데이터베이스 내에서만 AI가 지침을 생성하여 절대적인 신뢰도를 갖춥니다.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 가치 2: 오프라인 페일오버 */}
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
              <Box
                sx={{
                  p: 1.2,
                  borderRadius: 3,
                  backgroundColor: 'error.light',
                  color: 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <WifiOffIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    통신 두절 대비 오프라인 페일오버
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  재난 등으로 인터넷망이 단절되더라도 앱이 마비되지 않습니다. 네트워크 연결이 정상인 시점에 관련 국가의 연락처와 대처법을 <strong>IndexedDB에 백그라운드 캐싱</strong>하여, 오프라인 시에도 즉시 활용 가능한 하이브리드 로직을 완성했습니다.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* 가치 3: 제로 프롬프트 */}
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
              <Box
                sx={{
                  p: 1.2,
                  borderRadius: 3,
                  backgroundColor: 'success.light',
                  color: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <TouchAppIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    인체공학적 제로 프롬프트 UI
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  사용자가 극도로 혼란스러운 패닉 상태일 때 텍스트를 정밀 입력하는 것은 불가능합니다. 한 손 터치와 부위별 체크리스트 조립으로 원하는 모든 결과물을 얻을 수 있도록 사용자 경험을 정교하게 깎아냈습니다.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

      </Box>

      <Divider sx={{ my: 4 }} />

      {/* 브랜드 철학 문구 */}
      <Box sx={{ textAlign: 'center', px: 2 }}>
        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700, mb: 1 }}>
          "낯선 이국의 거친 환경 속에서도, 대한민국 영사의 보호는 계속됩니다."
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Safe 0404 Copilot은 대한민국 재외국민의 안전을 위한 지능형 인프라 기술을 선도합니다.
        </Typography>
      </Box>
    </Box>
  );
};
