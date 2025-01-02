variable "instances" {
  type = map(object({
    instance_type = string
    ami           = string
  }))
  default = {{{EC2_INSTANCE_LIST}}}
}

module "key-pair" {
  source  = "terraform-aws-modules/key-pair/aws"
  version = "2.0.3"

  key_name   = "{{KEY_PAIR_NAME}}"
  public_key = trimspace("{{PUBLIC_KEY}}")
}

module "ec2_instance" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "5.7.1"

  for_each      = var.instances
  name          = "{{EC2_INSTANCE_NAME}}"
  instance_type = each.value.instance_type
  ami           = each.value.ami
  key_name      = module.key-pair.key_pair_name
  tags          = {{{EC2_TAG_KEY}}}
}