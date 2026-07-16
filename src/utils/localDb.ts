// IndexedDB 오프라인 동기화 헬퍼 유틸

const DB_NAME = 'safe0404_offline_db';
const DB_VERSION = 1;

export interface OfflineCountry {
  code: string;
  name: string;
  warningLevel: number;
  warningText: string;
  police: string;
  ambulance: string;
  embassy: string;
  recentNotice: string;
}

export interface OfflineNotice {
  id?: number;
  countryCode: string;
  title: string;
  content: string;
  writtenDate: string;
}

export interface OfflineMedicalCard {
  patientName: string;
  koreanStatement: string;
  englishStatement: string;
  translatedStatement: string;
  precautions: string;
}

// DB 열기
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('countries')) {
        db.createObjectStore('countries', { keyPath: 'code' });
      }
      if (!db.objectStoreNames.contains('notices')) {
        db.createObjectStore('notices');
      }
      if (!db.objectStoreNames.contains('medical_cards')) {
        db.createObjectStore('medical_cards', { keyPath: 'patientName' });
      }
    };
  });
}

// 1. 국가 정보 저장 및 조회
export async function saveCountriesToLocal(countries: OfflineCountry[]): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('countries', 'readwrite');
    const store = tx.objectStore('countries');
    
    countries.forEach(c => store.put(c));
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getCountriesFromLocal(): Promise<OfflineCountry[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('countries', 'readonly');
    const store = tx.objectStore('countries');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// 2. 국가별 안전공지사항 저장 및 조회
export async function saveNoticesToLocal(countryCode: string, notices: OfflineNotice[]): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('notices', 'readwrite');
    const store = tx.objectStore('notices');
    
    store.put(notices, countryCode.toUpperCase());
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getNoticesFromLocal(countryCode: string): Promise<OfflineNotice[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('notices', 'readonly');
    const store = tx.objectStore('notices');
    const request = store.get(countryCode.toUpperCase());
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// 3. 마지막 긴급 의료 카드 저장 및 조회
export async function saveMedicalCardToLocal(card: OfflineMedicalCard): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('medical_cards', 'readwrite');
    const store = tx.objectStore('medical_cards');
    
    store.put(card);
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getMedicalCardsFromLocal(): Promise<OfflineMedicalCard[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('medical_cards', 'readonly');
    const store = tx.objectStore('medical_cards');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}
