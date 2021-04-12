import { pagesJSON } from './testUtils';
import UniRouter from '../UniRouter';

let router = new UniRouter({
    pagesJSON: pagesJSON
});

beforeEach(() => {
    jest.useFakeTimers();
});
describe('uniRouter', () => {
    it('update Route after uni route transition', () => {    
        router.pushTab({ 
            path: '/a'
        })
        // update Route after uni route transition
        expect(router.current.name).toBe(undefined);

        jest.advanceTimersByTime(1000);

        expect(router.current.name).toBe('a');
    })
})

describe('push', () => {
    it('push router change name and query', () => {
        const TEST_ID = 'test1';
        router.push({ 
            path: '/a',
            query: {
                id: TEST_ID
            }
        })

        jest.advanceTimersByTime(1000);
        expect(router.current.name).toBe('a');
        expect(router.current.query.id).toBe(TEST_ID);
    })

    it('push router change index', () => {
        expect(router.index).toBe(1);

        router.push({ name: 'b' })
        
        jest.advanceTimersByTime(1000);
        expect(router.index).toBe(2);
    })
})

describe('pushTab', () => {
    it('pushTab change name and query', () => {
        const TEST_ID = 'test1';
        router.pushTab({ 
            name: 'a',
            query: {
                id: TEST_ID
            }
        })

        jest.advanceTimersByTime(1000);
        expect(router.current.path).toBe('/a');
        expect(router.current.query.id).toBe(TEST_ID);
    })

    it('pushTab set index 0', () => {
        router.push({ name: 'c' })

        jest.advanceTimersByTime(1000);

        expect(router.index).toBe(1);

        router.pushTab({ name: 'b' })
        
        jest.advanceTimersByTime(1000);
        expect(router.index).toBe(0);
    })
})

describe('back', () => {
    it('back change name and query', () => {
        const TEST_ID = 'test1';
        const TEST_ID_b = 'test2'
        router.push({ 
            name: 'a',
            query: {
                id: TEST_ID
            }
        })
        router.push({ 
            name: 'b',
            query: {
                id: TEST_ID_b
            }
        })

        jest.advanceTimersByTime(1000);
        expect(router.current.path).toBe('/b');
        expect(router.current.query.id).toBe(TEST_ID_b);
        router.back();
        expect(router.current.path).toBe('/a');
    })
})