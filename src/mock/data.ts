export interface Instructor {
  id: number;
  name: string;
  dept: string;
  phone: string;
  intro: string;
  color: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface LectureLog {
  id: number;
  instructorId: number;
  instructorName: string;
  courseName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  totalHours: number;
  studentCount: number;
  content: string;
  createdAt: string; // YYYY-MM-DD HH:mm
}

export const accentColors = ['#5B5BF6', '#12B886', '#F5A623', '#F5484A', '#22B8CF', '#845EF7', '#FA5D8F'];

export const instructors: Instructor[] = [
  { id: 1, name: '김도윤', dept: '개발교육팀 / 수석강사', phone: '010-1234-5678', intro: '10년차 백엔드 개발자 출신 강사입니다. 실무 중심의 커리큘럼을 지향합니다.', color: accentColors[0] },
  { id: 2, name: '이서연', dept: 'UX교육팀 / 팀장', phone: '010-2345-6789', intro: '현업 UX 디자이너 경력을 바탕으로 실습 위주 강의를 진행합니다.', color: accentColors[1] },
  { id: 3, name: '박지훈', dept: '데이터교육팀 / 강사', phone: '010-3456-7890', intro: '데이터 분석 및 머신러닝 입문 과정을 담당하고 있습니다.', color: accentColors[2] },
  { id: 4, name: '최민서', dept: '개발교육팀 / 강사', phone: '010-4567-8901', intro: '프론트엔드 전문 강사. React, TypeScript 실무 과정 운영.', color: accentColors[3] },
  { id: 5, name: '정하은', dept: '기획교육팀 / 강사', phone: '010-5678-9012', intro: 'IT 서비스 기획 및 PM 역량 강화 과정을 진행합니다.', color: accentColors[4] },
  { id: 6, name: '한지민', dept: '클라우드교육팀 / 강사', phone: '010-6789-0123', intro: 'AWS/Azure 클라우드 인프라 실습 과정 담당 강사입니다.', color: accentColors[5] },
];

export const courses: Course[] = [
  { id: 1, name: 'React 실무 프로젝트 과정', description: '컴포넌트 설계부터 배포까지, React 기반 실무 웹 애플리케이션 개발 과정', color: accentColors[0] },
  { id: 2, name: 'UX/UI 디자인 기초', description: '사용자 리서치부터 프로토타이핑까지 UX 디자인 전 과정을 다루는 입문 과정', color: accentColors[1] },
  { id: 3, name: '데이터 분석 입문 (Python)', description: 'Python 기반 데이터 전처리, 시각화, 통계 분석 기초 과정', color: accentColors[2] },
  { id: 4, name: 'TypeScript 심화', description: '타입 시스템을 활용한 안전한 애플리케이션 설계와 실무 패턴', color: accentColors[3] },
  { id: 5, name: '서비스 기획 실무', description: 'IT 서비스 기획서 작성부터 요구사항 정의까지 실무 기획 프로세스', color: accentColors[4] },
  { id: 6, name: 'AWS 클라우드 인프라', description: 'AWS 핵심 서비스 이해와 클라우드 인프라 구축 실습', color: accentColors[5] },
];

export const lectureLogs: LectureLog[] = [
  { id: 1, instructorId: 1, instructorName: '김도윤', courseName: 'React 실무 프로젝트 과정', date: '2026-08-31', startTime: '09:00', endTime: '12:00', totalHours: 3, studentCount: 18, content: '컴포넌트 상태 관리(useState, useReducer) 실습 및 미니 프로젝트 진행. 3조 발표 우수.', createdAt: '2026-08-31 12:15' },
  { id: 2, instructorId: 1, instructorName: '김도윤', courseName: 'React 실무 프로젝트 과정', date: '2026-08-28', startTime: '09:00', endTime: '12:00', totalHours: 3, studentCount: 19, content: 'React Router를 이용한 페이지 라우팅 구현. 과제 안내.', createdAt: '2026-08-28 12:10' },
  { id: 3, instructorId: 2, instructorName: '이서연', courseName: 'UX/UI 디자인 기초', date: '2026-08-30', startTime: '13:00', endTime: '17:00', totalHours: 4, studentCount: 22, content: '사용자 페르소나 정의 및 저니맵 작성 워크숍 진행.', createdAt: '2026-08-30 17:20' },
  { id: 4, instructorId: 3, instructorName: '박지훈', courseName: '데이터 분석 입문 (Python)', date: '2026-08-29', startTime: '10:00', endTime: '13:00', totalHours: 3, studentCount: 15, content: 'Pandas를 활용한 데이터 전처리 실습. 결측치 처리 및 이상치 탐지.', createdAt: '2026-08-29 13:05' },
  { id: 5, instructorId: 4, instructorName: '최민서', courseName: 'TypeScript 심화', date: '2026-08-27', startTime: '14:00', endTime: '16:00', totalHours: 2, studentCount: 12, content: '제네릭과 유틸리티 타입 실습. 실무 코드 리팩토링 사례 소개.', createdAt: '2026-08-27 16:10' },
  { id: 6, instructorId: 5, instructorName: '정하은', courseName: '서비스 기획 실무', date: '2026-08-26', startTime: '09:30', endTime: '12:30', totalHours: 3, studentCount: 20, content: '요구사항 정의서 작성 실습 및 우선순위 도출 방법론 소개.', createdAt: '2026-08-26 12:40' },
  { id: 7, instructorId: 6, instructorName: '한지민', courseName: 'AWS 클라우드 인프라', date: '2026-08-25', startTime: '09:00', endTime: '13:00', totalHours: 4, studentCount: 16, content: 'EC2, VPC 구성 실습 및 보안그룹 설정.', createdAt: '2026-08-25 13:30' },
  { id: 8, instructorId: 1, instructorName: '김도윤', courseName: 'React 실무 프로젝트 과정', date: '2026-08-21', startTime: '09:00', endTime: '12:00', totalHours: 3, studentCount: 19, content: 'API 연동 및 비동기 처리(useEffect, fetch) 실습.', createdAt: '2026-08-21 12:05' },
  { id: 9, instructorId: 2, instructorName: '이서연', courseName: 'UX/UI 디자인 기초', date: '2026-08-23', startTime: '13:00', endTime: '17:00', totalHours: 4, studentCount: 21, content: '와이어프레임 및 Figma 프로토타이핑 실습.', createdAt: '2026-08-23 17:10' },
  { id: 10, instructorId: 3, instructorName: '박지훈', courseName: '데이터 분석 입문 (Python)', date: '2026-08-22', startTime: '10:00', endTime: '13:00', totalHours: 3, studentCount: 14, content: 'Matplotlib/Seaborn을 이용한 데이터 시각화 실습.', createdAt: '2026-08-22 13:15' },
  { id: 11, instructorId: 1, instructorName: '김도윤', courseName: 'TypeScript 심화', date: '2026-08-31', startTime: '14:00', endTime: '16:00', totalHours: 2, studentCount: 10, content: '오전 React 과정에 이어 오후에는 TypeScript 보강 세션 진행. 제네릭 개념 복습.', createdAt: '2026-08-31 16:10' },
];

export const currentInstructor = instructors[0];
