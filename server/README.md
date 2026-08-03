# online-library-CT449

```
npm init 
# add type module in package.json

npm install express mongoose socket.io bcrypt jsonwebtoken cors dotenv


docker compose up -d
docker exec -it mongo-quanlymuonsach mongosh --eval "rs.initiate()"

npm run dev

docker exec -it mongo-quanlymuonsach mongosh

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"maNhanVien":"NV001","password":"123456"}'
```
