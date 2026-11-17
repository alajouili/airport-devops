resource "aws_security_group" "k3s" {
  name        = "${var.project}-k3s-sg"
  description = "Pare-feu du serveur k3s"
  vpc_id      = aws_vpc.main.id

  tags = { Name = "${var.project}-k3s-sg" }
}

resource "aws_vpc_security_group_ingress_rule" "ssh" {
  security_group_id = aws_security_group.k3s.id
  description       = "SSH depuis mon PC uniquement"
  cidr_ipv4         = var.my_ip_cidr
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
}

resource "aws_vpc_security_group_ingress_rule" "http" {
  security_group_id = aws_security_group.k3s.id
  description       = "Site web accessible publiquement"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "k8s_api" {
  security_group_id = aws_security_group.k3s.id
  description       = "API Kubernetes depuis mon PC uniquement"
  cidr_ipv4         = var.my_ip_cidr
  ip_protocol       = "tcp"
  from_port         = 6443
  to_port           = 6443
}

resource "aws_vpc_security_group_egress_rule" "all" {
  security_group_id = aws_security_group.k3s.id
  description       = "Sorties autorisees (images, mises a jour)"
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_key_pair" "main" {
  key_name   = "${var.project}-key"
  public_key = file(pathexpand(var.public_key_path))
}