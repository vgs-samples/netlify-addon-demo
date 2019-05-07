Netlify addon demo is a demo integration of [Netlify forms](https://www.netlify.com/docs/form-handling/) with [Very Good Security](https://www.verygoodsecurity.com/). The addon allows to collect users data via forms and securely transfer them to 3rd parties as Checkr and Stripe.

## How to use it 

- Add `secure` attribute to the `<form>` tag
- Add `data-secure-field` attribute to the `<input>` tag with sensitive data

ToDo: links to addon docs. Read guide in docs

## Running locally
- `npm install`

You need to provide a couple of secrets as env variables, to make it work
- `NETLIFY_TOKEN=? VGS_USER=? VGS_PASSWORD=? CHECKR_KEY=? VGS_TENANT_ID=? STRIPE_SECRET=? npm run start-fn`

## Demo addon diagram

![addon diagram](https://netlify-vgs-demo.netlify.com/Netlify-VGS-addon.svg)

