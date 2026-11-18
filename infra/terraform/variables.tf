variable "region" {
  description = "Region AWS"
  type        = string
  default     = "eu-west-3"

}

variable "aws_profile" {
  description = "Profil AWS CLI à utiliser"
  type        = string
  default     = "terraform"
}

variable "project" {
  description = "Préfixe des noms de ressources"
  type        = string
  default     = "airport"
}

variable "my_ip_cidr" {
  description = "Votre IP publique, au format x.x.x.x/32 (accès SSH et API Kubernetes)"
  type        = string
}

variable "public_key_path" {
  description = "Chemin de la clé SSH publique"
  type        = string
  default     = "~/.ssh/id_ed25519.pub"
}

variable "instance_type" {
  description = "Type d'instance EC2 (eligible free Tier)"
  type        = string
  default     = "c7i-flex.large"
}

