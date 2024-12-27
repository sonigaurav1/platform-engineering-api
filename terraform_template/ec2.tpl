resource "aws_instance" "ec2-instance" {
  ami           = "ami-0e2c8caa4b6378d8c"
  instance_type = "t2.micro"
  tags = {{{TAG_LIST}}}
}

output "name" {
  value       = aws_instance.ec2-instance.public_ip
  description = "Show the pubic ip address of ec2 instance"
}