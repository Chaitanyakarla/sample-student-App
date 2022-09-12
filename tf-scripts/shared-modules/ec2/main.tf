resource "aws_instance" "web" {
  ami           = var.ec2_ami
  instance_type = "t2.micro"
  vpc_security_group_ids = var.vpc_security_group_ids
  key_name = var.ssh_key_name
  subnet_id                   = var.subnetid
  associate_public_ip_address = true

  tags = {
    Name = var.ec2_server_name
  }
}

resource "aws_key_pair" "studentappKeypair"{
  key_name = var.ssh_key_name
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCsrOLrJB3YVJSwN09qJ7KNcu5tKX8+0IcXLvkacaZ+zdOqtfIXKkiefknpEZ5yV5RfkmsKTdoIhalsiypDdhi+K5uZyk0NlWJfV4FLTslqOupilxuUH2HU5W1yWcrJLalKPvw99VyWesE3hefhmKDLUs3yf+wHw9Yu1CMo643hByUsCNpyD3EhyU+VLzchLDqPBkY0UKN6KeDNAByV+FBoiOXq/0FgPd/wGCN+YwXmpf30gxTC3EUfaaMT5kn0jBuPGTrvuIo/kQnKKkccCApo0Ovs5AW7nqZjwcrlgVAtXsFXNtz2bugNRNAn/fqBLfaDXSGD97EuHRA5RWkepXWH padmaprabhasa@Padmas-MacBook-Pro.local"
}


resource "aws_alb" "alb" {
  name            = "studentapp-alb"
  security_groups = var.alb_security_group_ids
  subnets         = var.subnet_id
  internal           = false
  load_balancer_type = "application"
  tags = {
    Environment = var.env
  }
}

resource "aws_alb_target_group" "studentapp-targetgroup" {
  name     = "studentapp-alb-target"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  #["${module.vpc.vpc_cidr_block}"]
  stickiness {
    type = "lb_cookie"
  }
  # Alter the destination of the health check to be the login page.
  health_check {
    interval = 10
    path = "/"
    protocol = "HTTP"
    timeout = 5
    healthy_threshold = 5
    unhealthy_threshold = 2
  }
}


resource "aws_alb_listener" "listener_http" {
  load_balancer_arn = "${aws_alb.alb.arn}"
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_alb_target_group.studentapp-targetgroup.arn}"
    type             = "forward"
  }
}


resource "aws_lb_target_group_attachment" "studentapp_target_group_attachment" {
  target_group_arn = aws_alb_target_group.studentapp-targetgroup.arn
  target_id        = aws_instance.web.id
  port             = 80
}

resource "aws_autoscaling_attachment" "studentapp_target_group_attachment_autoscaling_attachment" {
  alb_target_group_arn   = "${aws_alb_target_group.studentapp-targetgroup.arn}"
  autoscaling_group_name = "${aws_autoscaling_group.studentapp_autoscaling_group.id}"
}

resource "aws_launch_configuration" "studentapp_launch_conf" {
  name_prefix   = "studentapp_launch_conf"
  image_id      = var.ec2_ami
  instance_type = "t2.micro"
  key_name = var.ssh_key_name
    
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "studentapp_autoscaling_group" {
    name = "studentapp_autoscaling_group"
    vpc_zone_identifier = var.subnet_id
    #["${module.subnet.public_subnet_id}"]
    launch_configuration = aws_launch_configuration.studentapp_launch_conf.name
    min_size                  = 1
    max_size                  = 3
    health_check_grace_period = 100
    health_check_type         = "EC2"
    force_delete              = true
    tag {
        key                 = "Name"
        value               = "studentapp_instance"
        propagate_at_launch = true
  }
}

resource "aws_autoscaling_policy" "studentapp_scaleup_policy" {
  name                   = "studentapp_scaling_policy"
  scaling_adjustment     = 1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 60
  autoscaling_group_name = aws_autoscaling_group.studentapp_autoscaling_group.name
  policy_type = "SimpleScaling"
}


resource "aws_cloudwatch_metric_alarm" "studentapp_scaleup_alb_alarm" {
  alarm_name          = "studentapp_scaleup_alb_alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.studentapp_autoscaling_group.name
  }

  alarm_description = "This metric monitors ec2 cpu utilization"
  actions_enabled   = true
  alarm_actions     = [aws_autoscaling_policy.studentapp_scaleup_policy.arn]
}


resource "aws_autoscaling_policy" "studentapp_scaledown_policy" {
  name                   = "studentapp_scaledown_policy"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 60
  autoscaling_group_name = aws_autoscaling_group.studentapp_autoscaling_group.name
  policy_type = "SimpleScaling"
}


resource "aws_cloudwatch_metric_alarm" "studentapp_scaledown_alb_alarm" {
  alarm_name          = "studentapp_scaledown_alb_alarm"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "30"

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.studentapp_autoscaling_group.name
  }

  alarm_description = "This metric monitors ec2 cpu utilization"
  actions_enabled   = true
  alarm_actions     = [aws_autoscaling_policy.studentapp_scaledown_policy.arn]
}