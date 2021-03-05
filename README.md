# Sportiv-Backend

## Installation

    npm install

## Environment

    .env.example
    Use this example to create your own .env file with your own configuration

    # These all are current development environment
    Explanation:

    # Specify Port to run
    PORT=5100

    # Token to sign JWT and compare with
    ACCESS_TOKEN_SECRET='49252C05ACC5A15288A0C42D61A38C399343B8D19942B8AF58BEABBC93E9511B'

    # Change this to the folder where it stores the static files
    TEMP_DIRECTORY='/opt/emtiv-backend/temp'

    # Token to encrypt forget password email
    FORGET_SECRET='ajksbddhjadbhkadsbhkasdbhkasdsbkasdbhklabklasdbjkasdbjkasdbjkasdbkladsbjk'

    # Slack Webhook to log Errors
    SLACK_URL='https://hooks.slack.com/services/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'
    # log Notifications
    SLACK_NOTIFICATION_URL='https://hooks.slack.com/services/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'

    # Static Links
    CHANGE_PASSWORD_URL='https://quickplay.app/forgot/'
    NEWS_PREFIX_LINK='https://quickplay.app/news/'
    ORG_DOMAIN='https://organization.quickplay.app'

    # Set cookie
    COOKIE_DOMAIN='.quickplay.app'

    # Firebase config
    FIREBASE_KEY_DIRECTORY='../sportiv-development-firebase-adminsdk-9xzg2-878e7055e7.json'
    FIREBASE_URL='https://sportiv-development.firebaseio.com'

    # Steam config
    STEAM_REALM='127.0.0.1:3000'
    STEAM_RETURN_URL='127.0.0.1:3000/auth/steam/authenticate'
    STEAM_API_KEY='asd'

    # Mailer config
    MAIL_SMTPHOST='gmail.com'
    MAIL_SMTPPORT='465'
    MAIL_SMTPSECURE=true
    MAIL_SMTPNAME='asd@gmail.com'
    MAIL_SMTPPASSWORD='asd'

    for FIREBASE_KEY_DIRECTORY please supply the firebase adminsdk file from firebase console

## Database Connection

    knexfile.js.example
    Use this example to create your own knexfile.js file with your own configuration

    connection: 'postgres://username:password@host:port/db_name'

    username: db username
    password: db password that matches the username
    host: db host
    port: db port
    db_name: name of the database

    Change the connection to connect to the database

## Running the app

    npm run start