#!/bin/bash
set -euo pipefail

# Récupérer l'IP publique du serveur (métadonnées EC2, IMDSv2)
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 300")
PUBLIC_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4)

# Installer k3s
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --disable traefik --tls-san $PUBLIC_IP --write-kubeconfig-mode 644" sh -