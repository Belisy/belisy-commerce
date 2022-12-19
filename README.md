<div align='center'>

# **💞Belisy Commerce💞**
TypeScript와 Next.js를 사용하여 구현한 커머스 서비스입니다.
<br/>
  
## **🌼사용 기술🌼**

<span style="color:yellowgreen">**Language**</span>  
📍 TypeScript

<span style="color:yellowgreen">**Framework**</span>  
📍 Next.js

<span style="color:yellowgreen">**서버상태관리**</span>  
📍 React Query

<span style="color:yellowgreen">**Style**</span>  
📍 Tailwind CSS

<span style="color:yellowgreen">**DB**</span>  
📍 Prisma  
📍 PlanetScale

<span style="color:yellowgreen">**Deploy**</span>  
📍 Vercel

<br/>
<br/>

## **🌼프로젝트 상세🌼**


<!-- 🌼My Notion
<a href=""><img src="https://img.shields.io/badge/notion-1DBF73?style=flat&logo=Notion&logoColor=white"/></a> -->

<span style="color:pink">**메인 페이지**</span>

🌾전체 상품 목록 확인 (더보기 버튼)  
🌾카테고리별 상품 조회  
🌾최신순(default)/가격 높은순/가격 낮은순 정렬

<br/>

<span style="color:pink">**로그인 / 로그아웃 페이지**</span>

🌾구글 OAuth 2.0을 이용한 구글 연동 로그인  
🌾회원 권한: 찜하기, 장바구니, 구매하기 기능  
🌾비회원이 회원 권한 기능 시도시 로그인 페이지로 이동

<br/>

<span style="color:pink">**상품 상세 페이지**</span>

🌾찜하기  
🌾장바구니 담기  
🌾해당 상품만 바로 구매하기  
🌾찜하기/장바구니/구매하기 클릭시, Session이 없을 경우 로그인 페이지로 이동

<br/>

<span style="color:pink">**위시리스트 페이지**</span>

🌾찜한 상품 목록 확인  
🌾찜한 상품 위시리스트에서 제거

<br/>

<span style="color:pink">**장바구니 페이지**</span>

🌾상품 수량 변경 기능  
🌾상품 삭제 기능  
🌾장바구니 담긴 상품 전체 구매하기

<br/>

<span style="color:pink">**주문내역 페이지**</span>

🌾상품 결제하기 버튼 (실제 결제 기능은 추후 구현 예정)  
🌾주문내역 목록  
🌾주문 상태(주문대기 / 결제완료 / 주문취소 등)  
🌾주문내역 삭제

<br/>
<br/>

## **🌼Structure🌼**

</div>

```
Belisy-Commerce
├── Components
│ ├── CartPageItem.tsx
│ ├── GoogleLogin.tsx
│ ├── OrderPageItem.tsx
│ ├── Type.tsx
│ ├── UserInfo.tsx
│ └── WishListItem
├── hooks
│ └── useDebounce.ts
├── pages
│ ├── _app.tsx
│ ├── cart.tsx
│ ├── index.tsx
│ ├── order.tsx
│ ├── wishlists.tsx
│ ├── api (Backend)
│ │ ├── auth
│ │ │ ├── [...nextauth].ts
│ │ │ └── sign-up.ts
│ │ ├── add-cart.ts
│ │ ├── add-order.ts
│ │ ├── delete-cart.ts
│ │ ├── delete-order.ts
│ │ ├── delete-wishlilst.ts
│ │ ├── get-cart.ts
│ │ ├── get-categories.ts
│ │ ├── get-order.ts
│ │ ├── get-product.ts
│ │ ├── get-products-count.ts
│ │ ├── get-products.ts
│ │ ├── get-wishlist.ts
│ │ ├── get-wishlists.ts
│ │ ├── updata-cart.ts
│ │ ├── update-product.ts
│ │ └── update-wishlist.ts
│ ├── auth
│ │ └── login.tsx
│ ├── products
│ │ ├── [id]
│ │ │ ├── edit.tsx
│ └─└─└── index.tsx
├── prisma
│ ├── data-table.ts
│ └── schema.prisma
├── public(내부 구조 생략)
├── styles
│ ├── globals.css
│ └── Home.module.css
├── types
└─└── next-auth.d.ts
```
