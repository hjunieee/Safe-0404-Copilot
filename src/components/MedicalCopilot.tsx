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
} from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // AI Sparkle 아이콘

// 다국어 번역 사전
interface TranslationMap {
  [key: string]: {
    en: string;
    local: string;
  };
}

const SYMPTOM_TRANSLATIONS: TranslationMap = {
  '두통': { en: 'Headache', local: '頭痛 (Headache) / Céphalée' },
  '어지러움': { en: 'Dizziness', local: 'めまい (Dizziness) / Vertige' },
  '의식 저하': { en: 'Altered Consciousness', local: '意識障害 (Altered Consciousness) / Troubles de la conscience' },
  '언어 장애': { en: 'Speech Difficulty', local: '言語障害 (Speech Difficulty) / Difficulté à parler' },
  '가슴 통증': { en: 'Chest Pain', local: '胸痛 (Chest Pain) / Douleur thoracique' },
  '호흡 곤란': { en: 'Difficulty Breathing', local: '呼吸困難 (Difficulty Breathing) / Difficulté respiratoire' },
  '심한 기침': { en: 'Severe Coughing', local: '激しい咳 (Severe Coughing) / Toux sévère' },
  '두근거림': { en: 'Palpitations', local: '動悸 (Palpitations) / Palpitations' },
  '극심한 복통': { en: 'Acute Abdominal Pain', local: '激しい腹痛 (Acute Abdominal Pain) / Douleur abdominale aiguë' },
  '지속적인 구토': { en: 'Persistent Vomiting', local: '持続的な嘔吐 (Persistent Vomiting) / Vomissements persistants' },
  '혈변/토혈': { en: 'Blood in Stool/Vomit', local: '血便・吐血 (Blood in Stool/Vomit) / Sang dans les selles/vomissements' },
  '심한 설사': { en: 'Severe Diarrhea', local: '激しい下痢 (Severe Diarrhea) / Diarrhée sévère' },
  '골절 의심': { en: 'Suspected Fracture', local: '骨折の疑い (Suspected Fracture) / Suspicion de fracture' },
  '심한 출혈': { en: 'Severe Bleeding', local: '大出血 (Severe Bleeding) / Hémorragie sévère' },
  '화상': { en: 'Burns', local: '火傷 (Burns) / Brûlures' },
  '급성 발진/알레르기': { en: 'Acute Rash/Allergic Reaction', local: '急性発疹・アレルギー (Acute Rash/Allergic Reaction) / Éruption cutanée aiguë' },
};

const BASE_DISEASE_TRANSLATIONS: TranslationMap = {
  '당뇨': { en: 'Diabetes', local: '糖尿病 (Diabetes) / Diabète' },
  '고혈압': { en: 'Hypertension', local: '高血圧 (Hypertension) / Hypertension' },
  '심장질환': { en: 'Heart Disease', local: '心臓疾患 (Heart Disease) / Maladie cardiaque' },
  '천식': { en: 'Asthma', local: '喘息 (Asthma) / Asthme' },
  '없음': { en: 'None', local: '特になし (None) / Aucun' },
};

const ALLERGY_TRANSLATIONS: TranslationMap = {
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

  // 국가별 타겟 현지어 라벨 획득
  const getLocalLanguageLabel = () => {
    switch (countryName) {
      case '일본':
        return '日本語 (Japanese)';
      case '프랑스':
        return 'Français (French)';
      case '우크라이나':
        return 'Українська (Ukrainian)';
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

  // 결과 생성 트리거
  const handleGenerateCard = () => {
    if (selectedSymptoms.length === 0) return;
    setShowResultCard(true);
  };

  // 초기화 및 뒤로 가기
  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedSymptoms([]);
    setSelectedDiseases(['없음']);
    setSelectedAllergies(['없음']);
    setShowResultCard(false);
  };

  if (showResultCard) {
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
            label="0404 AI"
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

          {/* 환자 기본 진단 정보 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
              [1] SELECTED SYMPTOMS / 호소 증상
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {selectedSymptoms.map((symptom) => (
                <Box
                  key={symptom}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E1E2EC',
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    • {symptom}
                  </Typography>
                  <Typography variant="body2" color="primary.main" sx={{ pl: 2, fontWeight: 500 }}>
                    EN: {SYMPTOM_TRANSLATIONS[symptom]?.en || symptom}
                  </Typography>
                  <Typography variant="body2" color="error.main" sx={{ pl: 2, fontWeight: 600 }}>
                    LOCAL ({getLocalLanguageLabel()}): {SYMPTOM_TRANSLATIONS[symptom]?.local || symptom}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* 과거력/기저질환 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
              [2] MEDICAL HISTORY / 기저 질환
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
              {selectedDiseases.map((d) => (
                <Chip
                  key={d}
                  label={`${d} (EN: ${BASE_DISEASE_TRANSLATIONS[d]?.en || d})`}
                  color={d === '없음' ? 'default' : 'primary'}
                  variant="outlined"
                  sx={{ fontWeight: 600, borderRadius: 2 }}
                />
              ))}
            </Box>
          </Box>

          {/* 알레르기 정보 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
              [3] DRUG ALLERGIES / 약물 알레르기
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
              {selectedAllergies.map((a) => (
                <Chip
                  key={a}
                  label={`${a} (EN: ${ALLERGY_TRANSLATIONS[a]?.en || a})`}
                  color={a === '없음' ? 'default' : 'error'}
                  variant="outlined"
                  sx={{ fontWeight: 600, borderRadius: 2 }}
                />
              ))}
            </Box>
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
