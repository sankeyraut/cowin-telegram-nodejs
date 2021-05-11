import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CowinCdk from '../lib/cowin-cdk-stack';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxNmYzYmUxYy0xZjM3LTQ3NDEtOTI4ZC1lY2MyZjNhOGY2N2UiLCJ1c2VyX2lkIjoiMTZmM2JlMWMtMWYzNy00NzQxLTkyOGQtZWNjMmYzYThmNjdlIiwidXNlcl90eXBlIjoiQkVORUZJQ0lBUlkiLCJtb2JpbGVfbnVtYmVyIjo5NTk0MDgwMDk4LCJiZW5lZmljaWFyeV9yZWZlcmVuY2VfaWQiOjYwMzQ2ODExNTA4NDAwLCJ1YSI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS85MC4wLjQ0MzAuOTMgU2FmYXJpLzUzNy4zNiIsImRhdGVfbW9kaWZpZWQiOiIyMDIxLTA1LTA2VDAyOjI3OjQxLjIxMVoiLCJpYXQiOjE2MjAyNjgwNjEsImV4cCI6MTYyMDI2ODk2MX0.sJIMOgxK08JuSyobfj4xMyblDvGAkU24pxVfcTvTB7E";
const telegramtokenStr = '1719248514:AAHcIHokaNM0r_MvVwKMLnl_XP2tYWJY_UY'
const rateMin = '5';
const envBOM = { account: '318592275439', region: 'ap-south-1' };
const telegramchatStr = '-1001189124807'
test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CowinCdk.CowinCdkStack(app, 'MyTestStack',{env: envBOM,district:'394',rateMin:rateMin,districtName: 'Palghar',token: token,telegramToken:telegramtokenStr,telegramChat:telegramchatStr,email: 'false',telegramChat45:'-1'});
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
