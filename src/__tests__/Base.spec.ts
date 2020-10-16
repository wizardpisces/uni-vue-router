import { pagesJSON, sleep } from './mock-router';
import BaseRouter from '../Base';
import { methodMap } from '../config';


const baseRouter = new BaseRouter({
    pagesJSON: pagesJSON
});

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
