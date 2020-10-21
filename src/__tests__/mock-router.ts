export async function sleep(awaitTime: number = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, awaitTime);
    }) 
}

export const pagesJSON = {
    pages: [
        {
            path: "/a",
            name: "a"
        },
        {
            path: "/b",
            name: "b"
        },
        {
            path: "/c",
            name: "c"
        },
    ]
}

//setTimeout 在 promise或者await使用时 jest.advanceTimersByTime 无效
//@ts-ignore
window.uni = {
    'navigateTo': (options: any) => {
        setTimeout(options.success, 1000)
    },

    'switchTab': (options: any) => {
        setTimeout(options.success, 1000)
    },

    'redirectTo': (options: any) => {
        setTimeout(options.success, 1000)
    },

    'reLaunch': (options: any) => {
        setTimeout(options.success, 1000)
    },

    'navigateBack': async (options: any) => {
        setTimeout(options.success, 1000)
    }
}