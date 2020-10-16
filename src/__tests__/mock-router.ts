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

//@ts-ignore
window.uni = {
    'navigateTo': async (options: any) => {
        await sleep(1000);
        options.success();
    },

    'switchTab': async (options: any) => {
        await sleep(1000);
        options.success();
    },

    'redirectTo': async (options: any) => {
        await sleep(1000);
        options.success();
    },

    'reLaunch': async (options: any) => {
        await sleep(1000);
        options.success();
    },

    'navigateBack': async (options: any) => {
        await sleep(1000);
        options.success();
    }
}