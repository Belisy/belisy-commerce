<div align='center'>

# **๐Belisy Commerce๐**
TypeScript์ Next.js๋ฅผ ์ฌ์ฉํ์ฌ ๊ตฌํํ ์ปค๋จธ์ค ์๋น์ค์๋๋ค.
<br/>
  
## **๐ผ์ฌ์ฉ ๊ธฐ์ ๐ผ**

<span style="color:yellowgreen">**Language**</span>  
๐ TypeScript

<span style="color:yellowgreen">**Framework**</span>  
๐ Next.js

<span style="color:yellowgreen">**์๋ฒ์ํ๊ด๋ฆฌ**</span>  
๐ React Query

<span style="color:yellowgreen">**Style**</span>  
๐ Tailwind CSS

<span style="color:yellowgreen">**DB**</span>  
๐ Prisma  
๐ PlanetScale

<span style="color:yellowgreen">**Deploy**</span>  
๐ Vercel

<br/>
<br/>

## **๐ผํ๋ก์ ํธ ์์ธ๐ผ**


<!-- ๐ผMy Notion
<a href=""><img src="https://img.shields.io/badge/notion-1DBF73?style=flat&logo=Notion&logoColor=white"/></a> -->

<span style="color:pink">**๋ฉ์ธ ํ์ด์ง**</span>

๐พ์ ์ฒด ์ํ ๋ชฉ๋ก ํ์ธ (๋๋ณด๊ธฐ ๋ฒํผ)  
๐พ์นดํ๊ณ ๋ฆฌ๋ณ ์ํ ์กฐํ  
๐พ์ต์ ์(default)/๊ฐ๊ฒฉ ๋์์/๊ฐ๊ฒฉ ๋ฎ์์ ์ ๋ ฌ

<br/>

<span style="color:pink">**๋ก๊ทธ์ธ / ๋ก๊ทธ์์ ํ์ด์ง**</span>

๐พ๊ตฌ๊ธ OAuth 2.0์ ์ด์ฉํ ๊ตฌ๊ธ ์ฐ๋ ๋ก๊ทธ์ธ  
๐พํ์ ๊ถํ: ์ฐํ๊ธฐ, ์ฅ๋ฐ๊ตฌ๋, ๊ตฌ๋งคํ๊ธฐ ๊ธฐ๋ฅ  
๐พ๋นํ์์ด ํ์ ๊ถํ ๊ธฐ๋ฅ ์๋์ ๋ก๊ทธ์ธ ํ์ด์ง๋ก ์ด๋

<br/>

<span style="color:pink">**์ํ ์์ธ ํ์ด์ง**</span>

๐พ์ฐํ๊ธฐ  
๐พ์ฅ๋ฐ๊ตฌ๋ ๋ด๊ธฐ  
๐พํด๋น ์ํ๋ง ๋ฐ๋ก ๊ตฌ๋งคํ๊ธฐ  
๐พ์ฐํ๊ธฐ/์ฅ๋ฐ๊ตฌ๋/๊ตฌ๋งคํ๊ธฐ ํด๋ฆญ์, Session์ด ์์ ๊ฒฝ์ฐ ๋ก๊ทธ์ธ ํ์ด์ง๋ก ์ด๋

<br/>

<span style="color:pink">**์์๋ฆฌ์คํธ ํ์ด์ง**</span>

๐พ์ฐํ ์ํ ๋ชฉ๋ก ํ์ธ  
๐พ์ฐํ ์ํ ์์๋ฆฌ์คํธ์์ ์ ๊ฑฐ

<br/>

<span style="color:pink">**์ฅ๋ฐ๊ตฌ๋ ํ์ด์ง**</span>

๐พ์ํ ์๋ ๋ณ๊ฒฝ ๊ธฐ๋ฅ  
๐พ์ํ ์ญ์  ๊ธฐ๋ฅ  
๐พ์ฅ๋ฐ๊ตฌ๋ ๋ด๊ธด ์ํ ์ ์ฒด ๊ตฌ๋งคํ๊ธฐ

<br/>

<span style="color:pink">**์ฃผ๋ฌธ๋ด์ญ ํ์ด์ง**</span>

๐พ์ํ ๊ฒฐ์ ํ๊ธฐ ๋ฒํผ (์ค์  ๊ฒฐ์  ๊ธฐ๋ฅ์ ์ถํ ๊ตฌํ ์์ )  
๐พ์ฃผ๋ฌธ๋ด์ญ ๋ชฉ๋ก  
๐พ์ฃผ๋ฌธ ์ํ(์ฃผ๋ฌธ๋๊ธฐ / ๊ฒฐ์ ์๋ฃ / ์ฃผ๋ฌธ์ทจ์ ๋ฑ)  
๐พ์ฃผ๋ฌธ๋ด์ญ ์ญ์ 

<br/>
<br/>

## **๐ผStructure๐ผ**

</div>

```
Belisy-Commerce
โโโ Components
โ โโโ CartPageItem.tsx
โ โโโ GoogleLogin.tsx
โ โโโ OrderPageItem.tsx
โ โโโ Type.tsx
โ โโโ UserInfo.tsx
โ โโโ WishListItem
โโโ hooks
โ โโโ useDebounce.ts
โโโ pages
โ โโโ _app.tsx
โ โโโ cart.tsx
โ โโโ index.tsx
โ โโโ order.tsx
โ โโโ wishlists.tsx
โ โโโ api (Backend)
โ โ โโโ auth
โ โ โ โโโ [...nextauth].ts
โ โ โ โโโ sign-up.ts
โ โ โโโ add-cart.ts
โ โ โโโ add-order.ts
โ โ โโโ delete-cart.ts
โ โ โโโ delete-order.ts
โ โ โโโ delete-wishlilst.ts
โ โ โโโ get-cart.ts
โ โ โโโ get-categories.ts
โ โ โโโ get-order.ts
โ โ โโโ get-product.ts
โ โ โโโ get-products-count.ts
โ โ โโโ get-products.ts
โ โ โโโ get-wishlist.ts
โ โ โโโ get-wishlists.ts
โ โ โโโ updata-cart.ts
โ โ โโโ update-product.ts
โ โ โโโ update-wishlist.ts
โ โโโ auth
โ โ โโโ login.tsx
โ โโโ products
โ โ โโโ [id]
โ โ โ โโโ edit.tsx
โ โโโโโโโ index.tsx
โโโ prisma
โ โโโ data-table.ts
โ โโโ schema.prisma
โโโ public(๋ด๋ถ ๊ตฌ์กฐ ์๋ต)
โโโ styles
โ โโโ globals.css
โ โโโ Home.module.css
โโโ types
โโโโโ next-auth.d.ts
```
