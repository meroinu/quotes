# Quotes
### Build
(don't forget to install node_modules)
`yarn build` or `npm run build`

### Start
`yarn start` or `npm run start`

### Tools
* Nextjs for the quick start.
* Style jsx for the simple styling of the small project (would use styled-components maybe, but it's overkill now).
* Typescript to ease my pain a little.

### Notes
* FMFW ticker socket channel allows only 3s/1s speed (docs say so...); I chose 1s.
* Use two endpoints to fetch initial data: tickers and symbols. Tickers snapshot is to display data immediatly; symbols is to make tickers looks pretty (base/quote). Also in real project the full symbols data may be needed, so using two endpoints seems ok here.
* Subscribe /ticker/batch to get updates in batches (one notifiation contains combined updates).
* Have a good day, don't forget to drink water and eat some fruits, idk.