(function () {

    /**
     * returns a new array filled with shuffled elements of the given array
     * @param arr
     * @return {*[]}
     */
    const arrayShuffle = (arr) => {
        return [...arr].sort(() => 0.5 - Math.random())
    }

    const rowCount = 5;
    const animDurationBaseSeconds = 50;

    const gridRowItemColors = [
        '#FF1493', '#DC143C', '#8B0000', '#FF4500',
        '#006400', '#ADFF2F', '#7FFFD4', '#BDB76B',
        '#00FFFF', '#800080', '#DAA520', '#708090',
        '#FFFF00', '#0000CD', '#E6E6FA', '#FFD700',
        '#000000', '#BC8F8F', '#FF6347', '#FF69B4',
    ]

    const appendItems = (arr) => {
        const gridRowElement = document.createElement('div')
        gridRowElement.classList.add('moving-grid__row')
        for (let i = 0; i < arr.length * 2; i++) {
            const gridRowItemElement = document.createElement('div')
            gridRowItemElement.classList.add('moving-grid__item')
            gridRowItemElement.style.backgroundColor
                = arr[i >= arr.length ? i - arr.length : i]
            gridRowElement.appendChild(gridRowItemElement)
        }
        return gridRowElement
    }

    const grid = document.querySelector('.moving-grid')

    for (let i = 0; i < rowCount; i++) {
        const row = appendItems(arrayShuffle(gridRowItemColors))
        row.style.animationDirection = i % 2 === 0 ? 'reverse' : 'normal'
        row.style.animationDuration =
            animDurationBaseSeconds + animDurationBaseSeconds * Math.random() / 2 + 's'
        grid.appendChild(row)
    }
})()