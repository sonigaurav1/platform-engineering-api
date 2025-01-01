module "key-pair" {
  source  = "terraform-aws-modules/key-pair/aws"
  version = "2.0.3"

  key_name   = "{{KEY_PAIR_NAME}}"
  public_key = trimspace("{{PUBLIC_KEY}}")
}

module "ec2_instance" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "5.7.1"

  for_each      = toset([{{{EC2_NUMBER_OF_INSTANCE}}}])
  name          = "{{EC2_INSTANCE_NAME}}-${each.key}"
  instance_type = "{{EC2_INSTANCE_TYPE}}"
  ami           = "{{EC2_AMI}}"
  key_name      = module.key-pair.key_pair_name
  tags          = {{{EC2_TAG_KEY}}}
}