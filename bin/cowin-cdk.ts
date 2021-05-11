#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CowinCdkStack } from '../lib/cowin-cdk-stack';
import { Tags } from '@aws-cdk/core';
const envBOM = { account: '31859227xxxx', region: 'ap-south-1' };
const app = new cdk.App();
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxYy0xZjM3LTQ3NDEtOTI4ZC1lY2MyZjNhOGY2N2UiLCJ1c2VyX2lkIjoiMTZmM2JlMWMtMWYzNy00NzQxLTkyOGQtZWNjMmYzYThmNjdlIiwidXNlcl90eXBlIjoiQkVORUZJQ0lBUlkiLCJtb2JpbGVfbnVtYmVyIjo5NTk0MDgwMDk4LCJiZW5lZmljaWFyeV9yZWZlcmVuY2VfaWQiOjYwMzQ2ODExNTA4NDAwLCJ1YSI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS85MC4wLjQ0MzAuOTMgU2FmYXJpLzUzNy4zNiIsImRhdGVfbW9kaWZpZWQiOiIyMDIxLTA1LTA2VDAyOjI3OjQxLjIxMVoiLCJpYXQiOjE2MjAyNjgwNjEsImV4cCI6MTYyMDI2ODk2MX0.sJIMOgxK08JuSyobfj4xMyblDvGAkU24pxVfcTvTB7E";
const telegramtokenStr = '1719248514:xxxxxxxaNM0r_MvVwKMLnl_XP2tYWJY_UY'
const rateMin = '3';
Tags.of(app).add("auto-delete", "no");
//for mumbai , thane and palghar
const telegramchatStr = '-10011891xxxxx'
new CowinCdkStack(app, 'CowinCdkStackPalghar',{env: envBOM,district:'394',rateMin:rateMin,districtName: 'Palghar',token: token,telegramToken:telegramtokenStr,telegramChat:telegramchatStr,email: 'false',telegramChat45:telegramchatStr});
new CowinCdkStack(app, 'CowinCdkStackMumbai',{env: envBOM,district:'395',rateMin:rateMin,districtName: 'Mumbai',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStr,email: 'false',telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackThane',{env: envBOM,district:'392',rateMin:rateMin,districtName: 'Thane',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStr,email: 'false',telegramChat45:telegramchatStr});

//for delhi folks
const telegramchatStrDelhi = '-10013732xxxxx'
new CowinCdkStack(app, 'CowinCdkStackCDelhi',{env: envBOM,district:'141',rateMin:rateMin,districtName: 'Central Delhi',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrDelhi,email: 'false',telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackSEDelhi',{env: envBOM,district:'144',rateMin:rateMin,districtName: 'South East Delhi',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrDelhi,email: 'false',telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackSWDelhi',{env: envBOM,district:'150',rateMin:rateMin,districtName: 'South West Delhi',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrDelhi,email: 'false',telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackSDelhi',{env: envBOM,district:'149',rateMin:rateMin,districtName: 'South Delhi',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrDelhi,email: 'false',telegramChat45:'-1'});

//others
const telegramchatStrOthers = '-10013085xxxx'
new CowinCdkStack(app, 'CowinCdkStackMeerut',{env: envBOM,district:'676',rateMin:rateMin,districtName: 'Meerut',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,email: 'false',telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackPune',{env: envBOM,district:'363',rateMin:rateMin,districtName: 'Pune',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,email: 'false',telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackNGoa',{env: envBOM,district:'151',rateMin:rateMin,districtName: 'N. Goa',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,email: 'false',telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackBhopal',{env: envBOM,district:'312',rateMin:rateMin,districtName: 'Bhopal',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,email: 'false',telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackMedchal',{env: envBOM,district:'596',rateMin:rateMin,districtName: 'Medchal',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,email: 'false',telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackUdupi',{env: envBOM,district:'286',rateMin:rateMin,districtName: 'Udupi',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,email: 'false',telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackDKannada',{env: envBOM,district:'269',rateMin:rateMin,districtName: 'D. Kannada',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrOthers,email: 'false',telegramChat45:'-1'});


//for bangalore folks
const telegramchatStrbangalore = '-10011678xxxx'
new CowinCdkStack(app, 'CowinCdkStackbangaloreUrban',{env: envBOM,district:'265',rateMin:rateMin,districtName: 'BangaloreUrban',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrbangalore,email: 'false',telegramChat45:'-1'});
new CowinCdkStack(app, 'CowinCdkStackbangaloreRural',{env: envBOM,district:'276',rateMin:rateMin,districtName: 'BangaloreRural',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStrbangalore,email: 'false',telegramChat45:'-1'});



//new CowinCdkStack(app, 'CowinCdkStackAgatti',{env: envBOM,district:'796',districtName: 'Agatti',token:token,telegramToken:telegramtokenStr,telegramChat:telegramchatStr});

//TODO : Add dynamodb table for storing email id
//TODO : Store district wise user user
//TODO : Fetch emails from respective user list of that district