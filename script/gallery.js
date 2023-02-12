

(function() {
    const items = [
        'https://picsum.photos/id/10/300/200',
        'https://picsum.photos/id/11/300/200',
        'https://picsum.photos/id/12/300/200',
        'https://picsum.photos/id/13/300/200',
        'https://picsum.photos/id/14/300/200',
        'https://picsum.photos/id/15/300/200',
        'https://picsum.photos/id/16/300/200',
        'https://picsum.photos/id/17/300/200',
        'https://picsum.photos/id/18/300/200',
        'https://picsum.photos/id/19/300/200',
        'https://picsum.photos/id/20/300/200',
        'https://picsum.photos/id/21/300/200',
        'https://picsum.photos/id/22/300/200',
        'https://picsum.photos/id/23/300/200',
        'https://picsum.photos/id/24/300/200',
    ]

    const bigTrack = document.querySelector('.gallery__big-track'),
        smallTrack = document.querySelector('.gallery__small-track'),
        {length} = items;

    let activeElement = null

    for (let i = 0; i < items.length; i++) {
        // fill bigTrack
        const elemBig = document.createElement('div')
        elemBig.classList.add('gallery__big')
        elemBig.style.backgroundImage = 'url(' + items[i] + ')'
        bigTrack.appendChild(elemBig)

        // fill smallTrack
        const elemSmall = document.createElement('div')
        if (i === 0) {
            elemSmall.classList.add('gallery__small--active')
            activeElement = elemSmall
        }
        elemSmall.classList.add('gallery__small')
        elemSmall.style.backgroundImage = 'url(' + items[i] + ')'
        smallTrack.appendChild(elemSmall)
    }

    const bigTrackItem = document.querySelector('.gallery__big'),
        bigVisible = document.querySelector('.gallery__main'),
        leftBtn = document.querySelector('.gallery__left'),
        rightBtn = document.querySelector('.gallery__right'),
        activeFrame = document.querySelector('.gallery__active'),
        smallTrackItem = document.querySelector('.gallery__small'),
        smallTrackItems = document.querySelectorAll('.gallery__small'),
        smallVisible = document.querySelector('.gallery__visible'),
        counter = document.querySelector('.gallery__counter'),
        fullBtn = document.querySelector('.gallery__full');
    let bigTrackItemWidth = bigTrackItem.getBoundingClientRect().width,
        smallTrackItemWidth = smallTrackItem.getBoundingClientRect().width,
        smallTrackWidth = smallTrack.getBoundingClientRect().width,
        smallVisibleWidth = smallVisible.getBoundingClientRect().width,
        smallTrackGap = (smallTrackWidth - length * smallTrackItemWidth) / (length - 1),
        smallTranslateWidth = smallTrackGap + smallTrackItemWidth,
        smallTrackTranslateMax = (smallTrackWidth - smallVisibleWidth - smallTrack.offsetLeft * 2),
        smallTrackTranslate = (smallTrackWidth - smallVisibleWidth + smallTrack.offsetLeft * 2) / (length - 1),
        activeFrameTranslate = smallTranslateWidth - smallTrackTranslate

    let count = 0;

    const rewriteCounter = () => {
        counter.innerHTML = count + 1 +  ' / ' + length
    }
    rewriteCounter()

    const changeActiveElement = () => {
        activeElement.classList.remove('gallery__small--active')
        smallTrackItems.item(count).classList.add('gallery__small--active')
        activeElement = smallTrackItems.item(count)
    }

    const styleTransform = (
        small = -smallTrackTranslate * count,
        big = -100 * count,
        active = activeFrameTranslate * count
    ) => {
        changeActiveElement()
        smallTrack.style.transform = `translate(${small}px)`
        bigTrack.style.transform = `translate(${big}%)`
        activeFrame.style.transform = `translate(${active}px)`
    }

    const adjustTransformAfterResize = () => {
        bigTrackItemWidth = bigTrackItem.getBoundingClientRect().width;
        smallTrackItemWidth = smallTrackItem.getBoundingClientRect().width;
        smallTrackWidth = smallTrack.getBoundingClientRect().width;
        smallVisibleWidth = smallVisible.getBoundingClientRect().width;
        smallTrackGap = (smallTrackWidth - length * smallTrackItemWidth) / (length - 1);
        smallTranslateWidth = smallTrackGap + smallTrackItemWidth;
        smallTrackTranslateMax = (smallTrackWidth - smallVisibleWidth - smallTrack.offsetLeft * 2);
        smallTrackTranslate = (smallTrackWidth - smallVisibleWidth + smallTrack.offsetLeft * 2) / (length - 1);
        activeFrameTranslate = smallTranslateWidth - smallTrackTranslate;
        styleTransform()
    }

    const countInc = () => {
        count >= length - 1
            ? count = 0
            : count++;
        rewriteCounter()
    }
    const countDec = () => {
        count <= 0
            ? count = length - 1
            : count--;
        rewriteCounter()
    }

    leftBtn.addEventListener('click', () => {
        countDec()
        styleTransform()
    })
    rightBtn.addEventListener('click', () => {
        countInc()
        styleTransform()
    })


    const debounce = (callback, ms) => {
        let isDelay = false;

        return (...args) => {
            if (!isDelay) {
                isDelay = true
                setTimeout(() => {
                    isDelay = false
                    callback(...args)
                }, ms)
            }
        }
    }

    const debouncedAdjust = debounce(adjustTransformAfterResize, 100)

    window.addEventListener('resize', debouncedAdjust)

    smallTrack.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) return

        count = items.findIndex((str) => e.target.style.backgroundImage.includes(str))

        rewriteCounter()
        styleTransform()
    })

    // sliding by mouse

    let distance = 0,
        down = false,
        downPoint = 0;

    bigVisible.addEventListener('mousedown', (e) => {
        e.preventDefault()
        down = true
        downPoint = e.clientX
    })

    const checkIfSwipe = () => {
        if (!down) return
        down = false
        if ((Math.abs(distance) / bigTrackItemWidth) * 100 < 30) {
            styleTransform(-smallTrackTranslate * count, -count * 100, activeFrameTranslate * count)
        } else {
            distance < 0 ? countInc() : countDec()
            styleTransform(-smallTrackTranslate * count, -count * 100, activeFrameTranslate * count)
        }
        distance = 0
        downPoint = 0
    }

    bigVisible.addEventListener('mouseout', checkIfSwipe)
    bigVisible.addEventListener('mouseup', checkIfSwipe)

    const debouncedOnMove = debounce((e) => {
        if (!down) return
        distance = e.clientX - downPoint
        styleTransform(
            -smallTrackTranslate * count + distance * ((smallTrackItemWidth + smallTrackGap) / (bigVisible.getBoundingClientRect().width*2)),
            -count * 100 + (distance / bigTrackItemWidth) * 100,
            activeFrameTranslate * count - distance * ((smallTrackItemWidth + smallTrackGap) / (bigVisible.getBoundingClientRect().width*2))
            )
    }, 50)

    bigVisible.addEventListener('mousemove', e => debouncedOnMove(e))

    // full screen mode

    fullBtn.addEventListener('click', () => {
        bigVisible.parentElement.classList.toggle('gallery--viewing')
    })
    window.onkeyup = (e) => {
        if (e.code === 'Escape') bigVisible.parentElement.classList.remove('gallery--viewing')
    }
})()