2. Cek status sebelum update
docker compose ps
Harus kira-kira:
app         healthy
nginx       healthy
mysql       healthy
redis       healthy
queue       up
scheduler  up
Cek website:
curl -I https://career.webcareproject.my.id
Harus:
HTTP/2 200
3. Backup sebelum update
Backup database:
mkdir -p /home/ian/backups/internwebcare
docker compose exec -T mysql mysqldump \
  -u intern_webcare \
  -p'change_me_strong_password' \
  intern_webcare > /home/ian/backups/internwebcare/db-$(date +%F-%H%M%S).sql
Backup storage/media:
docker run --rm \
  -v internwebcaretest_app_storage:/data \
  -v /home/ian/backups/internwebcare:/backup \
  alpine tar czf /backup/storage-$(date +%F-%H%M%S).tar.gz -C /data .
Cek hasil backup:
ls -lh /home/ian/backups/internwebcare
4. Update kode
Jika project pakai Git:
git status
git pull
Jika ada error karena local changes, cek dulu:
git status
Jangan asal reset kalau ada perubahan penting. Simpan dulu:
git stash
git pull
Jika update dari lokal pakai upload manual, dari komputer lokal jalankan:
rsync -avz --delete \
  --exclude=".git" \
  --exclude=".env" \
  --exclude=".env.docker" \
  --exclude="vendor" \
  --exclude="node_modules" \
  --exclude="storage" \
  ./ ian@43.133.155.164:/home/ian/apps/InternWebcareTest/
Kalau Windows tidak punya rsync, bisa pakai scp, tapi hati-hati jangan overwrite .env.docker:
scp -r Dockerfile docker-compose.yml docker bootstrap app config database public resources routes composer.json composer.lock package.json package-lock.json vite.config.ts tsconfig.json ian@43.133.155.164:/home/ian/apps/InternWebcareTest/
5. Pastikan .env.docker tetap benar
Di VPS:
grep -E '^(APP_ENV|APP_DEBUG|APP_URL|DB_DATABASE|DB_USERNAME|DB_PASSWORD|MYSQL_ROOT_PASSWORD)=' .env.docker
Minimal:
APP_ENV=production
APP_DEBUG=false
APP_URL=https://career.webcareproject.my.id
DB_DATABASE=intern_webcare
DB_USERNAME=intern_webcare
DB_PASSWORD=change_me_strong_password
MYSQL_ROOT_PASSWORD=change_me_strong_root_password
Penting:
- Jangan hapus .env.docker.
- Jangan ubah DB_PASSWORD kecuali juga ubah password user MySQL di volume.
6. Rebuild Docker image
docker compose --env-file .env.docker build
Jika berhasil, lanjut start:
docker compose --env-file .env.docker up -d
Atau gabung:
docker compose --env-file .env.docker up -d --build
7. Jalankan migration
docker compose --env-file .env.docker exec app php artisan migrate --force
Jangan pakai ini kecuali ingin hapus semua data:
# BERBAHAYA: hapus semua tabel dan data
docker compose --env-file .env.docker exec app php artisan migrate:fresh --seed --force
8. Clear cache Laravel
docker compose --env-file .env.docker exec app php artisan optimize:clear
Cache ulang config dan view:
docker compose --env-file .env.docker exec app php artisan config:cache
docker compose --env-file .env.docker exec app php artisan view:cache
Jangan jalankan route cache dulu, karena project pernah punya duplicate route name:
# jangan dulu jika duplicate route belum dibereskan
docker compose --env-file .env.docker exec app php artisan route:cache
9. Restart service penting
docker compose --env-file .env.docker restart app nginx queue scheduler
Jika pakai Caddy host:
sudo systemctl reload caddy
10. Cek status container
docker compose --env-file .env.docker ps
Expected:
app         healthy
nginx       healthy
mysql       healthy
redis       healthy
queue       up
scheduler  up
Jika app restart terus:
docker compose --env-file .env.docker logs --tail=100 app
Jika nginx error:
docker compose --env-file .env.docker logs --tail=100 nginx
Jika DB error:
docker compose --env-file .env.docker logs --tail=100 mysql
11. Cek akses lokal di VPS
Cek Docker Nginx langsung:
curl -I http://127.0.0.1:8090
Harus:
HTTP/1.1 200 OK
Kalau ini 200, berarti Docker app jalan.
12. Cek domain publik
curl -I https://career.webcareproject.my.id
Harus:
HTTP/2 200
Jika domain 502, cek:
sudo systemctl status caddy
sudo journalctl -u caddy --no-pager -n 80
docker compose --env-file .env.docker logs --tail=100 nginx
docker compose --env-file .env.docker logs --tail=100 app
13. Cek storage/media
Cek symlink:
docker compose --env-file .env.docker exec app ls -la public/storage
docker compose --env-file .env.docker exec nginx ls -la public/storage
Harus:
public/storage -> /var/www/html/storage/app/public
Test file:
docker compose --env-file .env.docker exec app php -r "file_put_contents('storage/app/public/update-test.txt', 'storage-ok');"
curl https://career.webcareproject.my.id/storage/update-test.txt
Harus:
storage-ok
14. Jika port 80 error saat update
Jika muncul:
failed to bind host port 0.0.0.0:80/tcp: address already in use
Pastikan docker-compose.yml punya:
nginx:
  ports:
    - "127.0.0.1:8090:80"
Bukan:
- "80:80"
Karena port 80/443 dipakai Caddy.
15. Jika MySQL access denied
Jika muncul:
SQLSTATE[HY000] [1045] Access denied for user 'intern_webcare'
Artinya password .env.docker tidak sama dengan password user di volume MySQL.
Jangan hapus volume kalau data penting.
Solusi normal:
- Kembalikan DB_PASSWORD di .env.docker ke password lama yang benar.
- Atau reset password user MySQL dari root.
Jangan jalankan:
docker compose down -v
Karena itu menghapus volume DB dan storage.
16. Command update ringkas
Jika update dari Git:
ssh ian@43.133.155.164
cd /home/ian/apps/InternWebcareTest
docker compose exec -T mysql mysqldump -u intern_webcare -p'change_me_strong_password' intern_webcare > /home/ian/backups/internwebcare/db-$(date +%F-%H%M%S).sql
git pull
docker compose --env-file .env.docker up -d --build
docker compose --env-file .env.docker exec app php artisan migrate --force
docker compose --env-file .env.docker exec app php artisan optimize:clear
docker compose --env-file .env.docker exec app php artisan config:cache
docker compose --env-file .env.docker exec app php artisan view:cache
docker compose --env-file .env.docker restart app nginx queue scheduler
sudo systemctl reload caddy
docker compose --env-file .env.docker ps
curl -I https://career.webcareproject.my.id
Expected final:
HTTP/2 200