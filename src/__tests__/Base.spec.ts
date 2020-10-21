import { pagesJSON, sleep } from './mock-router';
import BaseRouter from '../Base';
import { methodMap } from '../config';


const baseRouter = new BaseRouter({
    pagesJSON: pagesJSON
});

beforeEach(() => {
    jest.useFakeTimers();
});
describe('Base', () => {
    it('transitionTo', async () => {
        const methodName = 'push';
        const updateFn = jest.spyOn(baseRouter, 'updateRoute');
            
        const fn = (options: any) => {
            //@ts-ignore
            uni[methodMap[methodName]]({
                url: `${options.pathname}${options.search}`,
                success: options.onCompleteProxy()
            });
        }
        baseRouter.transitionTo('/a', fn);

        // update Route after uni route transition
        expect(updateFn).not.toHaveBeenCalled();
        jest.advanceTimersByTime(1000);
        expect(updateFn).toHaveBeenCalled();
    })
})
