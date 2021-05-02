#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CowinCdkStack } from '../lib/cowin-cdk-stack';

const app = new cdk.App();
new CowinCdkStack(app, 'CowinCdkStack');
