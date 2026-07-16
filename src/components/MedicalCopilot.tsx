import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // AI Sparkle 아이콘
import { createMedicalCard } from '../utils/apiClient';
import type { OfflineMedicalCard } from '../utils/localDb';

// 기저질환 및 알레르기 체크박스 맵 데이터
const BASE_DISEASE_TRANSLATIONS: Record<string, { en: string; local: string }> = {
  '당뇨': { en: 'Diabetes', local: '糖尿病 (Diabetes) / Diabète' },
  '고혈압': { en: 'Hypertension', local: '高血圧 (Hypertension) / Hypertension' },
  '심장질환': { en: 'Heart Disease', local: '心臓疾患 (Heart Disease) / Maladie cardiaque' },
  '천식': { en: 'Asthma', local: '喘息 (Asthma) / Asthme' },
  '없음': { en: 'None', local: '特になし (None) / Aucun' },
};

const ALLERGY_TRANSLATIONS: Record<string, { en: string; local: string }> = {
  '항생제': { en: 'Antibiotics Allergy', local: '抗生物질アレルギー (Antibiotics) / Allergie aux antibiotiques' },
  '소염진통제': { en: 'NSAIDs Allergy', local: '消炎鎮痛剤アレルギー (NSAIDs) / Allergie aux AINS' },
  '없음': { en: 'None', local: '特하지 않음 (None) / Aucun' },
};

interface MedicalCopilotProps {
  countryName: string;
}

export const MedicalCopilot: React.FC<MedicalCopilotProps> = ({ countryName }) => {
  // 상태 변수 정의
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(['없음']);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['없음']);
  const [showResultCard, setShowResultCard] = useState<boolean>(false);
  const [medicalCardData, setMedicalCardData] = useState<OfflineMedicalCard | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 카테고리 및 세부 증상 데이터
  const symptomCategories = [
    {
      id: 'head',
      name: '머리 / 정신',
      items: ['두통', '어지러움', '의식 저하', '언어 장애'],
    },
    {
      id: 'chest',
      name: '가슴 / 호흡기',
      items: ['가슴 통증', '호흡 곤란', '심한 기침', '두근거림'],
    },
    {
      id: 'abdomen',
      name: '복부 / 소화기',
      items: ['극심한 복통', '지속적인 구토', '혈변/토혈', '심한 설사'],
    },
    {
      id: 'limb',
      name: '골격 / 피부',
      items: ['골절 의심', '심한 출혈', '화상', '급성 발진/알레르기'],
    },
  ];

  // 국가별 타겟 현지어 라벨 획득 (2자리 국가코드 기준)
  const getLocalLanguageLabel = () => {
    switch (countryName) {
      case 'JP':
        return '日本語 (Japanese)';
      case 'FR':
        return 'Français (French)';
      default:
        return 'English (범용 영어)';
    }
  };

  // 증상 선택 토글
  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((item) => item !== symptom) : [...prev, symptom]
    );
  };

  // 기저질환 선택 제어 (배타적 처리 포함)
  const handleDiseaseToggle = (disease: string) => {
    if (disease === '없음') {
      setSelectedDiseases(['없음']);
      return;
    }
    setSelectedDiseases((prev) => {
      const filtered = prev.filter((item) => item !== '없음');
      return filtered.includes(disease)
        ? filtered.filter((item) => item !== disease)
        : [...filtered, disease];
    });
  };

  // 알레르기 선택 제어 (배타적 처리 포함)
  const handleAllergyToggle = (allergy: string) => {
    if (allergy === '없음') {
      setSelectedAllergies(['없음']);
      return;
    }
    setSelectedAllergies((prev) => {
      const filtered = prev.filter((item) => item !== '없음');
      return filtered.includes(allergy)
        ? filtered.filter((item) => item !== allergy)
        : [...filtered, allergy];
    });
  };

  // 결과 생성 트리거 (API 호출 연동)
  const handleGenerateCard = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);

    let targetLanguage = 'EN';
    if (countryName === 'JP') targetLanguage = 'JA';
    else if (countryName === 'FR') targetLanguage = 'FR';

    try {
      const card = await createMedicalCard({
        patientName: 'KOREAN TRAVELER',
        symptoms: selectedSymptoms,
        chronicDiseases: selectedDiseases.filter(d => d !== '없음'),
        targetLanguage: targetLanguage
      });
      setMedicalCardData(card);
      setShowResultCard(true);
    } catch (e) {
      console.error('의료 카드 생성에 실패했습니다.', e);
    } finally {
      setLoading(false);
    }
  };

  // 초기화 및 뒤로 가기
  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedSymptoms([]);
    setSelectedDiseases(['없음']);
    setSelectedAllergies(['없음']);
    setMedicalCardData(null);
    setShowResultCard(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 15, gap: 2 }}>
        <CircularProgress color="error" size={50} />
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 700 }}>
          Medical Copilot이 다국어 긴급 진술문을 작성 중입니다...
        </Typography>
      </Box>
    );
  }

  if (showResultCard && medicalCardData) {
    return (
      <Box sx={{ pb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setShowResultCard(false)}
          sx={{ mb: 3, fontWeight: 600 }}
        >
          증상 수정하기
        </Button>

        {/* 의사 제시용 메디컬 카드 */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: '2px solid',
            borderColor: 'error.main',
            backgroundColor: '#FFFDFD',
          }}
        >
          {/* AI 생성 안내 배지 */}
          <Chip
            icon={<AutoAwesomeIcon style={{ fontSize: '0.9rem', color: '#FFFFFF' }} />}
            label="0404 AI Copilot"
            size="small"
            color="error"
            sx={{ fontWeight: 700, mb: 2, borderRadius: 2 }}
          />

          {/* 카드 헤더 */}
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '50%',
                backgroundColor: 'error.light',
                color: 'error.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MedicalInformationIcon sx={{ fontSize: 32 }} />
            </Box>
            <Box>
              <Typography variant="h3" color="error.main" sx={{ fontWeight: 700 }}>
                MEDICAL DECLARATION
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Show this screen to local medical staff / 현지 의료진 및 약사 제시용
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* 1. 현지 언어 진술문 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="error.main" sx={{ fontWeight: 800, mb: 1, letterSpacing: '0.5px' }}>
              [1] LOCAL LANGUAGE / 현지어 진술문 ({getLocalLanguageLabel()})
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: '#FAF1F1', border: '1px solid', borderColor: 'error.light', borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {medicalCardData.translatedStatement}
              </Typography>
            </Paper>
          </Box>

          {/* 2. 영어 진술문 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 800, mb: 1 }}>
              [2] ENGLISH TRANSLATION / 글로벌 영문 진술문
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: '#F4F7FC', border: '1px solid', borderColor: 'primary.light', borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {medicalCardData.englishStatement}
              </Typography>
            </Paper>
          </Box>

          {/* 3. 한국어 요약 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
              [3] KOREAN SUMMARY / 한국어 요약
            </Typography>
            <Typography variant="body2" sx={{ pl: 1, fontWeight: 500, color: 'text.primary', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
              {medicalCardData.koreanStatement}
            </Typography>
          </Box>

          {/* 4. 긴급 예방 조치 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
              [4] AI EMERGENCY ACTION / AI 권장 비상 대처 요령
            </Typography>
            <Typography variant="body2" sx={{ pl: 1, fontWeight: 500, color: 'text.primary', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {medicalCardData.precautions}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* 하단 정보 제공 고지 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LocalHospitalIcon color="error" sx={{ flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
              This list is generated based on standard medical vocabulary to help cross-border communication.
              이 문진표는 표준 의료 전문 용어에 맞춰 영어 및 현지어로 정밀 치환되었습니다.
            </Typography>
          </Box>
        </Paper>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleReset}
          sx={{ mt: 3, py: 1.8, borderRadius: 4 }}
        >
          처음부터 다시 작성하기
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* 컴포넌트 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            Medical Copilot
          </Typography>
          <Chip
            icon={<AutoAwesomeIcon style={{ fontSize: '0.85rem' }} />}
            label="0404 AI"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          언어 소통이 불가능한 현지 응급실/약국에서 사용할 수 있는 다국어 메디컬 카드를 텍스트 입력 없이 터치만으로 즉시 조립합니다.
        </Typography>
      </Box>

      {/* 1단계: 대분류 부위 선택 */}
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
        [Step 1] 통증 부위 선택
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2, mb: 4 }}>
        {symptomCategories.map((category) => (
          <Box key={category.id} sx={{ gridColumn: 'span 6' }}>
            <Card
              onClick={() => setSelectedCategory(category.id)}
              sx={{
                cursor: 'pointer',
                borderColor: selectedCategory === category.id ? 'primary.main' : '#E1E2EC',
                borderWidth: selectedCategory === category.id ? '2px' : '1px',
                backgroundColor: selectedCategory === category.id ? 'primary.light' : 'background.paper',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <CardContent sx={{ py: 3, px: 2, textAlign: 'center', '&:last-child': { pb: 3 } }}>
                <Typography variant="body1" sx={{ fontWeight: 700, color: selectedCategory === category.id ? 'primary.dark' : 'text.primary' }}>
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* 2단계: 세부 증상 체크 */}
      {selectedCategory && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
            [Step 2] 세부 증상 체크 (다중 선택 가능)
          </Typography>
          <Card>
            <CardContent>
              <FormGroup>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1, width: '100%' }}>
                  {symptomCategories
                    .find((c) => c.id === selectedCategory)
                    ?.items.map((symptom) => (
                      <Box key={symptom} sx={{ gridColumn: 'span 6' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedSymptoms.includes(symptom)}
                              onChange={() => handleSymptomToggle(symptom)}
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {symptom}
                            </Typography>
                          }
                        />
                      </Box>
                    ))}
                </Box>
              </FormGroup>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* 3단계: 과거력 및 알레르기 */}
      <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
        [Step 3] 기저 질환 및 알레르기 (의사 진료용 필수 정보)
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        <Box sx={{ width: '100%' }}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1.5 }}>
                기저 질환 (Medical History)
              </Typography>
              <FormGroup row>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1, width: '100%' }}>
                  {Object.keys(BASE_DISEASE_TRANSLATIONS).map((disease) => (
                    <Box key={disease} sx={{ gridColumn: 'span 4' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedDiseases.includes(disease)}
                            onChange={() => handleDiseaseToggle(disease)}
                          />
                        }
                        label={<Typography variant="caption" sx={{ fontWeight: 600 }}>{disease}</Typography>}
                      />
                    </Box>
                  ))}
                </Box>
              </FormGroup>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ width: '100%' }}>
          <Card>
            <CardContent>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1.5 }}>
                약물 알레르기 (Drug Allergy)
              </Typography>
              <FormGroup row>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1, width: '100%' }}>
                  {Object.keys(ALLERGY_TRANSLATIONS).map((allergy) => (
                    <Box key={allergy} sx={{ gridColumn: 'span 4' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedAllergies.includes(allergy)}
                            onChange={() => handleAllergyToggle(allergy)}
                          />
                        }
                        label={<Typography variant="caption" sx={{ fontWeight: 600 }}>{allergy}</Typography>}
                      />
                    </Box>
                  ))}
                </Box>
              </FormGroup>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 제출 액션 */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        disabled={selectedSymptoms.length === 0}
        onClick={handleGenerateCard}
        startIcon={<CheckCircleIcon />}
        endIcon={<AutoAwesomeIcon />}
        sx={{
          py: 2,
          fontSize: '1rem',
          borderRadius: 4,
          boxShadow: 'none',
        }}
      >
        {selectedSymptoms.length === 0
          ? '증상을 1개 이상 선택해 주세요'
          : `현지어 메디컬 카드 생성하기 (${getLocalLanguageLabel()})`}
      </Button>
    </Box>
  );
};
