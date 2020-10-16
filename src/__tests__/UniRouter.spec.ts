import { pagesJSON, sleep } from './mock-router';
import UniRouter from '../UniRouter';

let router = new UniRouter({
    pagesJSON: pagesJSON
});

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