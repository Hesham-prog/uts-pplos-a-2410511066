# Sistem Kepegawaian & Absensi (Microservices)

**Nama**: Hesham Alsami
**NIM**: 2410511066  
**Kelas**: A  
**Topik**: Sistem Kepegawaian & Absensi 
**OAuth**: Google OAuth 2.0  

## 🎥 Demo Video
**Link YouTube**: https://youtu.be/SmUqCkLDDlg

## Arsitektur
Sistem ini dibangun menggunakan arsitektur Microservices dengan komponen berikut:
1. **API Gateway** (Node.js/Express): Entry point, JWT Validation, Rate Limiting.
2. **Auth Service** (Node.js/Express): Otentikasi JWT & Google OAuth 2.0.
3. **Employee Service** (PHP Laravel 11): Manajemen Pegawai, Departemen, Posisi (Relasional DB).
4. **Attendance Service** (Node.js/Express): Absensi & Pengajuan Cuti (Mengonsumsi API dari Employee Service).

Setiap service menggunakan database terpisah sesuai kaidah microservices.

## Cara Menjalankan

### Persiapan
1. Salin `.env.example` ke `.env` pada setiap service dan sesuaikan kredensial database.
2. Jalankan `composer install` pada `employee-service`.
3. Jalankan `npm install` pada `gateway`, `auth-service`, dan `attendance-service`.

### Menjalankan (Development)
- **Gateway**: `cd gateway && npm start` (Port 3000)
- **Auth Service**: `cd services/auth-service && npm start` (Port 3001)
- **Employee Service**: `cd services/employee-service && php artisan serve --port=8000`
- **Attendance Service**: `cd services/attendance-service && npm start` (Port 3002)

*(Atau gunakan Docker Compose jika dikonfigurasi).*

## Peta Endpoint
Semua request masuk melalui **API Gateway (localhost:3000)**.
- `POST /api/auth/*` -> diarahkan ke **Auth Service**
- `GET/POST /api/employees/*` -> diarahkan ke **Employee Service**
- `GET/POST /api/attendance/*` -> diarahkan ke **Attendance Service**
- `GET/POST /api/leaves/*` -> diarahkan ke **Attendance Service**
