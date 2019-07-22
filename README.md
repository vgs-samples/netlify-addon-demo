<a href="https://app.netlify.com/start/deploy?repository=https://github.com/verygoodsecurity/netlify-addon-demo/"><img src="https://www.netlify.com/img/deploy/button.svg"></a>

Netlify addon demo is a demo integration of [Netlify forms](https://www.netlify.com/docs/form-handling/) with [Very Good Security](https://www.verygoodsecurity.com/). The addon allows to collect users data via forms and securely transfer them to 3rd parties as Checkr and Stripe.

Addon docs https://www.verygoodsecurity.com/docs/integrations/netlify


## How to use it 

- Add `data-secure` attribute to the `<form>` tag
- Add `data-secure-field` attribute to the `<input>` tag with sensitive data

Use test data to fill form:
```
email email@email.com 
ssn 111-11-2001
drv F1112001
card 4111111111111111
```


ToDo: links to addon docs. Read guide in docs

## Running locally
- `npm install`

You need to provide a couple of secrets as env variables, to make it work
- `NETLIFY_TOKEN=? VGS_USER=? VGS_PASSWORD=? CHECKR_KEY=? VGS_TENANT_ID=? STRIPE_SECRET=? npm run start-fn`

## Demo addon diagram

![addon diagram](https://netlify-vgs-demo.netlify.com/Netlify-VGS-addon.svg)

