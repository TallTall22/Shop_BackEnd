# 簡易購物網站後端

這是一個使用 Node.js + MySQL 開發的購物網站後端

<br>
<br>
<br>

# Readme 大綱
- [簡介](#簡介)
- [專案初始化](#專案初始化)
  - [前置作業](#前置作業)
  - [安裝](#安裝)
  - [啟動專案](#啟動專案)
- [預設使用者](#預設使用者)
- [開發工具](#開發工具)

<br>
<br>

# 簡介
- 可在網站上瀏覽全部商品資料
- 將商品加入購物車並購買，查看交易紀錄
- 收藏商品、查看銷售排行
- 店家能在後台管理商品、訂單狀態 

<br>
<br>

# 專案初始化
## **前置作業**
已安裝 node 和 npm

<br>

## **安裝**
1. Clone 專案
```
 git clone https://github.com/TallTall22/Shop_BackEnd

 cd Shop_BackEnd
```

<br/>

2. 安裝套件
```
npm install
```

<br/>

3. 新增.env檔並且參考 .env example設置環境變數 

<br/>

4. 新增 database
```
create database shop
```

<br/>

5. 輸入 migration 和種子資料  
**(請先輸入migration)**
```
npx sequelize db:migrate
npx sequelize db:seed:all
```

<br/>



## **啟動專案**

1. 啟動專案
```
npm run dev
```

如果成功會看到 App is listening on localhost:3001

<br>

2. 停止專案
```
control + c
```
<br/>
<br/>

# 預設使用者

## **商家**
1 available account

* **帳號**: seller001
  **密碼**: titaner

<br/>

## **顧客**

* **帳號**: buyer678 
  **密碼**: titaner

* **帳號**: buyer789
  **密碼**: titaner



<br/>
<br/>

# 開發工具
- "bcryptjs": "^2.4.3",
- "dotenv": "^16.3.1",
- "express": "^4.18.2",
- "express-session": "^1.17.3",
- "faker": "^5.5.3",
- "imgur": "^1.0.2",
- "jsonwebtoken": "^9.0.0",
- "multer": "^1.4.5-lts.1",
- "mysql2": "^3.5.1",
- "nodemon": "^3.0.1",
- "passport": "^0.6.0",
- "passport-jwt": "^4.0.1",
- "passport-local": "^1.0.0",
- "sequelize": "^6.32.1",
- "sequelize-cli": "^6.6.1",
- "tslib": "^2.6.0"
<br>
<br>


