resource "aws_instance" "ec2-instance" {
  ami           = {{{AMI}}}
  instance_type = {{{INSTANCE_TYPE}}}
  tags = {{{TAG_LIST}}}
}

output "name" {
  value       = aws_instance.ec2-instance.public_ip
  description = "Show the pubic ip address of ec2 instance"
}