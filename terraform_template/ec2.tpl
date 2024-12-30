resource "aws_instance" "ec2-instance" {
  ami           = {{{AMI}}}
  instance_type = {{{INSTANCE_TYPE}}}
  tags = {
     {{{TAG_LIST}}}
     identifier = each.key
  } 
  for_each = toset([{{{NUMBER_OF_INSTANCE}}}])
}

output "ec2_instance_public_ips" {
  description = "Public IP addresses of the EC2 instances"
  value       = { for k, v in aws_instance.ec2-instance : k => v.public_ip }
}

output "ec2_instance_details" {
  description = "Details of the EC2 instances"
  value       = { for k, v in aws_instance.ec2-instance : k => v }
}
