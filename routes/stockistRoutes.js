const express = require("express");
const { stocstockistByCID, getstockistById, createStockists, UpdateStockist,stockistList ,deleteById} = require("../controller/stokistController");


const router = express.Router();

router.post("/newStockists/:companyID", createStockists);

router.put("/stockistUpdate/:StockistID", UpdateStockist);

router.get("/stockists/:company_id", stocstockistByCID);

router.get("/stockist/:stockistID", getstockistById);

router.get("/stockistList", stockistList);

router.post("/deleteStockist/:stockistID", deleteById);

module.exports = router;

// scp -i "c:/Users/user/Downloads/my-node.pem" "c:/Users/user/Downloads/instamd_db.sql" ubuntu@65.0.61.59:/home/ubuntu/


// ssh -i "c:/Users/user/Downloads/my-node.pem" ubuntu@65.0.61.59:/home/ubuntu/


// scp -r dist ubuntu@65.0.61.59:/var/www/html/react


// scp -i "c:/Users/user/Downloads/my-node.pem" -r dist ubuntu@65.0.61.59:/var/www/html/react

// http://internal.instamd.in/


// server {
//     listen 80 default_server;
//     listen [::]:80 default_server;

//     root /var/www/html;

//     # Set the index file for your React frontend
//     index index.html;

//     server_name your_domain_or_ip;  # Replace with your domain or server IP

//     # Serve the React frontend
//     location / {
//         root /var/www/html/react;
//         try_files $uri /index.html;
//     }

//     # Proxy requests to Node.js backend
//     location /api/ {
//         proxy_pass http://localhost:3000;  # Change port if needed
//         proxy_http_version 1.1;
//         proxy_set_header Upgrade $http_upgrade;
//         proxy_set_header Connection 'upgrade';
//         proxy_set_header Host $host;
//         proxy_cache_bypass $http_upgrade;
//     }
// }
