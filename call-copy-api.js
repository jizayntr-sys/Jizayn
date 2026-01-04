// TR locale'deki resimleri EN locale'e kopyala
fetch('http://localhost:3001/api/admin/copy-images', {
  method: 'POST'
})
.then(res => res.json())
.then(data => console.log('Sonuç:', data))
.catch(err => console.error('Hata:', err));
