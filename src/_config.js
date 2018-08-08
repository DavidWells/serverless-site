/**
 * Project config
 * NOTE: No private data/keys should be stored here.
 */

import gitBranch from 'git-branch'

module.exports = function siteConfig(isProduction) {
  return (
    {
      SITENAME: process.env.SITENAME || 'serverless',
      TWITTER: process.env.TWITTER || 'goServerless',
      GITHUB: process.env.GITHUB || 'serverless',
      GOOGLE_ANALYTICS_UA: (isProduction) ? 'UA-79511111' : 'dev',
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || 'qaNtBzG1CxxxxxNw20r',
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || 'xxx.auth0.com',
      ALGOLIA_ADMIN: process.env.ALGOLIA_ADMIN || 'xxxxx',
      // SEGMENT_KEY: process.env.SEGMENT_KEY || 'gNftvcGllpKZTe5PcAxF8pEoenLq32H0',
      CUSTOMER_IO_KEY: process.env.CUSTOMER_IO_KEY || 'xxxxx',
      LOGO: {
        ICON: 'https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/logos/serverless-logo.svg'
      },
      S3_BUCKET: 'https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/',
      /* Serverless API Gateway Endpoints */
      API: {
        ERROR: 'https://kuen1ml0f0.execute-api.us-west-2.amazonaws.com/prod/report',
        NEWSLETTER: 'https://3upqirwiuc.execute-api.us-west-2.amazonaws.com/dev/subscribe',
        ADD_CONTACT: 'https://5kihmnzdb7.execute-api.us-west-2.amazonaws.com/prod/hubspot/add',
        FORMS: 'https://d3ul21vxig.execute-api.us-west-2.amazonaws.com/prod/handle-entry'
      },
      BRANCH: process.env.BRANCH || gitBranch.sync(),
    }
  )
}
