(function() {

    let isSorting = false;

    const nums = [],
        amount = 12;

    const grid = document.querySelector('.bubble'),
        newBtn = document.querySelector('.bubble__new'),
        startBtn = document.querySelector('.bubble__start'),
        columns = [...grid.children].filter((elem) => !elem.classList.contains('bubble__buttons'))

    const addNumberChild = (parent, num) => {
        const elem = document.createElement('div')
        elem.classList.add('bubble__number')
        elem.innerHTML = num
        parent.appendChild(elem)
    }

    for (let i = 0; i < amount; i++) {
        nums.push(Math.round(Math.random() * 50))
        columns.forEach((column) => {
            addNumberChild(column, nums[i])
        })
    }

    const defaultColumn = document.querySelectorAll('.bubble__default > .bubble__number'),
        memorizeColumn = document.querySelectorAll('.bubble__memorize > .bubble__number'),
        returnColumn = document.querySelectorAll('.bubble__return > .bubble__number'),
        twoWayColumn = document.querySelectorAll('.bubble__two-way > .bubble__number'),
        twoWayReturnColumn = document.querySelectorAll('.bubble__two-way-return > .bubble__number'),
        defaultFrame = document.querySelector('.bubble__default > .bubble__frame'),
        twoWayTopFrame = document.querySelector('.bubble__two-way > .bubble__frame'),
        twoWayBottomFrame = document.querySelector('.bubble__two-way > .bubble__frame + .bubble__frame'),
        twoWayReturnTopFrame = document.querySelector('.bubble__two-way-return > .bubble__frame'),
        twoWayReturnBottomFrame = document.querySelector('.bubble__two-way-return > .bubble__frame + .bubble__frame'),
        memorizeFrame = document.querySelector('.bubble__memorize > .bubble__frame'),
        returnFrame = document.querySelector('.bubble__return > .bubble__frame'),
        number = document.querySelector('.bubble__number'),
        numHeight = number.getBoundingClientRect().height;


    const frames = [
        defaultFrame,
        memorizeFrame,
        returnFrame,
        twoWayTopFrame,
        twoWayBottomFrame,
        twoWayReturnTopFrame,
        twoWayReturnBottomFrame,
    ]
    frames.forEach((frame => frame.style.height = 2 * numHeight + 'px'))

    const moveFrame = (frame, i) => {
        frame.style.transform = 'translateY(' + i * numHeight + 'px)';
    }

    moveFrame(twoWayBottomFrame, amount - 2)
    moveFrame(twoWayReturnBottomFrame, amount - 2)

    const moveNumbers = (numObj, i) => {
        numObj[i].translate += numHeight
        numObj[i + 1].translate -= numHeight
        const temp = numObj[i]
        numObj[i] = numObj[i + 1]
        numObj[i + 1] = temp
        numObj[i].elem.style.transform = 'translateY(' + numObj[i].translate + 'px)'
        numObj[i + 1].elem.style.transform = 'translateY(' + numObj[i + 1].translate + 'px)'
    }


    // don't forget to change in css
    const numberDelay = 1000,
        frameDelay = 600;

    const defaultSort = (obj, i = 0, trigger = false, count = 0, resolve) => {
        moveFrame(defaultFrame, i)
        setTimeout(() => {
            let triggered = trigger;
            if (+obj[i].elem.innerHTML > +obj[i + 1].elem.innerHTML) {
                triggered = true
                moveNumbers(obj, i)
            }
            setTimeout(() => {
                if (i < obj.length - 2) {
                    defaultSort(obj, i + 1, triggered, count + 1, resolve)
                } else if (triggered) {
                    defaultSort(obj, 0, false, count + 1, resolve)
                } else {
                    resolve(['default', count])
                }
            }, numberDelay)
        }, frameDelay)
    }
    const memorizeSort = (obj, i = 0, k = 0, trigger = false, count = 0, resolve) => {
        moveFrame(memorizeFrame, i)
        setTimeout(() => {
            let triggered = trigger;
            if (+obj[i].elem.innerHTML > +obj[i + 1].elem.innerHTML) {
                triggered = true
                moveNumbers(obj, i)
            }
            setTimeout(() => {
                if (i < obj.length - 2 - k) {
                    memorizeSort(obj, i + 1, k, triggered, count + 1, resolve)
                } else if (triggered) {
                    memorizeSort(obj, 0, k + 1, false, count + 1, resolve)
                } else {
                    resolve(['memo', count])
                }
            }, numberDelay)
        }, frameDelay)
    }
    const returnSort = (obj, i = 0, last = 0, count, resolve) => {
        moveFrame(returnFrame, i)
        setTimeout(() => {
            if (+obj[i].elem.innerHTML > +obj[i + 1].elem.innerHTML) {
                moveNumbers(obj, i)
                setTimeout(() => {
                    returnSort(obj, i - 1 > 0 ? i - 1 : 0, last, count + 1, resolve)
                }, numberDelay)
            } else {
                setTimeout(() => {
                    if (last > i) {
                        returnSort(obj, last, last, count + 1, resolve)
                    } else if (i < obj.length - 2) {
                        returnSort(obj, i + 1, i + 1, count + 1, resolve)
                    } else {
                        resolve(['return', count])
                    }
                }, numberDelay)
            }
        }, frameDelay)
    }

    const twoWaySort = (obj, i = 0, j = amount - 2, trigger = false, count = 0, resolve) => {
        moveFrame(twoWayTopFrame, i)
        moveFrame(twoWayBottomFrame, j)
        setTimeout(() => {
            let triggered = trigger;
            if (+obj[i].elem.innerHTML > +obj[i + 1].elem.innerHTML) {
                triggered = true
                moveNumbers(obj, i)
            }
            if (+obj[j].elem.innerHTML > +obj[j + 1].elem.innerHTML) {
                triggered = true
                moveNumbers(obj, j)
            }
            setTimeout(() => {
                if (i < obj.length - 2) {
                    twoWaySort(obj, i + 1, j - 1, triggered, count + 1, resolve)
                } else if (triggered) {
                    twoWaySort(obj, 0, amount - 2, false, count + 1, resolve)
                } else {
                    resolve(['twoWay', count])
                }
            }, numberDelay)
        }, frameDelay)
    }

    const twoWayMemoSort = (obj, i = 0, j = amount - 2, k, trigger = false, count = 0, resolve) => {
        moveFrame(twoWayReturnTopFrame, i)
        moveFrame(twoWayReturnBottomFrame, j)
        setTimeout(() => {
            let triggered = trigger;
            if (+obj[i].elem.innerHTML > +obj[i + 1].elem.innerHTML) {
                triggered = true
                moveNumbers(obj, i)
            }
            if (+obj[j].elem.innerHTML > +obj[j + 1].elem.innerHTML) {
                triggered = true
                moveNumbers(obj, j)
            }
            setTimeout(() => {
                if (i < obj.length - 2 - k) {
                    twoWayMemoSort(obj, i + 1, j - 1, k, triggered, count + 1, resolve)
                } else if (triggered) {
                    twoWayMemoSort(obj, k + 1, amount - 2 - k - 1, k + 1, false, count + 1, resolve)
                } else {
                    resolve(['twoWayMemo', count])
                }
            }, numberDelay)
        }, frameDelay)
    }

    startBtn.addEventListener('click', async () => {
        if (isSorting) return

        isSorting = true
        newBtn.disabled = true
        startBtn.disabled = true

        const defaultObj = [...defaultColumn].map(elem => ({elem, translate: 0}))
        const memorizeObj = [...memorizeColumn].map(elem => ({elem, translate: 0}))
        const returnObj = [...returnColumn].map(elem => ({elem, translate: 0}))
        const twoWayObj = [...twoWayColumn].map(elem => ({elem, translate: 0}))
        const twoWayReturnObj = [...twoWayReturnColumn].map(elem => ({elem, translate: 0}))

        const defaultPromise = new Promise((resolve) => {
            defaultSort(defaultObj, 0, false, 0, resolve)
        }).then((value) => {
            moveFrame(defaultFrame, 0)
            console.log('1', value)
        })
        const memorizePromise = new Promise((resolve) => {
            memorizeSort(memorizeObj, 0, 0, false, 0, resolve)
        }).then((value) => {
            moveFrame(memorizeFrame, 0)
            console.log('2', value)
        })
        const returnPromise = new Promise((resolve) => {
            returnSort(returnObj, 0, 0, 0, resolve)
        }).then((value) => {
            moveFrame(returnFrame, 0)
            console.log('3', value)
        })
        const twoWayPromise = new Promise((resolve) => {
            twoWaySort(twoWayObj, 0, amount - 2, false, 0, resolve)
        }).then((value) => {
            moveFrame(twoWayTopFrame, 0)
            moveFrame(twoWayBottomFrame, amount - 2)
            console.log('4', value)
        })
        const twoWayReturnPromise = new Promise((resolve) => {
            twoWayMemoSort(twoWayReturnObj, 0, amount - 2, 0,false, 0, resolve)
        }).then((value) => {
            moveFrame(twoWayReturnTopFrame, 0)
            moveFrame(twoWayReturnBottomFrame, amount - 2)
            console.log('5', value)
        })
        Promise.all([defaultPromise, memorizePromise, returnPromise, twoWayPromise, twoWayReturnPromise])
            .then(() => {
                isSorting = false
                newBtn.disabled = false
                startBtn.disabled = false
            })
    })
    newBtn.addEventListener('click', () => {
        if (isSorting) return
        for (let i = 0; i < amount; i++) {
            const newInnerHTML = Math.round(Math.random() * 50).toString()
            defaultColumn[i].innerHTML = newInnerHTML
            memorizeColumn[i].innerHTML = newInnerHTML
            returnColumn[i].innerHTML = newInnerHTML
            twoWayColumn[i].innerHTML = newInnerHTML
            twoWayReturnColumn[i].innerHTML = newInnerHTML
        }
    })
})()