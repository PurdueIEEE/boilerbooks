npm --prefix ./api ci
npm --prefix ./ui ci
cp -n ./api/.env.git ./api/.env
sudo service mariadb start
sudo service nginx start
