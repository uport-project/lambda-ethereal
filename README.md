# lambda-fatima
uPort direct attestor.

[![codecov](https://codecov.io/gh/uport-project/lambda-fatima/branch/master/graph/badge.svg)](https://codecov.io/gh/uport-project/lambda-fatima)


## To create the request QR code.

1.- Get the request url for your event at:

```
curl -d '{"eventName":"<youreventname>"}' https://api.uport.me/fatima/request
```

2.- Take the `data` field (the one that starts with `me.uport:me?requestToken=eyJ0eXAiO....`) 
and encode that in a QR code.

3.- With Google Charts API
```
http://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=me.uport:me?requestToken=eyJ0eXAiO....
```

4.- Create a fancy uPort QR code at: https://www.qrcode-monkey.com/

- Use the requestUrl as the Content
- Use this color: #5C50CA 
- Use this as logo: https://avatars1.githubusercontent.com/u/24941981


