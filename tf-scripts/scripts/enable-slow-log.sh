#!/bin/bash
slowlog_groupname="$(terraform output -raw slowlog_groupname)"
enginelog_groupname="$(terraform output -raw enginelog_groupname)"
clustername="$(terraform output -raw clustername)"


aws elasticache modify-replication-group \
    --replication-group-id $clustername \
    --apply-immediately \
    --log-delivery-configurations '
    {
      "LogType":"slow-log", 
      "DestinationType":"cloudwatch-logs", 
      "DestinationDetails":{ 
        "CloudWatchLogsDetails":{ 

          "LogGroup": "studentcluster-slow-logs"
        } 
      },
      "LogFormat":"json" 
    }'


aws elasticache modify-replication-group \
    --replication-group-id $clustername \
    --apply-immediately \
    --log-delivery-configurations '
    {
      "LogType":"engine-log", 
      "DestinationType":"cloudwatch-logs", 
      "DestinationDetails":{ 
        "CloudWatchLogsDetails":{ 

          "LogGroup": "studentcluster-engine-log"
        } 
      },
      "LogFormat":"json" 
    }'


aws application-autoscaling register-scalable-target \
    --service-namespace elasticache \
    --resource-id replication-group/$clustername\
    --scalable-dimension elasticache:replication-group:Replicas \
    --min-capacity 1 \
    --max-capacity 5 \



aws application-autoscaling put-scaling-policy \
    --policy-name myscalablepolicy \
    --policy-type TargetTrackingScaling \
    --resource-id replication-group/$clustername \
    --service-namespace elasticache \
    --scalable-dimension elasticache:replication-group:Replicas \
    --target-tracking-scaling-policy-configuration '{
      "TargetValue": 70.0,
      "PredefinedMetricSpecification":{
        "PredefinedMetricType": "ElastiCacheReplicaEngineCPUUtilization"
        },
      "ScaleInCooldown": 600,
      "ScaleOutCooldown": 300
    }'