module.exports = {
    plugins: [
        'tailwindcss',
        'autoprefixer',
        'postcss-preset-env',
        [
            'postcss-normalize',
            {
                allowDuplicates: false
            }
        ]
    ]
}