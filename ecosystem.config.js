module.exports = {
    apps: [
        {
            name: 'CrawerFinder',
            script: './src/main.ts',
            env_prod: {
                DOORAY_WEBHOOK_URL: ''
            }
        }
    ]
}