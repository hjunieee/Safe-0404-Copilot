import {
  saveCountriesToLocal,
  getCountriesFromLocal,
  saveNoticesToLocal,
  getNoticesFromLocal,
  saveMedicalCardToLocal,
  getMedicalCardsFromLocal
} from './localDb';
import type {
  OfflineCountry,
  OfflineNotice,
  OfflineMedicalCard
} from './localDb';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 온라인 여부 판별
export function isOnline(): boolean {
  return navigator.onLine;
}

// 1. 전체 국가 조회 API 호출 (오프라인 호환)
export async function fetchCountries(): Promise<OfflineCountry[]> {
  if (isOnline()) {
    try {
      const response = await fetch(`${BASE_URL}/countries`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: OfflineCountry[] = await response.json();
      
      // 온라인 시 로컬 DB에 자동 동기화
      await saveCountriesToLocal(data);
      return data;
    } catch (e) {
      console.warn('API 호출 실패. 로컬 캐시 데이터로 대체합니다.', e);
      return await getCountriesFromLocal();
    }
  } else {
    console.log('오프라인 상태: 로컬 캐시에서 국가 정보를 로드합니다.');
    return await getCountriesFromLocal();
  }
}

// 2. 국가별 안전공지 조회 API 호출 (오프라인 호환)
export async function fetchNotices(countryCode: string): Promise<OfflineNotice[]> {
  if (isOnline()) {
    try {
      const response = await fetch(`${BASE_URL}/countries/${countryCode}/notices`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data: OfflineNotice[] = await response.json();
      
      // 온라인 시 로컬 DB에 자동 동기화
      await saveNoticesToLocal(countryCode, data);
      return data;
    } catch (e) {
      console.warn(`공지 API 호출 실패 (${countryCode}). 로컬 캐시로 대체합니다.`, e);
      return await getNoticesFromLocal(countryCode);
    }
  } else {
    console.log(`오프라인 상태: 로컬 캐시에서 ${countryCode} 공지 정보를 로드합니다.`);
    return await getNoticesFromLocal(countryCode);
  }
}

// 3. 다국어 의학 긴급 카드 생성 API 호출 (오프라인 호환)
export async function createMedicalCard(requestData: {
  patientName: string;
  symptoms: string[];
  chronicDiseases: string[];
  targetLanguage: string;
}): Promise<OfflineMedicalCard> {
  if (isOnline()) {
    try {
      const response = await fetch(`${BASE_URL}/medical-card`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data: OfflineMedicalCard = await response.json();
      
      // 생성 완료된 의학 카드를 로컬에 캐싱
      await saveMedicalCardToLocal(data);
      return data;
    } catch (e) {
      console.warn('의학 카드 생성 API 실패. 로컬 의학 카드 모의 연동으로 대체합니다.', e);
      return generateMockMedicalCard(requestData);
    }
  } else {
    console.log('오프라인 상태: 로컬 의학 카드 번역 알고리즘을 구동합니다.');
    // 과거에 완전히 동일한 이름으로 생성해 둔 카드가 있다면 그걸 찾아서 우선 제공
    const cachedCards = await getMedicalCardsFromLocal();
    const exactMatch = cachedCards.find(c => c.patientName.toLowerCase() === requestData.patientName.toLowerCase());
    if (exactMatch) {
      return exactMatch;
    }
    // 캐시가 없으면 룰 베이스로 긴급 생성
    const mockCard = generateMockMedicalCard(requestData);
    await saveMedicalCardToLocal(mockCard);
    return mockCard;
  }
}

// 4. 0404 AI RAG 챗봇 질의 API 호출 (오프라인 호환)
export async function askAiChat(requestData: {
  message: string;
  countryCode?: string;
}): Promise<{ answer: string }> {
  if (isOnline()) {
    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (e) {
      console.warn('AI Chat API 실패. 로컬 가짜 응답으로 대체합니다.', e);
      return { answer: generateMockChatAnswer(requestData.message) };
    }
  } else {
    console.log('오프라인 상태: 로컬 룰 베이스 가짜 응답을 구동합니다.');
    return { answer: generateMockChatAnswer(requestData.message) };
  }
}

// 로컬 PWA 전용 가짜 의학 카드 번역기
function generateMockMedicalCard(request: {
  patientName: string;
  symptoms: string[];
  chronicDiseases: string[];
  targetLanguage: string;
}): OfflineMedicalCard {
  const name = request.patientName;
  const symptoms = request.symptoms.join(', ');
  const diseases = request.chronicDiseases.length > 0 ? request.chronicDiseases.join(', ') : '없음';
  const lang = request.targetLanguage.toUpperCase();

  const korean = `[오프라인 매핑] 기저질환 [${diseases}] 보유 환자로, 현재 [${symptoms}] 증상을 호소.`;
  const english = `[Offline Mode] Patient has a history of [${diseases}] and is presenting [${symptoms}] symptoms.`;
  
  let translated = english;
  let precautions = "1. 안정을 취하고 현지 조력을 확보해 주십시오.";

  if (lang === 'JA') {
    translated = `[オフライン] 既往歴 [${diseases}] を有し、現在 [${symptoms}] の症状を訴えています。`;
    precautions = "1. 患者を安静にさせ、呼吸を楽에 유지하십시오.\n2. 즉시 근처 응급 센터(119)에 전화를 넣으십시오.";
  } else if (lang === 'FR') {
    translated = `[Offline] Antécédents de [${diseases}], présente des symptômes de [${symptoms}].`;
    precautions = "1. Allongez le patient et maintenez-le au calme.\n2. Contactez les urgences locales (15).";
  }

  return {
    patientName: name,
    koreanStatement: korean,
    englishStatement: english,
    translatedStatement: translated,
    precautions: precautions
  };
}

// 로컬 PWA 챗봇 가짜 응답기
function generateMockChatAnswer(message: string): string {
  if (message.includes('여권') || message.includes('분실')) {
    return "### 📶 [오프라인 모드 안내]\n\n네트워크 연결이 끊어져 로컬 긴급 데이터베이스에서 정보를 가져왔습니다.\n\n**여권 분실 시 행동 수칙:**\n1. 가까운 경찰서에서 **분실 신고서** 작성\n2. 사진 2매 및 영수증을 가지고 주재국 **대한민국 영사관/대사관** 방문하여 단수 여권 신청\n3. 영사콜센터 24시간 당직 연락망 활용";
  }
  if (message.includes('지진') || message.includes('재해')) {
    return "### 📶 [오프라인 모드 안내]\n\n로컬 비상 매뉴얼 수칙:\n1. 탁자나 테이블 밑으로 숨어 머리 보호\n2. 흔들림이 멈추면 전원을 차단하고 넓은 공터로 이동\n3. 엘리베이터 이용 절대 불가, 계단 도보 피난";
  }
  return "### 📶 [오프라인 모드 안내]\n\n현재 통신이 차단되어 실시간 RAG 챗봇 연동이 제한됩니다. 여권 분실, 지진, 사고 등 긴급 비상 단어가 포함된 질문을 하시면 로컬 백업 행동 지침 매뉴얼을 보여드립니다.";
}
