#!/bin/bash

npm install
# Create a systemd service for the Node.js app
cat <<EOF | sudo tee /etc/systemd/system/utilityvpn.service
  [Unit]
  Description=Manage Server with Simple codes
  After=network.target

  [Service]
  Type=simple
  User=root
  ExecStart=sudo node /root/utility/server.js
  Restart=on-failure
  RestartSec=5s

  [Install]
  WantedBy=multi-user.target
EOF

# Sleep for 30 seconds
sleep 7

# Enable and start the systemd service
sudo systemctl enable utilityvpn.service
sudo systemctl start utilityvpn.service

echo "Server Utility App is installed and running."
