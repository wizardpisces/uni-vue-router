import BaseRouter from '../Base';
import UniRouter from '../UniRouter'
import { methodMap } from '../config';

async function sleep(awaitTime: number = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, awaitTime);
    }) 
}
const pagesJSON = {
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

const baseRouter = new BaseRouter({
    pagesJSON: pagesJSON
});

const router = new UniRouter({
    pagesJSON: pagesJSON
})

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

describe('Base', () => {
    it('transitionTo', async () => {
        const methodName = 'push';
        const updateFn = jest.spyOn(baseRouter, 'updateRoute');
            
        const fn = async (options: any) => {
            //@ts-ignore
            await uni[methodMap[methodName]]({
                url: `${options.pathname}${options.search}`,
                success: options.onCompleteProxy()
            })
            expect(updateFn).toHaveBeenCalled();
        }
        baseRouter.transitionTo('/a', fn);
    
        // update Route after uni route transition
        expect(updateFn).not.toHaveBeenCalled();
        
        await sleep(2000);
    })
})

describe('uniRouter', () => {
    it('update Route after uni route transition', async () => {    
        router.pushTab({ 
            path: '/a'
        })

        // update Route after uni route transition
        expect(router.current.name).toBe(undefined);

        await sleep(1000);

        expect(router.current.name).toBe('a');
    })
})

describe('push', () => {
    it('push router change name and query', async () => {
        const TEST_ID = 'test1';
        router.push({ 
            path: '/a',
            query: {
                id: TEST_ID
            }
        })

        await sleep(1000)
        expect(router.current.name).toBe('a');
        expect(router.current.query.id).toBe(TEST_ID);
    })

    it('push router change index', async () => {
        expect(router.index).toBe(1);

        router.push({ name: 'b' })
        
        await sleep(1000);
        expect(router.index).toBe(2);
    })
})

describe('pushTab', () => {
    it('pushTab change name and query', async () => {
        const TEST_ID = 'test1';
        router.pushTab({ 
            name: 'a',
            query: {
                id: TEST_ID
            }
        })

        await sleep(1000);
        expect(router.current.path).toBe('/a');
        expect(router.current.query.id).toBe(TEST_ID);
    })

    it('pushTab set index 0', async () => {
        expect(router.index).toBe(0);

        router.pushTab({ name: 'b' })
        
        await sleep(1000);
        expect(router.index).toBe(0);
    })
})