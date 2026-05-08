# Google Sheets Merkezi Kayıt Kurulumu

Bu sürümde Riskli Öğrenci İzlem Paneli kayıtları hem tarayıcıya hem de Google Sheets'e gönderilebilir.

## 1) Google Sheet oluştur

1. Google Drive > Yeni > Google E-Tablolar.
2. Dosya adını örneğin `Bozyaka Riskli Öğrenci Çalışmaları` yap.
3. Sayfa açıkken `Uzantılar > Apps Script` menüsüne gir.

## 2) Apps Script kodunu yapıştır

1. Açılan Apps Script ekranında `Code.gs` dosyasını aç.
2. İçeriği tamamen sil.
3. Zip içindeki `google-apps-script-Code.gs` dosyasındaki kodu komple yapıştır.
4. Kaydet.

## 3) Web uygulaması olarak yayınla

1. Sağ üstten `Dağıt > Yeni dağıtım` seç.
2. Tür olarak `Web uygulaması` seç.
3. Ayarlar:
   - Açıklama: `Riskli öğrenci kayıt API`
   - Şu kişi olarak çalıştır: `Ben`
   - Kimlerin erişimi var: `Herkes`
4. `Dağıt` butonuna bas.
5. Yetki isterse izin ver.
6. Verilen Web App URL'sini kopyala. URL genelde `/exec` ile biter.

## 4) Web panelde bağlantıyı tanıt

1. Netlify sitesini aç.
2. `Riskli Öğrenci İzlem` paneline gir.
3. `Google Sheets Merkezi Kayıt` alanındaki URL kutusuna Apps Script Web App URL'sini yapıştır.
4. Gizli anahtar kullanmadıysan ikinci kutuyu boş bırak.
5. `Kaydet` butonuna bas.
6. `Test` butonuna bas.
7. Başarılı mesajı görürsen sistem hazırdır.

## 5) Kayıt denemesi

1. Riskli bir öğrenci seç.
2. Çalışma formunu doldur.
3. `Kaydet` butonuna bas.
4. Google Sheet'e dönüp satırın eklendiğini kontrol et.

## Notlar

- Öğretmenler Google Sheets'i kullanmaz; sadece web panelden kayıt girer.
- Google Sheets arka planda merkezi veri deposu olarak çalışır.
- Web panelde `Sheets'ten Oku` butonu ile ortak tablodaki kayıtlar tekrar panele alınabilir.
- Gizli anahtar kullanmak istersen `google-apps-script-Code.gs` içindeki `SECRET_KEY` değerini doldur, web panelde de aynı anahtarı gir.
