# Git / GitHub Workflow — Jizayn

> **Cursor ajanı için zorunlu:** Bu makinede `git push` yapmadan önce aşağıdaki
> `GIT_SSH_COMMAND` adımını **her zaman** uygula. Aksi halde `Permission denied (publickey)` hatası alınır.

## Repo bilgileri
- **GitHub:** `jizayntr-sys/Jizayn`
- **Branch:** `main`
- **Remote:** `git@github-jizayn:jizayntr-sys/Jizayn.git`

## SSH yapılandırması (`~/.ssh/config`)
```
Host github-jizayn
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_jizayn
  IdentitiesOnly yes
```

## Sorunun kök nedeni
- **Windows OpenSSH** (`C:/Windows/System32/OpenSSH/ssh.exe`) → Jizayn anahtarını tanır, `ssh -T git@github-jizayn` çalışır.
- **Git for Windows SSH** (`C:/Program Files/Git/usr/bin/ssh.exe`) → Jizayn anahtarını bulamaz; `git push` başarısız olur.
- Cursor terminali etkileşimli değil → parolalı anahtar için passphrase sorulamaz (ssh-agent'ta yüklü olmalı).

## Push prosedürü (PowerShell — Cursor ajanı)

Commit sonrası **sırayla**:

```powershell
cd C:\Users\puma_\Desktop\Jizayn

# 1) Değişiklikleri commit et (kullanıcı istediyse)
git add -A
git reset HEAD tmp-en.html tmp-tr.html 2>$null   # geçici test dosyalarını hariç tut
git commit -m "commit mesajı"

# 2) GitHub'a push — MUTLAKA Windows OpenSSH kullan
$env:GIT_SSH_COMMAND = 'C:/Windows/System32/OpenSSH/ssh.exe'
git push origin main

# 3) Doğrula
git status   # "up to date with origin/main" olmalı
```

## Bağlantı testi
```powershell
ssh -T git@github-jizayn
# Beklenen: "Hi jizayntr-sys! You've successfully authenticated..."
```

## Commit'e dahil etme
- `tmp-en.html`, `tmp-tr.html` (test artığı)
- `.next/` (build cache — .gitignore'da olmalı)

## Kalıcı çözüm (kullanıcı isterse — bir kez)
Kullanıcı kendi terminalinde çalıştırabilir; ajan `git config` güncellemez (proje kuralı):
```powershell
git config core.sshCommand "C:/Windows/System32/OpenSSH/ssh.exe"
```

## Son başarılı push
- **Tarih:** 2026-06-23
- **Commit'ler:** `17914b0` (büyük site güncellemesi), `37d7cfe` (Akari fiyat)
- **Yöntem:** `$env:GIT_SSH_COMMAND` + `git push origin main`
