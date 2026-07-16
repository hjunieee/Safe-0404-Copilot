import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, TextField, IconButton, Paper,
  CircularProgress, Chip, Card, CardContent, Divider,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShieldIcon from '@mui/icons-material/Shield';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { askAiChat } from '../utils/apiClient';

interface BrandingIntroProps {
  countryCode: string;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

/* ───────── 알아보기 페이지 ───────── */
const AiAboutPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const features = [
    {
      icon: <ShieldIcon />,
      color: 'primary' as const,
      title: '오답 없는 RAG 아키텍처',
      desc: '범용 AI의 할루시네이션 위험을 원천 차단합니다. 오직 외교부 공식 안전 규정 및 대사관 연락처 DB 내에서만 지침을 생성해 절대적 신뢰도를 확보합니다.',
    },
    {
      icon: <WifiOffIcon />,
      color: 'error' as const,
      title: '통신 두절 대비 오프라인 페일오버',
      desc: '재난으로 인터넷망이 단절되어도 앱은 멈추지 않습니다. 관련 국가 연락처와 대처법을 IndexedDB에 백그라운드 캐싱하여, 오프라인에서도 즉시 활용 가능합니다.',
    },
    {
      icon: <TouchAppIcon />,
      color: 'success' as const,
      title: '인체공학적 제로 프롬프트 UI',
      desc: '극도의 패닉 상태에서는 텍스트 정밀 입력이 불가능합니다. 한 손 터치와 체크리스트 조립만으로 다국어 의료 문서를 즉시 완성하도록 설계했습니다.',
    },
  ];

  return (
    <Box sx={{ pb: 4 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={onBack} size="small" sx={{ color: 'text.primary' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          0404 AI 알아보기
        </Typography>
      </Box>

      {/* 왜 0404인가 */}
      <Card sx={{ mb: 3, borderLeft: '4px solid', borderLeftColor: 'primary.main', borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <LocalPhoneIcon color="primary" />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>왜 '0404' 인가요?</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            해외 위기 상황에서 가장 먼저 찾아야 하는 번호는 외교부 영사콜센터{' '}
            <strong>02-3210-0404</strong>입니다.
            <br /><br />
            <strong>0404 AI</strong>는 이 번호에서 영감을 얻어, 낯선 이국땅에서도 대한민국 정부가
            언제나 곁에 있다는 심리적 신뢰와 든든함을 제공하기 위해 탄생했습니다.
          </Typography>
        </CardContent>
      </Card>

      {/* 3대 기술 지향성 */}
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 800 }}>3대 기술 지향성</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        {features.map((item) => (
          <Card key={item.title} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: `${item.color}.light`,
                    color: `${item.color}.main`,
                    display: 'flex',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />
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

/* ───────── 메인 채팅 페이지 ───────── */
export const BrandingIntro: React.FC<BrandingIntroProps> = ({ countryCode }) => {
  const [view, setView] = useState<'chat' | 'about'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // 초기 웰컴 메시지 (마운트 1회만)
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setMessages([
      {
        sender: 'bot',
        text: `안녕하세요! 대한민국 외교부 가상 안전 조력 비서 0404 AI입니다.\n\n현재 국가 [${countryCode}]에 관한 치안·의료 정보, 안전공지, 여권 분실 대처, 지진 대피 등 응급 상황에 대해 자유롭게 질문해 주세요.\n\n(오프라인 시 기기 내 로컬 캐시로 자동 전환됩니다.)`,
      },
    ]);
  }, [countryCode]);

  // 새 메시지 전송 시에만 스크롤 (초기 마운트 시 점프 방지)
  const messageCount = useRef(0);
  useEffect(() => {
    const current = messages.length + (loading ? 1 : 0);
    if (current > messageCount.current) {
      messageCount.current = current;
      // 첫 번째 웰컴 메시지는 스크롤하지 않음
      if (messages.length > 1 || loading) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;
    const userMsg = inputValue;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue('');
    setLoading(true);
    try {
      const response = await askAiChat({ message: userMsg, countryCode });
      setMessages((prev) => [...prev, { sender: 'bot', text: response.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '죄송합니다. 현재 AI 연결이 원활하지 않습니다. 통신 환경을 재차 점검해 주세요.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (view === 'about') {
    return <AiAboutPage onBack={() => setView('chat')} />;
  }

  return (
    /* 하단 입력 바(~58px) + BottomNavigation(68px) 공간 확보 */
    <Box sx={{ pb: '70px' }}>

      {/* 채팅 헤더 행 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              0404 AI
            </Typography>
            <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 600 }}>
              ● 온라인
            </Typography>
          </Box>
        </Box>

        {/* 알아보기 버튼 */}
        <Chip
          icon={<InfoOutlinedIcon sx={{ fontSize: '0.9rem !important', color: '#fff !important' }} />}
          label="0404 AI 알아보기"
          size="small"
          onClick={() => setView('about')}
          sx={{
            fontWeight: 700,
            cursor: 'pointer',
            borderRadius: '20px',
            bgcolor: 'primary.main',
            color: '#fff',
            px: 0.5,
            '&:hover': { bgcolor: 'primary.dark' },
            '& .MuiChip-icon': { color: '#fff' },
          }}
        />
      </Box>

      {/* 메시지 목록 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 1,
            }}
          >
            {/* 봇 아바타 */}
            {msg.sender === 'bot' && (
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mb: 0.5,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 13, color: '#fff' }} />
              </Box>
            )}

            {/* 말풍선 — M3 bubble radius */}
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1.2,
                maxWidth: '80%',
                borderRadius:
                  msg.sender === 'user'
                    ? '20px 20px 4px 20px'   // 사용자: 우하단 꺾임
                    : '20px 20px 20px 4px',  // 봇: 좌하단 꺾임
                bgcolor: msg.sender === 'user' ? 'primary.main' : '#EEF1FF',
                color: msg.sender === 'user' ? '#fff' : 'text.primary',
              }}
            >
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-line', lineHeight: 1.65, fontWeight: 500 }}
              >
                {msg.text}
              </Typography>
            </Paper>
          </Box>
        ))}

        {/* 로딩 표시 */}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <Box
              sx={{
                width: 28, height: 28, borderRadius: '50%', bgcolor: 'primary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 13, color: '#fff' }} />
            </Box>
            <Paper
              elevation={0}
              sx={{ px: 2, py: 1.2, borderRadius: '20px 20px 20px 4px', bgcolor: '#EEF1FF' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CircularProgress size={12} color="primary" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  답변 생성 중...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>

      {/* 고정 입력 바 — BottomNavigation(68px) 바로 위 */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 68,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '480px',
          px: 2,
          py: 1,
          bgcolor: 'background.paper',
          borderTop: '1px solid #E1E2EC',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          zIndex: 99,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="여권 분실, 현지 치안, 응급 대처법 등을 물어보세요..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              backgroundColor: '#F4F4F8',
              '& fieldset': { border: 'none' },
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={loading || !inputValue.trim()}
          sx={{
            bgcolor: 'primary.main',
            color: '#fff',
            borderRadius: '50%',
            width: 40,
            height: 40,
            flexShrink: 0,
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: '#E1E2EC', color: '#9E9E9E' },
          }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
};
