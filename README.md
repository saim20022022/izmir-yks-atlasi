# Devamsızlık Takip Sistemi

## Giriş

Admin:
- Mail: `cnkkrt@gmail.com`
- Şifre: `Ck5272591!`

Öğretmen:
- `Öğretmen Üye Ol` ekranından mail ve şifreyle kayıt olur.
- Öğretmenler veri yükleyemez, öğrenci ekleyemez/silemez.
- Öğretmenler görüntüleme ve Excel çıktı alabilir.

## Netlify

Bu klasörü GitHub reposuna yükleyin. Netlify'da GitHub reposunu seçip deploy edin.

## Not

Bu sürüm Firebase/Netlify Identity kullanmaz. Kullanıcılar tarayıcı localStorage içinde tutulur.
Gerçek merkezi kullanıcı yönetimi istenirse backend gerekir.


## data.json ile yayınlama
Admin devamsızlık Excelini yükledikten sonra **Site Verisini JSON İndir** butonuna basar. İnen `data.json` dosyası GitHub repo kök dizinine yüklenir ve eski `data.json` üzerine yazılır. Netlify otomatik deploy sonrası öğretmenler aynı veriyi görür. Excel dosyasını GitHub’a yüklemeye gerek yoktur.


## Hava durumu destekli analiz

İzmir hava durumu verileri devamsızlık analizlerine eklendi. Ana sayfada ve sınıf detayında hava tipi, sıcaklık, yağış ve devamsızlık yüzdesi birlikte değerlendirilir.

## Riskli Öğrenci İzlem Paneli

Bu sürümde üst menüye **Riskli Öğrenci İzlem** ekranı eklendi.

Panel özellikleri:
- Devamsızlık verisinden riskli öğrencileri otomatik listeler.
- Risk seviyesini toplam/özürsüz devamsızlığa göre renklendirir.
- Sınıf rehber öğretmeni için görüşme, neden, yapılan çalışma, veli bilgilendirme, sonuç ve takip tarihi formu içerir.
- Kayıtları tarayıcı localStorage içinde saklar.
- **Çalışma Kayıtları Excel** butonuyla riskli öğrenci izlem raporu indirilebilir.

Önemli not:
Bu uygulama Netlify üzerinde statik çalıştığı için öğretmenlerin farklı bilgisayarlardan girdiği kayıtlar otomatik olarak merkeze düşmez. Merkezi kayıt istenirse Google Sheets, Firebase, Supabase veya Netlify Functions gibi bir backend entegrasyonu gerekir.
