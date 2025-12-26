# gallery.jihun.io

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=TailwindCSS&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=Nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=GitHubActions&logoColor=white)


<img width="640" alt="스크린샷 2025-12-26 오후 4 15 17" src="https://github.com/user-attachments/assets/ee137185-5218-4bfd-9d01-11e32b7f4013" />

https://gallery.jihun.io

사진 찍는 개발자 jihun의 사진 갤러리입니다.

## 주요 기능

- **자동 EXIF 추출**: 카메라 정보, 촬영 설정, GPS 좌표 자동 파싱
- **Apple MapKit 통합**: 촬영 위치를 지도에 표시
- **스마트 관리**: 카테고리/태그 기반 사진 분류 및 썸네일 자동 생성
- **모달 기반 뷰**: Next.js Parallel Routes로 부드러운 사진 탐색
- **역할 기반 인증**: NextAuth.js 기반 보안 시스템

## 시스템 아키텍처

```mermaid
graph TB
    subgraph "클라이언트"
        Browser[웹 브라우저]
    end

    subgraph "애플리케이션 레이어"
        NextJS[Next.js 16<br/>App Router]
        PM2[PM2<br/>프로세스 관리자]
    end

    subgraph "데이터 레이어"
        PostgreSQL[(PostgreSQL 18<br/>메타데이터)]
        R2[Cloudflare R2<br/>이미지 스토리지]
    end

    subgraph "외부 서비스"
        MapKit[Apple MapKit JS<br/>지도 서비스]
    end

    Browser -->|HTTPS| NextJS
    NextJS -->|Prisma ORM| PostgreSQL
    NextJS -->|S3 API| R2
    NextJS -->|토큰 인증| MapKit
    PM2 -->|관리| NextJS

    style NextJS fill:#0070f3,stroke:#fff,stroke-width:2px,color:#fff
    style PostgreSQL fill:#336791,stroke:#fff,stroke-width:2px,color:#fff
    style R2 fill:#f6821f,stroke:#fff,stroke-width:2px,color:#fff
    style MapKit fill:#000,stroke:#fff,stroke-width:2px,color:#fff
```

## 배포 파이프라인

```mermaid
graph LR
    A[Git 푸시] -->|트리거| B[GitHub Actions]
    B -->|빌드| C[멀티 스테이지<br/>Docker 빌드]
    C -->|푸시| D[GHCR]
    D -->|SSH| E[프로덕션]
    E -->|풀| F[Docker Compose]
    F -->|재시작| G[PM2<br/>재시작]

    style A fill:#28a745,stroke:#fff,stroke-width:2px,color:#fff
    style D fill:#2088ff,stroke:#fff,stroke-width:2px,color:#fff
    style G fill:#28a745,stroke:#fff,stroke-width:2px,color:#fff
```

**배포 특징**: 멀티 플랫폼 Docker 빌드 (amd64/arm64) · PM2 프로세스 관리 · 자동 헬스 체크

## 데이터 모델

```mermaid
erDiagram
    User ||--o{ Image : 관리
    Category ||--o{ Image : 포함
    Image ||--o{ ImageTag : 가짐
    Tag ||--o{ ImageTag : "태그됨"

    User {
        string id PK
        string email UK
        enum role
    }

    Category {
        string id PK
        string slug UK
        int order
    }

    Image {
        string id PK
        string imageUrl
        string categoryId FK
        json metadata
        datetime captureDate
    }

    Tag {
        string id PK
        string slug UK
    }
```

## 기술 스택

- **Frontend**: Next.js 16 · TypeScript · Tailwind CSS 4
- **Backend**: Node.js 20 · PostgreSQL 18 · Prisma · NextAuth.js
- **Infra**: Docker · PM2 · Cloudflare R2 · GitHub Actions

## 기술적 특징

- **Next.js App Router**: Parallel Routes & Intercepting Routes를 활용한 모달 라우팅
- **EXIF 처리**: exifr 라이브러리로 메타데이터를 JSON으로 저장 및 쿼리
- **이미지 최적화**: Sharp 기반 썸네일 생성 + R2 CDN 배포
- **프로덕션 배포**: Docker 멀티 스테이지 빌드 + PM2 프로세스 관리
