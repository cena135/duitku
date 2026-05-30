# Build DuitKu jadi Android App

Pilih salah satu dari 3 cara. Dari paling gampang ke paling powerful.

---

## 🟢 Cara 1: PWA Install (1 menit, RECOMMENDED untuk personal)

DuitKu sudah jadi PWA siap pakai. Begitu di-deploy ke internet, **tinggal install ke home screen** dan terasa seperti app native — full screen, ada icon, offline.

### Langkah:

1. **Deploy dulu** (kalau belum):
   - Buka https://app.netlify.com/drop
   - Drag folder `DuitKu/` ini ke browser
   - Tunggu 10 detik → dapat URL `https://duitku-xxx.netlify.app`

2. **Di HP Android**, buka URL itu di Chrome (atau Edge/Brave/Samsung Internet)

3. Tap menu titik 3 di kanan atas → **Add to Home Screen** (atau "Install app")

4. Confirm → icon DuitKu muncul di home screen, **buka langsung jadi app standalone tanpa browser bar**

### Yang kamu dapat:
- ✅ Icon di home screen
- ✅ Full screen, no browser UI
- ✅ Offline (service worker cache)
- ✅ Splash screen otomatis
- ✅ Notifikasi push (kalau diaktifkan)
- ✅ Update otomatis kalau kamu deploy ulang
- ✅ Long-press icon = shortcut (Tambah Transaksi / Langganan / Laporan)

### Yang **tidak** kamu dapat (vs APK asli):
- ❌ Tidak bisa upload Play Store
- ❌ Tidak bisa share APK ke orang lain via WhatsApp
- ❌ Kamera fallback ke browser API (masih bisa foto nota, tapi UX agak beda)

**Buat kebutuhan personal, ini sudah cukup. Lewati cara 2 & 3.**

---

## 🟡 Cara 2: PWABuilder → APK (5-10 menit, real APK)

Generate file `.apk` real dari URL deployed. Bisa di-install sideload atau di-upload ke Play Store. **Tidak butuh Android Studio**, semuanya web-based.

### Langkah:

1. **Deploy dulu** (sama seperti Cara 1, butuh HTTPS URL)

2. Buka https://www.pwabuilder.com

3. Masukin URL deployed kamu (misal `https://duitku-xxx.netlify.app`)

4. Klik **Start** → PWABuilder akan analisis manifest & service worker, kasih score

5. Klik tab **Package For Stores** → **Android**

6. Atur (boleh default semua):
   - **Package ID:** `app.netlify.duitku_xxx` (atau yang kamu mau, format: `com.namamu.duitku`)
   - **App name:** DuitKu
   - **Launcher name:** DuitKu
   - **Display mode:** standalone
   - **Status bar color:** `#000000` atau yang kamu suka
   - **Splash screen:** auto
   - **Signing key:** pilih "New" untuk generate sendiri (kamu harus simpan file `.keystore` + password — penting buat update di Play Store nanti)

7. Klik **Generate** → tunggu ~30 detik → download `.zip` berisi:
   - `app-release-signed.apk` ← ini yang bisa langsung install
   - `app-release-bundle.aab` ← upload ke Play Store
   - Signing keystore (SIMPAN, jangan hilang!)
   - Instructions

### Install APK ke HP:
1. Pindah file `.apk` ke HP (via USB/Drive/WhatsApp Web)
2. Tap file di HP → muncul warning "install dari sumber tidak dikenal" → Enable
3. Install → DuitKu muncul di app drawer seperti app native

### Upload ke Play Store:
1. Daftar [Google Play Console](https://play.google.com/console) ($25 lifetime)
2. Create new app → upload file `.aab`
3. Fill metadata (deskripsi, screenshot, privacy policy)
4. Submit review → biasanya 1-7 hari approved
5. App muncul di Play Store, orang bisa install langsung

---

## 🔴 Cara 3: Capacitor → Native APK (SUDAH DI-SETUP)

Wrap PWA jadi native Android dengan WebView + akses **kamera asli, notifikasi background, file system, biometric, dll**. Project ini sudah di-setup dengan Capacitor — tinggal build.

### Prerequisites (sudah harus terpasang):
- Node.js & npm
- **Android Studio** (https://developer.android.com/studio, sekitar 3GB)
- Android SDK (otomatis ke-install dengan Studio)
- JDK 17 (Android Studio bundle sendiri di `jbr/`)

> **Catatan JDK:** Capacitor 6 (yang dipakai di sini) jalan dengan JDK 17. Capacitor 7 butuh JDK 21+. Kalau upgrade Capacitor di masa depan, install OpenJDK 21 dulu.

### Setup awal (sudah dilakukan di project ini — skip kalau fresh clone):

```powershell
# Sudah dijalankan, tinggal commit hasilnya
npm install
npx cap add android
# local.properties → arah ke ANDROID SDK
```

### Workflow:

```powershell
# 1. Build APK (pertama kali butuh 5-15 menit untuk download Gradle/AGP)
npm run android:build
# APK keluar di: android/app/build/outputs/apk/debug/app-debug.apk

# 2. Setiap kali edit code di www/, sync ke Android:
npm run android:sync

# 3. Install langsung ke HP yang dicolok USB (USB debugging ON):
npm run android:install

# 4. Buka di Android Studio untuk debugging visual:
npm run android:open
```

### Di Android Studio:
1. Tunggu Gradle sync selesai (~5 menit pertama kali)
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. APK keluar di `android/app/build/outputs/apk/debug/app-debug.apk`
4. Drag APK ke HP atau pakai `adb install`

### Plugin native (opsional):
```powershell
# Kamera asli (real native, bukan browser API)
npm install @capacitor/camera

# Notifikasi background
npm install @capacitor/local-notifications

# File system asli (bisa export ke folder yang user pilih)
npm install @capacitor/filesystem

# Share native sheet
npm install @capacitor/share

# Haptic feedback yang lebih bagus
npm install @capacitor/haptics

# Setelah install, sync:
npx cap sync android
```

Kalau install plugin di atas, kamu bisa upgrade `app.js` untuk pakai native APIs alih-alih browser APIs. Tapi versi browser API sekarang juga jalan kok.

### Yang kamu dapat (di atas PWA):
- ✅ APK real, bisa upload Play Store
- ✅ Kamera native (no permission prompt browser yang aneh)
- ✅ Notifikasi background (jalan walau app tertutup)
- ✅ File system native (folder Documents, Downloads, dll)
- ✅ Lebih cepat (no browser overhead)
- ✅ Bisa publish ke Play Store

---

## Mana yang harus dipilih?

| Skenario | Pilih |
|---|---|
| Cuma buat dipake sendiri di HP-mu | **Cara 1 (PWA)** |
| Mau share APK ke 1-2 teman keluarga | **Cara 2 (PWABuilder)** |
| Mau publish ke Play Store | **Cara 2 atau 3** |
| Mau fitur native real (kamera, notif background) | **Cara 3 (Capacitor)** |
| Mau jualan / sell app | **Cara 3 + publish Play Store** |

**Untuk DuitKu, saya rekomen Cara 1.** 90% experience native sudah dapat, no setup overhead, gak perlu rebuild tiap kali update code, langsung tersinkron dengan deployed version.

---

## FAQ

**Apa data hilang kalau update PWA?**
Tidak. `localStorage` persist across updates. Tapi tetap backup rutin (Pengaturan → Export).

**Apa app jalan offline setelah install?**
Ya — service worker cache semua file. Tapi pertama kali install harus online. Setelahnya bisa airplane mode.

**Apa bisa di iPhone?**
PWA di iOS Safari juga work, sama prosesnya: Share → Add to Home Screen. Tapi Capacitor butuh Mac + Xcode untuk build iOS.

**Apa Play Store accept PWA?**
Iya, via TWA (Trusted Web Activity) yang dibuat oleh PWABuilder atau Bubblewrap CLI. Cara 2 di atas adalah TWA.

**Apa butuh bayar Play Console?**
$25 lifetime fee untuk publish. Kalau cuma sideload APK ke HP sendiri/teman, no fee.

**Saya butuh privacy policy untuk Play Store?**
Ya wajib. Untuk DuitKu cukup tulis: "DuitKu tidak mengumpulkan data apapun. Semua data tersimpan lokal di perangkat user via localStorage browser. Tidak ada server, tidak ada analytics." Host di GitHub Gist atau Notion, masukin URL-nya saat submission.
