import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Divider, TextField, Button, Paper, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShieldIcon from '@mui/icons-material/Shield';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import SendIcon from '@mui/icons-material/Send';
import { askAiChat } from '../utils/apiClient';

interface BrandingIntroProps {
  countryCode: string;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export const BrandingIntro: React.FC<BrandingIntroProps> = ({ countryCode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 초기 웰컴 메시지 세팅
  useEffect(() => {
    setMessages([
      {
        sender: 'bot',
        text: `안녕하세요! 대한민국 외교부 가상 안전 조력 비서 **0404 AI**입니다. 
현재 계신 국가인 **${countryCode}**에 관한 치안/의료 정보, 안전공지 내용 또는 여권 분실, 지진 대피 등 응급 대처법에 대해 질문해 주세요.
(네트워크 차단 시에는 기기 내 백업된 로컬 매뉴얼로 페일오버 작동합니다.)`
      }
    ]);
  }, [countryCode]);

  // 대화 스크롤 하단 고정
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // 전송 처리
  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMsg = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await askAiChat({
        message: userMsg,
        countryCode: countryCode
      });
      setMessages(prev => [...prev, { sender: 'bot', text: response.answer }]);
    } catch (e) {
      console.error('채팅 에러', e);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: '죄송합니다. 현재 AI 챗봇 연결이 원활하지 않습니다. 통신 환경을 재차 점검해 주시기 바랍니다.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
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
          0404 AI 1:1 긴급 대화방
        </Typography>
        <Typography variant="body2" color="text.secondary">
          외교부 공식 안전 지식 데이터베이스 기반 오답률 0%의 AI RAG 헬프데스크
        </Typography>
      </Box>

      {/* 실시간 라이브 챗봇 UI */}
      <Card sx={{ mb: 4, overflow: 'hidden', border: '1px solid #E1E2EC', borderRadius: 4 }}>
        <Box sx={{ px: 2, py: 1.8, backgroundColor: 'primary.main', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon />
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            0404 AI 라이브 도우미 (국가: {countryCode})
          </Typography>
        </Box>
        <CardContent sx={{ p: 0 }}>
          {/* 메시지 영역 */}
          <Box sx={{ height: 350, overflowY: 'auto', p: 2, backgroundColor: '#FAF9FB', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    maxWidth: '85%',
                    borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                    backgroundColor: msg.sender === 'user' ? 'primary.main' : '#FFFFFF',
                    color: msg.sender === 'user' ? '#FFFFFF' : 'text.primary',
                    border: msg.sender === 'user' ? 'none' : '1px solid #E1E2EC',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.5, fontWeight: 500 }}>
                    {msg.text}
                  </Typography>
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                <CircularProgress size={16} color="primary" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  답변을 구상하는 중...
                </Typography>
              </Box>
            )}
            <div ref={chatEndRef} />
          </Box>

          <Divider />

          {/* 입력창 */}
          <Box sx={{ p: 1.5, display: 'flex', gap: 1, backgroundColor: '#FFFFFF' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="여권 분실 대처법이나 현지 치안에 대해 물어보세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              sx={{ minWidth: 50, px: 2, borderRadius: 3 }}
            >
              <SendIcon fontSize="small" />
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 0404 숫자의 의미 */}
      <Card sx={{ mb: 4, borderLeft: '6px solid #0A56A6', borderRadius: 2 }}>
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
