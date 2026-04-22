# 이미지 배치 안내

`public/images` 폴더에 아래 파일명으로 제품·캠페인 사진을 넣으면 홈페이지에 표시됩니다.  
파일이 없으면 연한 핑크 그라데이션만 보입니다.

| 파일명 | 용도 |
|--------|------|
| `hero.jpg` | 메인 히어로 (제품 라인업 추천) |
| `ritual.jpg` | Pink Ritual 섹션 하단 무드 이미지 (선택) |
| `editorial.jpg` | 에디토리얼 The Pink Room 좌측 대형 비주얼 |
| `gift.jpg` | 한정 굿즈·키링 등 프로모션 이미지 |
| `brand-story.jpg` | 브랜드 스토리 히어로 배너 |
| `brand-soriso-factory.jpg` | 브랜드 스토리 · 소리소 제조 시설(선택, 없으면 그라데이션만 표시) |
| `brand-patents-collage.jpg` | 브랜드 스토리 · 특허·인증 콜라주(선택) |
| `skincare-split.png` | SKIN CARE 전체 라인업(좌측 비주얼) |
| `cat-essence.jpg` | ESSENCE 카테고리 배너 |
| `cat-ampoule.jpg` | AMPOULE 카테고리 배너 |
| `cat-cream.jpg` | CREAM 카테고리 배너 |
| `cat-special.jpg` | SPECIAL CARE 배너 |
| `visual-1.jpg` ~ `visual-4.jpg` | 캠페인 그리드 |
| `social-1.jpg` ~ `social-6.jpg` | SNS 그리드 |
| `product-01.png` ~ `product-06.png` | 베스트셀러 6종(PNG, 교체 시 같은 파일명 유지) |
| `character-somi.png` | 베스트셀러 마스코트(배경 제거 PNG 권장, 투명). 없으면 자동으로 `character-somi.svg` 기본 캐릭터 사용 |
| `character-somi.svg` | 기본 마스코트(저장소 포함). PNG를 쓰면 PNG를 우선 로드합니다 |

권장: JPG 또는 WebP, 가로 1600px 이상(히어로·배너), 제품 카드는 정사각형에 맞게 크롭.  
캐릭터는 `public/images/character-somi.png`로 넣으면 베스트셀러 그리드 위에서 제품 주변을 이동합니다. PNG가 없어도 동일 경로의 SVG 기본 마스코트가 표시됩니다.
