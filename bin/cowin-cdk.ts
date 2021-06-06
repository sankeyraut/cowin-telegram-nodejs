#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CowinCdkStack } from '../lib/cowin-cdk-stack';
import { Tags } from '@aws-cdk/core';
const envBOM = { account: '3185xxxxxx', region: 'ap-south-1' };
const app = new cdk.App();
const telegramtokenStr = '17192xxxxx:AAHcIHokaNM0r_xxxxxxxx_XP2tYWJY_UY'
const frequency = '*/1 * * * ? *'; //every one minute
Tags.of(app).add("auto-delete", "no");
//for mumbai , thane and palghar
const telegramchatStr = '-10011xxxxxxx'
//const frequencyMumbai = '*/1 * * * ? *'; //every minute
new CowinCdkStack(app, 'CowinCdkStackPalghar',{env: envBOM,district:'394',frequency:frequency,districtName: 'Palghar',telegramToken:telegramtokenStr,telegramChat:telegramchatStr,telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackMumbai',{env: envBOM,district:'395',frequency:frequency,districtName: 'Mumbai',telegramToken:telegramtokenStr,telegramChat:telegramchatStr,telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackThane',{env: envBOM,district:'392',frequency:frequency,districtName: 'Thane',telegramToken:telegramtokenStr,telegramChat:telegramchatStr,telegramChat45:'-1'});

//for delhi folks
const telegramchatStrDelhi = '-10013xxxxxxx'
//const delhiFrequency = '*/1 * * * ? *'
new CowinCdkStack(app, 'CowinCdkStackCDelhi',{env: envBOM,district:'141',frequency:frequency,districtName: 'Central Delhi',telegramToken:telegramtokenStr,telegramChat:telegramchatStrDelhi,telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackSEDelhi',{env: envBOM,district:'144',frequency:frequency,districtName: 'South East Delhi',telegramToken:telegramtokenStr,telegramChat:telegramchatStrDelhi,telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackSWDelhi',{env: envBOM,district:'150',frequency:frequency,districtName: 'South West Delhi',telegramToken:telegramtokenStr,telegramChat:telegramchatStrDelhi,telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackSDelhi',{env: envBOM,district:'149',frequency:frequency,districtName: 'South Delhi',telegramToken:telegramtokenStr,telegramChat:telegramchatStrDelhi,telegramChat45:'-1'});

//others
const telegramchatStrOthers = '-1001xxxxxxx'
new CowinCdkStack(app, 'CowinCdkStackPune',{env: envBOM,district:'363',frequency:frequency,districtName: 'Pune',telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackGurugram',{env: envBOM,district:'188',frequency:frequency,districtName: 'Gurugram',telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackChennai',{env: envBOM,district:'571',frequency:frequency,districtName: 'Chennai',telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,telegramChat45:'-1'});
//new CowinCdkStack(app, 'CowinCdkStackMeerut',{env: envBOM,district:'676',frequency:frequency,districtName: 'Meerut',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,telegramChat45:'-1'});
//new CowinCdkStack(app, 'CowinCdkStackBhopal',{env: envBOM,district:'312',frequency:frequency,districtName: 'Bhopal',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,telegramChat45:'-1'});
//new CowinCdkStack(app, 'CowinCdkStackMedchal',{env: envBOM,district:'596',frequency:frequency,districtName: 'Medchal',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,telegramChat45:'-1'});
//new CowinCdkStack(app, 'CowinCdkStackUdupi',{env: envBOM,district:'286',frequency:frequency,districtName: 'Udupi',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,telegramChat45:'-1'});
//new CowinCdkStack(app, 'CowinCdkStackDKannada',{env: envBOM,district:'269',frequency:frequency,districtName: 'D. Kannada',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,telegramChat45:'-1'});
//new CowinCdkStack(app, 'CowinCdkStackNashik',{env: envBOM,district:'389',frequency:frequency,districtName: 'Nashik',token:token,telegramToken:telegramtokenStr,telegramChat:'-1',telegramChat45:'-1'});
//new CowinCdkStack(app, 'CowinCdkStackGhaziabad',{env: envBOM,district:'651',frequency:frequency,districtName: 'Ghaziabad',token:token,telegramToken:telegramtokenStr,telegramChat:'-1',telegramChat45:'-1'});
//new CowinCdkStack(app, 'CowinCdkStackGBNagar',{env: envBOM,district:'650',frequency:frequency,districtName: 'Gautam Buddha Nagar',token:token,telegramToken:telegramtokenStr,telegramChat:'-1',telegramChat45:'-1'});
//new CowinCdkStack(app, 'CowinCdkStackNGoa',{env: envBOM,district:'151',frequency:frequency,districtName: 'N. Goa',telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,telegramChat45:'-1'});


//for bangalore folks
const telegramchatStrbangalore = '-1001xxxxxxx'
new CowinCdkStack(app, 'CowinCdkStackbangaloreUrban',{env: envBOM,district:'265',frequency:frequency,districtName: 'BangaloreUrban',telegramToken:telegramtokenStr,telegramChat:telegramchatStrbangalore,telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackbangaloreRural',{env: envBOM,district:'276',frequency:frequency,districtName: 'BangaloreRural',telegramToken:telegramtokenStr,telegramChat:telegramchatStrbangalore,telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackBBMP',{env: envBOM,district:'294',frequency:frequency,districtName: 'BBMP',telegramToken:telegramtokenStr,telegramChat:telegramchatStrbangalore,telegramChat45:'-1'});
