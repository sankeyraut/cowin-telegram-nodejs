import {Stack,StackProps,Construct,Duration} from '@aws-cdk/core';
import * as lambda from "@aws-cdk/aws-lambda";
import * as ddb from "@aws-cdk/aws-dynamodb";
import {Rule,Schedule}  from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from "@aws-cdk/aws-iam" 
import { Tracing } from '@aws-cdk/aws-lambda';
interface CowinCdkStackProps extends StackProps {
  district: string;
  districtName : string;
  token: string;
  telegramToken: string;
  telegramChat: string;
  email: string;
  telegramChat45: string;
  frequency: string;
}

export class CowinCdkStack extends Stack {
  constructor(scope: Construct, id: string, props: CowinCdkStackProps) {
    super(scope, id, props);
    

    // The code that defines your stack goes here
    const lambdaFunction = new lambda.Function(this, "CoWinData", {
      runtime: lambda.Runtime.NODEJS_12_X, 
      code: lambda.Code.fromAsset("lambda"),
      handler: "getdata.main",
      memorySize: 128,
      environment: {
        'DISTRICT': props.district,
        'DISTRICT_NAME' : props.districtName,
        'TOKEN' : props.token,
        'TELEGRAMTOKEN' : props.telegramToken,
        'TELEGRAMCHAT' : props.telegramChat,
        'EMAIL': props.email,
        'TELEGRMCHAT45' : props.telegramChat45
      },
      retryAttempts: 2,
      tracing: Tracing.ACTIVE
    });

    const rule = new Rule(this, 'Rule', {
      schedule: Schedule.expression('cron('+props.frequency+')')
    });
    rule.addTarget(new targets.LambdaFunction(lambdaFunction));

    //Tags.of(lambdaFunction).add('auto-delete', 'never');
  }
}
